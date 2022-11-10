import React, { useState, useLayoutEffect, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import { ReactStateDeclaration } from "@uirouter/react";
import { Container, Grid, Button, Segment } from "semantic-ui-react";
import { MenuBar } from "./components/MenuBar";
import { DrawingModal } from "./modals/components/DrawingModal";
import { HelpModal } from "./modals/components/HelpModal";
import { usePdf, Pdf } from "./hooks/usePdf";
import { AttachmentTypes } from "./entities";
import { ggID } from "./utils/helpers";
import { useAttachments } from "./hooks/useAttachments";
import { useUploader, UploadTypes } from "./hooks/useUploader";
import { Empty } from "./components/Empty";
import { Page } from "./components/Page";
import { Attachments } from "./components/Attachments";
import { $state } from "../../../router";
import { $crud } from "../../../factories/CrudFactory";
import "index.css";

const App: React.FC = () => {
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

  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [docFileId, setDocFileId] = useState<string>("");
  const [fileOwnerId, setFileOwnerId] = useState<string>("");
  const [docName, setDocName] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<any>();
  const [files, setFile] = useState<any>();
  const DocFileData = localStorage.getItem("fileDocId");

  const { fileId } = $state.params;

  const retrieveFile = async () => {
    try {
      setLoading(true);
      const { data } = await $crud.get(`file/get-file/${fileId}`);

      setFileOwnerId(data[0].owner._id);

      setPdfFile(data[0].file_url);
      setDocName(data[0].docname);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveFile();
  }, []);

  const initializePageAndAttachments = (pdfDetails: Pdf) => {
    initialize(pdfDetails);
    const numberOfPages = pdfDetails.pages.length;
    resetAttachments(numberOfPages);
  };

  const {
    inputRef: pdfInput,
    handleClick: handlePdfClick,
    isUploading,
    onClick,
    upload: uploadPdf,
  } = useUploader({
    use: UploadTypes.PDF,
    afterUploadPdf: initializePageAndAttachments,
  });

  const {
    inputRef: imageInput,
    handleClick: handleImageClick,
    onClick: onImageClick,
    upload: uploadImage,
  } = useUploader({
    use: UploadTypes.IMAGE,
    afterUploadAttachment: addAttachment,
  });

  const addText = () => {
    const newTextAttachment: TextAttachment = {
      id: ggID(),
      type: AttachmentTypes.TEXT,
      x: 0,
      y: 0,
      width: 120,
      height: 25,
      size: 16,
      lineHeight: 1.4,
      fontFamily: "Times-Roman",
      text: "Enter Text Here",
    };
    addAttachment(newTextAttachment);
  };

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

  const hiddenInputs = (
    <>
      <input
        data-testid="pdf-input"
        ref={pdfInput}
        type="file"
        name="pdf"
        id="pdf"
        accept="application/pdf"
        onChange={uploadPdf}
        onClick={onClick}
        style={{ display: "none" }}
      />
      <input
        ref={imageInput}
        type="file"
        id="image"
        name="image"
        accept="image/*"
        onClick={onImageClick}
        style={{ display: "none" }}
        onChange={uploadImage}
      />
    </>
  );

  const handleSavePdf = () => savePdf(allPageAttachments);

  return (
    <Container style={{ margin: 30 }}>
      {hiddenInputs}
      <MenuBar
        openHelp={() => setHelpModalOpen(true)}
        savePdf={handleSavePdf}
        addText={addText}
        addImage={handleImageClick}
        addDrawing={() => setDrawingModalOpen(true)}
        savingPdfStatus={isSaving}
        uploadNewPdf={handlePdfClick}
        isPdfLoaded={!!files}
      />

      {!files ? (
        <Empty loading={isUploading} uploadPdf={handlePdfClick} />
      ) : (
        <Grid>
          <Grid.Row>
            <Grid.Column width={3} verticalAlign="middle" textAlign="left">
              {isMultiPage && !isFirstPage && (
                <Button circular icon="angle left" onClick={previousPage} />
              )}
            </Grid.Column>
            <Grid.Column width={10}>
              {currentPage && (
                <Segment
                  data-testid="page"
                  compact
                  stacked={isMultiPage && !isLastPage}
                >
                  <div style={{ position: "relative" }}>
                    <Page
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
            </Grid.Column>
            <Grid.Column width={3} verticalAlign="middle" textAlign="right">
              {isMultiPage && !isLastPage && (
                <Button circular icon="angle right" onClick={nextPage} />
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )}
      <DrawingModal
        open={drawingModalOpen}
        dismiss={() => setDrawingModalOpen(false)}
        confirm={addDrawing}
      />

      <HelpModal open={helpModalOpen} dismiss={() => setHelpModalOpen(false)} />
    </Container>
  );
};

// export default App;
export const states: ReactStateDeclaration[] = [
  {
    url: "/file-viewer-test2?:fileId",
    name: "FileViewerTest2",
    data: {
      title: "Files",
      loggedIn: true,
    },
    component: App,
  },
];

// ERROR in ./node_modules/semantic-ui-css/semantic.min.css 11:0
// Module parse failed: Unexpected character '@' (11:0)
// You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
// |  *
// |  */
// > @import url(https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic&subset=latin);/*!
// |  * # Semantic UI 2.5.0 - Reset
// |  * http://github.com/semantic-org/semantic-ui/
//  @ ./src/pages/Test/fileReader/App.tsx 29:0-42
//  @ ./src/router.ts
//  @ ./src/AppComponent.tsx
//  @ ./src/index.ts
//  @ multi ./src/index.ts ./src/index.scss

// "scripts": {
//   "watch": "./node_modules/.bin/webpack --watch --config webpack.dev.js",
// },

// "scripts": {
//     "watch": "./node_modules/.bin/webpack --mode development --watch --progress",
//     "build": "./node_modules/.bin/webpack --mode production"
// },
