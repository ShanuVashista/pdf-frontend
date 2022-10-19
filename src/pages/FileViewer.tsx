import React, {useEffect, useRef} from "react";
import {Grid} from "@material-ui/core";
import {ReactStateDeclaration} from "@uirouter/react";
import {$state} from "../router";
import WebViewer from "@pdftron/webviewer";
import {$crud} from "../factories/CrudFactory";

export function FileViewer() {
    const ref = useRef<HTMLDivElement>(null);
    const {fileId} = $state.params;

    const retrieveFile = async () => {
        const {data} = await $crud.get(`file/get-file/${fileId}`);
        WebViewer({
            path: "pdf",
            initialDoc: data[0].file_url
        }, ref.current as HTMLDivElement).then(instance => {
            console.log(instance);
            const {annotationManager} = instance.Core;
            instance.UI.setHeaderItems(function (header) {
                header.update([]);
                const toolsOverlay = header.getHeader('toolbarGroup-Annotate').get('toolsOverlay');
                header.getHeader('toolbarGroup-Annotate').delete('toolsOverlay');
                header.getHeader('default').push({
                    type: 'toolGroupButton',
                    toolGroup: 'signatureTools',
                    dataElement: 'signatureToolGroupButton',
                    title: 'annotation.signature',
                });
                header.push(toolsOverlay);
                header.push({
                    type: 'actionButton',
                    img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
                    onClick: (data) => {
                        console.log(data, "demo save")
                    }
                });
            });
            instance.UI.disableElements(['ribbons']);
            instance.UI.disableElements(['toolsHeader']);

            annotationManager.addEventListener('annotationChanged', async (annotations, action, {imported}) => {
                if (imported) return;
                const selected = annotationManager.getSelectedAnnotations();
                const xfdf = await annotationManager.exportAnnotations({widgets: false, links: false});
                console.log(xfdf);
            });
        });
    };

    useEffect(() => {
        retrieveFile();
    }, []);

    return <Grid item xs container direction="column" wrap="nowrap">
        <Grid item xs ref={ref}/>
    </Grid>;
};


export const states: ReactStateDeclaration[] = [
    {
        url: "/file-viewer?:fileId",
        name: "fileViewer",
        data: {
            title: "File Viewer",
            loggedIn: true
        },
        component: FileViewer
    }
];