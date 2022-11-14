import {readAsArrayBuffer} from './asyncReader';
import {getAsset} from './prepareAssets';
import {normalize} from './helpers';
import {$crud} from "../factories/CrudFactory";
import {generateFormData} from "../helpers";

let updatedPdfBytes;

export async function save(
    pdfFile: any,
    objects: Attachments[],
    name: string,
    fileName?: string,
    fileId?: any
) {
    let b;
    const PDFLib = await getAsset('PDFLib');
    const download = await getAsset('download');
    let pdfDoc: {
        getPages: () => any[];
        embedFont: (arg0: unknown) => any;
        embedJpg: (arg0: unknown) => any;
        embedPng: (arg0: unknown) => any;
        embedPdf: (arg0: any) => [any] | PromiseLike<[any]>;
        save: () => any;
    };

    try {
        await fetch(pdfFile).then((res) => res.blob()).then(r => b = r);
        pdfDoc = await PDFLib.PDFDocument.load(await readAsArrayBuffer(b));
    } catch (e) {
        console.log('Failed to load PDF.');
        throw e;
    }

    const pagesProcesses = pdfDoc.getPages().map(async (page, pageIndex) => {
        const pageObjects = objects[pageIndex];
        // 'y' starts from bottom in PDFLib, use this to calculate y
        const pageHeight = page.getHeight();
        const embedProcesses = pageObjects.map(async (object: Attachment) => {
            if (object.type === 'image') {
                const {file, x, y, width, height} = object as ImageAttachment;
                let img: any;
                try {
                    if (file.type === 'image/jpeg') {
                        img = await pdfDoc.embedJpg(await readAsArrayBuffer(file));
                    } else {
                        img = await pdfDoc.embedPng(await readAsArrayBuffer(file));
                    }
                    return () =>
                        page.drawImage(img, {
                            x,
                            y: pageHeight - y - height,
                            width,
                            height,
                        });
                } catch (e) {
                    console.log('Failed to embed image.', e);
                    throw e;
                }
            } else if (object.type === 'drawing') {
                const {
                    x,
                    y,
                    path,
                    scale,
                    stroke,
                    strokeWidth,
                } = object as DrawingAttachment;
                const {
                    pushGraphicsState,
                    setLineCap,
                    popGraphicsState,
                    setLineJoin,
                    LineCapStyle,
                    LineJoinStyle,
                    rgb,
                } = PDFLib;
                return () => {
                    page.pushOperators(
                        pushGraphicsState(),
                        setLineCap(LineCapStyle.Round),
                        setLineJoin(LineJoinStyle.Round)
                    );

                    const color = window.w3color(stroke!).toRgb();

                    page.drawSvgPath(path, {
                        borderColor: rgb(
                            normalize(color.r),
                            normalize(color.g),
                            normalize(color.b)
                        ),
                        borderWidth: strokeWidth,
                        scale,
                        x,
                        y: pageHeight - y,
                    });
                    page.pushOperators(popGraphicsState());
                };
            }
        });
        const s = `<svg width="100" height="100">
   <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />`;
        page.drawSvgPath(s, {
            x: 100,
            y: 100,
            borderWidth: 2,
            scale: 1
        });
        // embed objects in order
        const drawProcesses: any[] = await Promise.all(embedProcesses);
        drawProcesses.forEach((p) => p());
    });
    await Promise.all(pagesProcesses);
    try {
        updatedPdfBytes = await pdfDoc.save()
        download(updatedPdfBytes, name, 'application/pdf');
        await $crud.put("file/update-file",
            generateFormData({
                filename: updatedPdfBytes,
                docname: fileName,
                fileId: fileId,
            })
        );
    } catch (e) {
        console.log('Failed to save PDF.');
        throw e;
    }
}

export async function downloadPdf() {
    const download = await getAsset('download');
    download(updatedPdfBytes, name, 'application/pdf');
}