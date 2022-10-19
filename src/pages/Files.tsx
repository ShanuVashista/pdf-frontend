import React, {useEffect, useState} from "react";
import {ReactStateDeclaration, UISref} from "@uirouter/react";
import {Button, Divider, Grid, IconButton, Paper, Tooltip, Typography} from "@material-ui/core";
import {Edit, File, Share2, Trash, Upload} from "react-feather";
import {FileType} from "../types";
import {$crud} from "../factories/CrudFactory";
import {ShareDialog} from "../Dialogs/ShareDialog";
import {generateFormData} from "../helpers";

export function Files() {
    const [files, setFiles] = useState<FileType[]>([]);
    const [file, setFile] = useState<FileType>(null);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const retrieveFiles = async () => {
        const {data} = await $crud.post("file/list-files", {
            limit: "10",
            page: "1"
        });
        setFiles(data);
    };

    const deleteFile = async (id) => {
        await $crud.confirm({
            textContent: "This file won't be revert."
        });
        await $crud.put(`file/delete-file/${id}`);
        retrieveFiles();
    }

    const uploadFile = async () => {
        setLoading(true);
        try {
            const file = await $crud.chooseFile({accept: "application/pdf"});
            await $crud.post("file/add-file", generateFormData({
                    filename: file,
                    docname: file.name
                })
            );
        } finally {
            retrieveFiles();
            setLoading(false);
        }
    };

    useEffect(() => {
        retrieveFiles();
    }, []);

    return <Grid className="p-2 p-2-all">
        <Grid container alignItems="center" className="p-2-all">
            <Typography component={Grid} item xs variant="h5" className="font-weight-bold">
                PDF Files
            </Typography>
            <Grid className="p-0">
                <Grid container alignItems="center" className="p-2-all">
                    <Grid>
                        <input
                            accept="application/pdf"
                            className="d-none"
                            id="contained-button-file"
                            type="file"
                        />
                        <Button size="small" variant="outlined" onClick={uploadFile}>
                            <Upload size={16} className="mr-2"/> Upload
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        <Grid container alignItems="center" className="p-2-all">
            {
                files.map((file, index) => <Grid item xs={6} md={4} lg={3} key={index}>
                    <Paper elevation={1}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} className="p-3 text-center position-relative">
                                <File size={180} className="text-success"/>
                                <IconButton
                                    style={{top: 12, right: 12}}
                                    className="position-absolute"
                                    onClick={() => {
                                        setShow(true);
                                        setFile(file);
                                    }}
                                >
                                    <Tooltip title="Share File For Signature">
                                        <Share2 size={20}/>
                                    </Tooltip>
                                </IconButton>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider/>
                            </Grid>
                            <Grid item xs={12} container alignItems="center" className="p-2">
                                <Typography component={Grid} item xs variant="body2" className="p-1 font-weight-bold">
                                    {file.docname}
                                </Typography>
                                <UISref to="fileViewer" params={{fileId: file.id}}>
                                    <IconButton>
                                        <Edit size={16}/>
                                    </IconButton>
                                </UISref>
                                <IconButton onClick={() => deleteFile(file.id)}>
                                    <Trash className="text-danger" size={16}/>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>)
            }
        </Grid>
        <ShareDialog fileId={file?.id} open={show} onClose={() => setShow(false)}/>
    </Grid>
}

export const states: ReactStateDeclaration[] = [
    {
        url: "/files",
        name: "files",
        data: {
            title: "Files",
            loggedIn: true
        },
        component: Files
    }
];