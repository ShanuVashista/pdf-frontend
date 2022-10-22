import React, {useEffect, useRef, useState} from "react";
import {Button, Grid, Typography} from "@material-ui/core";
import {ReactStateDeclaration} from "@uirouter/react";
import {$state} from "../router";
import WebViewer from "@pdftron/webviewer";
import {$crud} from "../factories/CrudFactory";
import {generateFormData} from "../helpers";
import {FileType} from "../types";
import {useCurrentUser} from "../factories/UserFactory";
import moment from "moment";

export function FileViewer() {
    const ref = useRef<HTMLDivElement>(null);
    const {fileId} = $state.params;
    const user = useCurrentUser();
    const [file, setFile] = useState<FileType>(null);
    const [fileName, setFileName] = useState<string>("");
    const [instance, setInstance] = useState(null);
    const [loading, setLoading] = useState(false);

    const retrieveFile = async () => {
        try {
            setLoading(true);
            const {data} = await $crud.get(`file/get-file/${fileId}`);
            setFile(data);
            WebViewer({
                    path: "pdf-tron",
                    initialDoc: data[0].file_url,
                }, ref.current as HTMLDivElement
            ).then((instance) => {
                setInstance(instance);
                const {Annotations, annotationManager, documentViewer} = instance.Core;
                instance.UI.setHeaderItems(function (header) {
                    header.update([]);
                    const toolsOverlay = header
                        .getHeader("toolbarGroup-Annotate")
                        .get("toolsOverlay");
                    header.getHeader("default").push({
                        type: "toolGroupButton",
                        toolGroup: "signatureTools",
                        dataElement: "signatureToolGroupButton",
                        title: "annotation.signature",
                    });
                    header.push(toolsOverlay);
                });
                instance.UI.disableElements(["ribbons"]);
                instance.UI.disableElements(["toolsHeader"]);

                documentViewer.addEventListener('annotationsLoaded', () => {
                    const annot = new Annotations.StampAnnotation({
                        X: 10,
                        Y: documentViewer.getPageHeight(1) - 60,
                        Opacity: 0.4,
                        Width: 300,
                        Height: 50,
                    });

                    annot.setStampText(`${user._id} / ${moment().format("MMM DD, YYYY HH:mm:ss")}`);

                    annotationManager.addAnnotation(annot);
                    annotationManager.redrawAnnotation(annot);
                });
            });
        } finally {
            setLoading(false);
        }
    };

    const update = async () => {
        try {
            setLoading(true);
            const {docViewer, annotManager} = instance;
            const doc = docViewer.getDocument();
            const xfdfString = await annotManager.exportAnnotations({
                widgets: true,
                fields: true,
            });
            const data = await doc.getFileData({xfdfString});
            const arr = new Uint8Array(data);
            const blob = new Blob([arr], {type: "application/pdf"});
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

    useEffect(() => {
        retrieveFile();
    }, []);

    useEffect(() => {
        setFileName(file?.docname)
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
                <Button
                    disabled={loading}
                    variant="contained"
                    color="primary"
                    onClick={update}
                >
                    Update
                </Button>
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
            <Grid item xs ref={ref}/>
        </Grid>
    );
}

export const states: ReactStateDeclaration[] = [
    {
        url: "/file-viewer?:fileId",
        name: "fileViewer",
        data: {
            title: "File Viewer",
            loggedIn: true,
        },
        component: FileViewer,
    },
];
