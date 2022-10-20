import React, {useEffect, useRef} from "react";
import {ReactStateDeclaration} from "@uirouter/react";
import {Grid} from "@material-ui/core";
import WebViewer from "@pdftron/webviewer";

export function SharedFiles() {
    const viewer = useRef(null);
    useEffect(() => {
        WebViewer({
            path: "pdf-tron",
            initialDoc: "http://localhost:3000/public/pdf/filename-1666284683487.pdf"
        }, viewer.current).then(instance => {

        })
    }, []);

    return <Grid className="p-2 p-2-all">
        <Grid ref={viewer}></Grid>
    </Grid>
}

export const states: ReactStateDeclaration[] = [
    {
        url: "/shared-files",
        name: "sharedFiles",
        data: {
            title: "Shared Files",
            loggedIn: true
        },
        component: SharedFiles
    }
];