import { readAsArrayBuffer } from "./asyncReader";
import { getAsset } from "./prepareAssets";
import { normalize } from "./helpers";
import { $crud } from "../factories/CrudFactory";
import { generateFormData } from "../helpers";
import moment from "moment";

let updatedPdfBytes;

export async function save(
  pdfFile: any,
  objects: Attachments[],
  name: string,
  fileName?: string,
  fileId?: any,
  fileData?: any
) {
  let b;
  const PDFLib = await getAsset("PDFLib");
  let pdfDoc: {
    getPages: () => any[];
    embedFont: (arg0: unknown) => any;
    embedJpg: (arg0: unknown) => any;
    embedPng: (arg0: unknown) => any;
    embedPdf: (arg0: any) => [any] | PromiseLike<[any]>;
    save: () => any;
  };

  try {
    await fetch(pdfFile)
      .then((res) => res.blob())
      .then((r) => (b = r));
    pdfDoc = await PDFLib.PDFDocument.load(await readAsArrayBuffer(b));
    console.warn(pdfDoc);
  } catch (e) {
    console.log("Failed to load PDF.");
    throw e;
  }

  const pages = pdfDoc.getPages();

  const {
    pushGraphicsState,
    setLineCap,
    setLineJoin,
    LineCapStyle,
    LineJoinStyle,
    rgb,
  } = PDFLib;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    const pageObjects = objects[i];
    // 'y' starts from bottom in PDFLib, use this to calculate y
    const pageHeight = page.getHeight();
    const pageWidth = page.getWidth();

    page.pushOperators(
      pushGraphicsState(),
      setLineCap(LineCapStyle.Round),
      setLineJoin(LineJoinStyle.Round)
    );

    if (pageObjects?.length) {
      for (let j = 0; j < pageObjects.length; j++) {
        const object: Attachment = pageObjects[j];

        if (object.type === "image") {
          const { file, x, y, width, height } = object as ImageAttachment;
          let img: any;
          try {
            if (file.type === "image/jpeg") {
              img = await pdfDoc.embedJpg(await readAsArrayBuffer(file));
            } else {
              img = await pdfDoc.embedPng(await readAsArrayBuffer(file));
            }

            page.drawImage(img, {
              x,
              y: pageHeight - y - height,
              width,
              height,
            });
          } catch (e) {
            console.log("Failed to embed image.", e);
            throw e;
          }
        } else if (object.type === "drawing") {
          const { x, y, path, scale, stroke, strokeWidth } =
            object as DrawingAttachment;

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
        }
      }
    }
    const whiteImage = await pdfDoc.embedPng(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAApcAAABkCAYAAADT9RsPAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAHoSURBVHgB7dZBAQAgDAChaf/OuhD3hBSctwYAAAJ3AAAgIpcAAGTkEgCAjFwCAJCRSwAAMnIJAEBGLgEAyMglAAAZuQQAICOXAABk5BIAgIxcAgCQkUsAADJyCQBARi4BAMjIJQAAGbkEACAjlwAAZOQSAICMXAIAkJFLAAAycgkAQEYuAQDIyCUAABm5BAAgI5cAAGTkEgCAjFwCAJCRSwAAMnIJAEBGLgEAyMglAAAZuQQAICOXAABk5BIAgIxcAgCQkUsAADJyCQBARi4BAMjIJQAAGbkEACAjlwAAZOQSAICMXAIAkJFLAAAycgkAQEYuAQDIyCUAABm5BAAgI5cAAGTkEgCAjFwCAJCRSwAAMnIJAEBGLgEAyMglAAAZuQQAICOXAABk5BIAgIxcAgCQkUsAADJyCQBARi4BAMjIJQAAGbkEACAjlwAAZOQSAICMXAIAkJFLAAAycgkAQEYuAQDIyCUAABm5BAAgI5cAAGTkEgCAjFwCAJCRSwAAMnIJAEBGLgEAyMglAAAZuQQAICOXAABk5BIAgIxcAgCQkUsAADJyCQBARi4BAMjIJQAAGbkEACAjlwAAZOQSAICMXAIAkJFLAAAycgkAQEYuAQDIyCUAABm5BAAgI5cAAGTkEgCAzAf7xATEyEUOBAAAAABJRU5ErkJggg=="
    );

    page.drawImage(whiteImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: 50,
    });

    page.drawText(`${fileData.owner.id} / ${moment().format("llll")}`, {
      x: 20,
      y: 20,
      size: 15,
      color: rgb(normalize(164), normalize(153), normalize(153)),
    });
  }

  try {
    updatedPdfBytes = await pdfDoc.save();
    const blob = new Blob(
      [
        new Uint8Array(
          updatedPdfBytes.buffer,
          updatedPdfBytes.byteOffset,
          updatedPdfBytes.length
        ),
      ],
      { type: "application/pdf" }
    );
    await $crud.put(
      "file/update-file",
      generateFormData({
        filename: blob,
        docname: fileName,
        fileId: fileId,
      })
    );
  } catch (e) {
    console.log("Failed to save PDF.");
    throw e;
  }
}

export async function downloadPdf() {
  const download = await getAsset("download");
  download(updatedPdfBytes, name, "application/pdf");
}
