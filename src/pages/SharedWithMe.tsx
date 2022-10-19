import React, {useEffect, useState} from "react";
import {ReactStateDeclaration, UISref} from "@uirouter/react";
import {Divider, Grid, IconButton, Paper, Typography} from "@material-ui/core";
import {Edit, File} from "react-feather";
import {SharedWithMeFileType} from "../types";
import {$crud} from "../factories/CrudFactory";

export function SharedWithMeFiles() {
    const [files, setFiles] = useState<SharedWithMeFileType[]>([]);

    const retrieveFiles = async () => {
        const {data} = await $crud.post("files/send-files-list", {
            limit: "10",
            page: "1"
        });
        setFiles(data);
    };

    useEffect(() => {
        retrieveFiles();
    }, []);

    return <Grid className="p-2 p-2-all">
        <Grid container alignItems="center" className="p-2-all">
            <Typography component={Grid} item xs variant="h5" className="font-weight-bold">
                Share With Me PDF Files
            </Typography>
        </Grid>
        <Grid container alignItems="center" className="p-2-all">
            {
                files.map((file, index) => <Grid item xs={6} md={4} lg={3} key={index}>
                    <Paper elevation={1}>
                        <Grid container alignItems="center">
                            <Grid item xs={12} className="p-3 text-center position-relative">
                                <File size={180} className="text-success"/>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider/>
                            </Grid>
                            <Grid item xs={12} container alignItems="center" className="p-2">
                                <Typography component={Grid} item xs variant="body2" className="p-1 font-weight-bold">
                                    {file.fileId.docname}
                                </Typography>
                                <UISref to="fileViewer" params={{fileId: file.id}}>
                                    <IconButton>
                                        <Edit size={16}/>
                                    </IconButton>
                                </UISref>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>)
            }
        </Grid>
    </Grid>
}

export const states: ReactStateDeclaration[] = [
    {
        url: "/shared-with-me-files",
        name: "sharedWithMeFiles",
        data: {
            title: "Shared With Me Files",
            loggedIn: true
        },
        component: SharedWithMeFiles
    }
];