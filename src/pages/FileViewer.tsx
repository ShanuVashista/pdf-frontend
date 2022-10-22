import React, {useEffect, useRef, useState} from "react";
import {Button, Grid, Typography} from "@material-ui/core";
import {ReactStateDeclaration} from "@uirouter/react";
import {$state} from "../router";
import WebViewer from "@pdftron/webviewer";
import {$crud} from "../factories/CrudFactory";
import {generateFormData} from "../helpers";
import {FileType} from "../types";

export function FileViewer() {
    const ref = useRef<HTMLDivElement>(null);
    const {fileId} = $state.params;
    const [file, setFile] = useState<FileType>(null);
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
                // @ts-ignore
                const tool = instance.Core.getTool("AnnotationCreateRubberStamp");
                tool.setStandardStamps(["Approved", "AsIs", data[0].file_url]);
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
                    {file?.docname}
                </Typography>
                <Button
                    disabled={loading}
                    variant="contained"
                    color="primary"
                    onClick={update}
                >
                    Update
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
