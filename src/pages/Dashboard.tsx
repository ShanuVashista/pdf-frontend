import React from "react";
import {ReactStateDeclaration} from "@uirouter/react";
import {Grid} from "@material-ui/core";

export function Dashboard() {
    return <Grid>
        Dashboard
    </Grid>
}

export const states: ReactStateDeclaration[] = [
    {
        url: "/dashboard",
        name: "dashboard",
        data: {
            title: "Dashboard",
            loggedIn: true
        },
        component: Dashboard
    }
];