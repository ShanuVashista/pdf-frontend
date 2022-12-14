import React, {useEffect, useLayoutEffect, useState} from "react";
import {ReactStateDeclaration} from "@uirouter/react";

import {Segment} from "semantic-ui-react";
import {MenuBar} from "./components/MenuBar";
import {DrawingModal} from "./modals/components/DrawingModal";
import {HelpModal} from "./modals/components/HelpModal";
import {Pdf, usePdf} from "./hooks/usePdf";
import {AttachmentTypes} from "./entities";
import {ggID} from "./utils/helpers";
import {useAttachments} from "./hooks/useAttachments";
import {UploadTypes, useUploader} from "./hooks/useUploader";
import {PdfPage} from "./components/Page";
import {Attachments} from "./components/Attachments";
import {Grid, IconButton} from "@material-ui/core";
import {ChevronLeft, ChevronRight} from "react-feather";
import {$crud} from "./factories/CrudFactory";
import {FileType} from "./types";
import {downloadPdf} from "./utils/pdf";

export function Dashboard() {
    const [fileSaved, setFileSaved] = useState<boolean>(false);
    const [demoFile, setDemoFile] = useState<FileType[]>(null);
    const retrieveFile = async () => {
        const {data} = await $crud.get(`file/get-file/63719cb3ad5e15d796285f6c`);
        setDemoFile(data);
    };

    const [helpModalOpen, setHelpModalOpen] = useState(false);
    const [drawingModalOpen, setDrawingModalOpen] = useState(false);
    const {
        file,
        initialize,
        pageIndex,
        isMultiPage,
        isFirstPage,
        isLastPage,
        currentPage,
        isSaving,
        savePdf,
        previousPage,
        nextPage,
        setDimensions,
        name,
        dimensions,
    } = usePdf();
    const {
        add: addAttachment,
        allPageAttachments,
        pageAttachments,
        reset: resetAttachments,
        update,
        remove,
        setPageIndex,
    } = useAttachments();

    const initializePageAndAttachments = (pdfDetails: Pdf) => {
        initialize(pdfDetails);
        const numberOfPages = pdfDetails.pages.length;
        resetAttachments(numberOfPages);
    };

    const {
        upload: uploadPdf,
    } = useUploader({
        use: UploadTypes.PDF,
        afterUploadPdf: initializePageAndAttachments,
    });

    const addDrawing = (drawing?: {
        width: number;
        height: number;
        path: string;
    }) => {
        if (!drawing) return;

        const newDrawingAttachment: DrawingAttachment = {
            id: ggID(),
            type: AttachmentTypes.DRAWING,
            ...drawing,
            x: 0,
            y: 0,
            scale: 1,
        };
        addAttachment(newDrawingAttachment);
    };

    useLayoutEffect(() => setPageIndex(pageIndex), [pageIndex, setPageIndex]);

    const handleSavePdf = () => {
        setFileSaved(false);
        try {
            savePdf(allPageAttachments, demoFile[0].docname, demoFile[0]._id);
        } finally {
            setFileSaved(true);
        }
    };


    useEffect(() => {
        retrieveFile();
    }, []);

    useEffect(() => {
        if (demoFile)
            uploadPdf(demoFile[0].file_url);
    }, [demoFile]);

    return (
        <Grid style={{width: "100%"}}>
            <MenuBar
                savePdf={handleSavePdf}
                downloadPdf={downloadPdf}
                isPdfSaved={fileSaved}
                addDrawing={() => setDrawingModalOpen(true)}
                savingPdfStatus={isSaving}
                isPdfLoaded={!!file}
            />

            {!file ? null : (
                <Grid container alignItems="center" className="p-2 p-2-all">
                    <Grid>
                        {isMultiPage && !isFirstPage && (
                            <IconButton color="primary" onClick={previousPage}>
                                <ChevronLeft/>
                            </IconButton>
                        )}
                    </Grid>
                    <Grid item xs container justifyContent="center">
                        {currentPage && (
                            <Segment compact stacked={isMultiPage && !isLastPage}>
                                <div style={{position: "relative"}}>
                                    <PdfPage
                                        dimensions={dimensions}
                                        updateDimensions={setDimensions}
                                        page={currentPage}
                                    />
                                    {dimensions && (
                                        <Attachments
                                            pdfName={name}
                                            removeAttachment={remove}
                                            updateAttachment={update}
                                            pageDimensions={dimensions}
                                            attachments={pageAttachments}
                                        />
                                    )}
                                </div>
                            </Segment>
                        )}
                    </Grid>
                    <Grid>
                        {isMultiPage && !isLastPage && (
                            <IconButton color="primary" onClick={nextPage}>
                                <ChevronRight/>
                            </IconButton>
                        )}
                    </Grid>
                </Grid>
            )}

            <DrawingModal
                open={drawingModalOpen}
                dismiss={() => setDrawingModalOpen(false)}
                confirm={addDrawing}
            />

            <HelpModal open={helpModalOpen} dismiss={() => setHelpModalOpen(false)}/>
        </Grid>
    );
}

export const states: ReactStateDeclaration[] = [
    {
        url: "/dashboard",
        name: "dashboard",
        data: {
            title: "Dashboard",
            loggedIn: true,
        },
        component: Dashboard,
    },
];
