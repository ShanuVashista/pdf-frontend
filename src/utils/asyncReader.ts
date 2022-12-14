import {getAsset} from './prepareAssets';

export const readAsArrayBuffer = (
    file: File
): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
};

export const readAsImage = (src: Blob | string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        if (src instanceof Blob) {
            const url = window.URL.createObjectURL(src);
            img.src = url;
        } else {
            img.src = src;
        }
    });
};

export const readAsDataURL = (
    file: File
): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

interface PDF {
    numPages: number;
    getPage: (index: number) => Promise<any>;
}

export const readAsPDF = async (file): Promise<PDF> => {
    const PDFLib = await getAsset('PDFLib');
    const pdfjsLib = await getAsset('pdfjsLib');
    pdfjsLib.getDocument(file).promise.then((pdf) => {
        pdf.getAttachments(file).then((e => console.log(e)))
    })
    return pdfjsLib.getDocument(file).promise;
};
