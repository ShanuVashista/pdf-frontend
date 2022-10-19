import {hashLocationPlugin, ReactStateDeclaration, servicesPlugin, UIRouterReact} from "@uirouter/react";

export const router = new UIRouterReact();


const states: ReactStateDeclaration[] = [
    {
        url: "/",
        name: "login.**",
        lazyLoad: () => import("./pages/LoginPage")
    },
    {
        url: "/dashboard",
        name: "dashboard.**",
        lazyLoad: () => import("./pages/Dashboard")
    },
    {
        url: "/files",
        name: "files.**",
        lazyLoad: () => import("./pages/Files")
    },
    {
        url: "/shared-with-me-files",
        name: "sharedWithMeFiles.**",
        lazyLoad: () => import("./pages/SharedWithMe")
    },
    {
        url: "/shared-files",
        name: "sharedFiles.**",
        lazyLoad: () => import("./pages/SharedFiles")
    },
    {
        url: "/file-viewer?:fileId",
        name: "fileViewer.**",
        lazyLoad: () => import("./pages/FileViewer")
    },
];

states.forEach(state => router.stateRegistry.register(state));

router.urlRouter.otherwise("/");
router.plugin(hashLocationPlugin);
router.plugin(servicesPlugin);

export const $state = router.stateService;
export const $transition = router.transitionService;
