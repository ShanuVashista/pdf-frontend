import React from 'react';
import {readAsPDF} from '../utils/asyncReader';
import {Pdf} from './usePdf';

type ActionEvent<T> = React.TouchEvent<T> | React.MouseEvent<T>;

export enum UploadTypes {
    PDF = 'pdf',
    IMAGE = 'image',
}

const handlers = {
    pdf: async (file: File) => {
        try {
            const pdf = await readAsPDF(file);
            return {
                file,
                name: file.name,
                pages: Array(pdf.numPages)
                    .fill(0)
                    .map((_, index) => pdf.getPage(index + 1)),
            } as Pdf;
        } catch (error) {
            console.log('Failed to load pdf', error);
            throw new Error('Failed to load PDF');
        }
    }
};

/**
 * @function useUploader
 *
 * @description This hook handles pdf and image uploads
 *
 * @
 * @param use UploadTypes
 */
export const useUploader = ({use, afterUploadPdf}: {
    use: UploadTypes;
    afterUploadPdf?: (upload: Pdf) => void;
    afterUploadAttachment?: (upload: Attachment) => void;
}) => {
    const upload = async (file) => {
        const result = await handlers[use](file);

        if (use === UploadTypes.PDF && afterUploadPdf) {
            afterUploadPdf(result as Pdf);
        }

        return;
    };

    return {
        upload
    };
};
