import React, { useState, useEffect, useRef } from "react";
import { ReactStateDeclaration, UISref } from "@uirouter/react";
import { Button, Grid, Typography, TextField } from "@material-ui/core";
import moment from "moment";
import WebViewer from "@pdftron/webviewer";
import { $state } from "../../router";
import { $crud } from "../../factories/CrudFactory";
import { generateFormData } from "../../helpers";
import { FileType } from "../../types";
import { useCurrentUser } from "../../factories/UserFactory";

const FileViewerTest = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { fileId } = $state.params;
  const user = useCurrentUser();
  const [file, setFile] = useState<FileType>(null);
  const [fileName, setFileName] = useState<string>("");
  const [docFileId, setDocFileId] = useState<string>("");
  const [fileOwnerId, setFileOwnerId] = useState<string>("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState("");
  const [urlVal, setUrlVal] = useState("");

  const DocFileData = localStorage.getItem("fileDocId");
  const UserId = user._id;

  const _base64ToArrayBuffer = (dataURI) => {
    return Uint8Array.from(window.atob(dataURI), (v) => v.charCodeAt(0));
  };

  const fileToBase64 = (filename, filepath) => {
    console.log("filename", filename);
    console.log("filepath", filepath);

    return new Promise((resolve) => {
      var file = new File([filename], filepath);
      var reader = new FileReader();
      //   Read file content on file loaded event
      reader.onloadend = function (event) {
        resolve(event.target.result);
      };

      reader.readAsDataURL(file);
    });
  };

  const base64toBlob = (data: string) => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    const base64WithoutPrefix = data.substr(
      "data:application/pdf;base64,".length
    );

    const bytes = atob(base64WithoutPrefix);
    console.log("bytes", bytes);

    let length = bytes.length;
    console.log("length", length);

    let out = new Uint8Array(length);
    console.log("out", out);

    while (length--) {
      out[length] = bytes.charCodeAt(length);
    }

    return new Blob([out], { type: "application/pdf" });
  };

  const retrieveFile = async () => {
    try {
      setLoading(true);
      const { data } = await $crud.get(`file/get-file/${fileId}`);

      setFile(data);
      setFileOwnerId(data[0].owner._id);

      let base64 = await fileToBase64(data[0].docname, data[0].file_url);

      console.log(base64);

      let unit8 = await _base64ToArrayBuffer(base64);

      console.log("unit8", unit8);

      const blob = await base64toBlob(base64);
      const url = URL.createObjectURL(blob);
      console.log("url", url);

      setUrlVal(url);
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

  return (
    <Grid item xs container direction="column" wrap="nowrap">
      <Grid container alignItems="center" className="p-2 bg-white">
        <Typography
          variant="h6"
          component={Grid}
          item
          xs
          className="p-2 font-weight-bold"
        >
          {fileName}
        </Typography>

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
      {/* <Grid item xs ref={ref} /> */}

      <Grid container alignItems="center" className="p-2 bg-white">
        {/* <canvas src={pdfFile} height="200px" /> */}
        {/* <img src={pdfFile} height="200px" /> */}
        {/* <Viewer fileUrl={urlVal} /> */}
      </Grid>
    </Grid>
  );
};

export const states: ReactStateDeclaration[] = [
  {
    url: "/file-viewer-test?",
    name: "FileViewerTest",
    data: {
      title: "Files",
      loggedIn: true,
    },
    component: FileViewerTest,
  },
];
