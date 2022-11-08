import React, { useState, useEffect, useRef } from "react";
import { ReactStateDeclaration, UISref } from "@uirouter/react";
import {
  Button,
  Grid,
  Typography,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import moment from "moment";
import { $state } from "../../router";
import { $crud } from "../../factories/CrudFactory";
import { generateFormData } from "../../helpers";
import { FileType } from "../../types";
import { useCurrentUser } from "../../factories/UserFactory";
import SignatureCanvas from "react-signature-canvas";
import { Image, FileText, PenTool } from "react-feather";
import { ggID } from "./utils/helper";
import prepareAssets, { fetchFont } from "./utils/prepareAssets";
import PdfViewerComponent from "./PdfViewerComponent";

import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

const FileViewerTest = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { fileId } = $state.params;
  const user = useCurrentUser();
  const [file, setFile] = useState<any>();
  const [fileName, setFileName] = useState<string>("");
  const [docFileId, setDocFileId] = useState<string>("");
  const [fileOwnerId, setFileOwnerId] = useState<string>("");
  const [instance, setInstance] = useState(null);
  const [pdfFile, setPdfFile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [selectedPageIndex, setSelectedPageIndex] = useState(-1);

  const DocFileData = localStorage.getItem("fileDocId");
  const UserId = user._id;

  let allObjects = [];
  let currentFont = "Times-Roman";

  const genID = ggID();

  const sigCanvasRef = useRef({});

  const onAddTextField = () => {
    addTextField();
    // if (selectedPageIndex >= 0) {
    // }
  };

  const addTextField = (text = "Guest") => {
    const id = genID();

    fetchFont(currentFont);

    const object = {
      id,
      text,
      type: "text",
      size: 16,
      width: 0, // recalculate after editing
      lineHeight: 1.4,
      fontFamily: currentFont,
      x: 0,
      y: 0,
    };

    allObjects = allObjects.map((objects, pIndex) =>
      pIndex === selectedPageIndex ? [...objects, object] : objects
    );
  };

  const onAddDrawing = () => {
    if (selectedPageIndex >= 0) {
      // addingDrawing = true;
    }
  };

  const retrieveFile = async () => {
    try {
      setLoading(true);
      const { data } = await $crud.get(`file/get-file/${fileId}`);

      setFile(data[0]);

      setFileOwnerId(data[0].owner._id);

      setPdfFile(data[0].file_url);
    } finally {
      setLoading(false);
    }
  };

  const update = async () => {
    try {
      setLoading(true);
      const { docViewer, annotManager } = instance;
      const doc = docViewer.getDocument();
      const xfdfString = await annotManager.exportAnnotations({
        widgets: true,
        fields: true,
      });
      const data = await doc.getFileData({ xfdfString });
      const arr = new Uint8Array(data);
      const blob = new Blob([arr], { type: "application/pdf" });
      await $crud.put(
        "file/update-file",
        generateFormData({
          filename: blob,
          docname: file.docname,
          fileId: fileId,
        })
      );
    } finally {
      setLoading(false);
      $state.go("files");
    }
  };

  const addFileSignature = async () => {
    try {
      setLoading(true);
      const { docViewer, annotManager } = instance;
      const doc = docViewer.getDocument();
      const xfdfString = await annotManager.exportAnnotations({
        widgets: true,
        fields: true,
      });
      const data = await doc.getFileData({ xfdfString });
      const arr = new Uint8Array(data);
      const blob = new Blob([arr], { type: "application/pdf" });

      await $crud.put(
        "file/sign-file",
        generateFormData({
          filename: blob,
          docname: file.docname,
          fileId: fileId,
          docFileId: docFileId,
        })
      );
    } finally {
      setLoading(false);
      $state.go("files");
    }
  };

  useEffect(() => {
    retrieveFile();
  }, []);

  useEffect(() => {
    setFileName(file?.docname);
    setDocFileId(DocFileData);
  }, [file]);

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offSet) {
    setPageNumber((prevPageNumber) => prevPageNumber + offSet);
  }

  function changePageBack() {
    changePage(-1);
  }

  function changePageNext() {
    changePage(+1);
  }

  return (
    <Grid item xs container direction="column" wrap="nowrap">
      <Grid container alignItems="center" className="p-2 bg-white">
        <Grid item xs={2}>
          <Typography
            variant="h6"
            component={Grid}
            item
            xs
            className="p-2 font-weight-bold"
          >
            {fileName}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container alignItems="center">
            <Grid item xs={6} className="p-2 bg-gray-400">
              <IconButton>
                <Tooltip title="Upload Image file">
                  <Image className="text-primary" size={24} />
                </Tooltip>
              </IconButton>
              <IconButton onClick={onAddTextField}>
                <Tooltip title="Add Text">
                  <FileText className="text-primary" size={24} />
                </Tooltip>
              </IconButton>
              <IconButton onClick={onAddDrawing}>
                <Tooltip title="Draw signature">
                  <PenTool className="text-primary" size={24} />
                </Tooltip>
              </IconButton>
            </Grid>
            <Grid item xs={6}></Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          {UserId !== fileOwnerId ? (
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              onClick={addFileSignature}
            >
              Sign the file & send to the Review
            </Button>
          ) : (
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              onClick={update}
            >
              Update
            </Button>
          )}

          <Button
            disabled={loading}
            variant="contained"
            color="secondary"
            className="ml-2"
            onClick={async () => await instance.downloadPdf()}
          >
            Download
          </Button>
        </Grid>
      </Grid>

      {/* <Grid container alignItems="center" className="p-2 bg-black">
        <Grid item xs={12}>
          <SignatureCanvas penColor="black" ref={sigCanvasRef} />
        </Grid>
      </Grid> */}

      <Grid
        container
        alignItems="center"
        className="p-2 bg-white"
        style={{ maxHeight: "100vh" }}
      >
        <Grid item xs={3}></Grid>
        <Grid item xs={6}>
          <iframe
            title="pdframe"
            src={pdfFile}
            width="100%"
            style={{
              height: "82vh",
              margin: "auto",
            }}
          />

          {/* <header className="App-header">
            <Document file="/sample.pdf" onLoadSuccess={onDocumentLoadSuccess}>
              <Page height="600" pageNumber={pageNumber} />
            </Document>
            <p>
              Page {pageNumber} of {numPages}
            </p>
            {pageNumber > 1 && (
              <button onClick={changePageBack}>Previous Page</button>
            )}
            {pageNumber < numPages && (
              <button onClick={changePageNext}>Next Page</button>
            )}
          </header> */}
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </Grid>
  );
};

export const states: ReactStateDeclaration[] = [
  {
    url: "/file-viewer-test?:fileId",
    name: "FileViewerTest",
    data: {
      title: "Files",
      loggedIn: true,
    },
    component: FileViewerTest,
  },
];
