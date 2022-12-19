import React from "react";
import {Grid, makeStyles} from "@material-ui/core";
import classNames from "classnames";

const useStyles = makeStyles(() => ({
    loadingWrapper: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        position: "fixed",
        background: "rgba(0,0,0,0.25)",
    },
    loadingSpinner: {
        width: 65,
        height: 65,
        borderStyle: "solid",
        borderWidth: 4,
        borderColor: "#50d3bb #fff #fff",
        borderRadius: "50%",
    },
}));

export function Loading() {
    const classes = useStyles();
    return (
        <Grid
            container
            alignItems="center"
            justifyContent="center"
            className={classNames(classes.loadingWrapper)}
        >
            <Grid className={classNames(classes.loadingSpinner, "loading")}/>
        </Grid>
    );
}
