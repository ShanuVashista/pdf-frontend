import React from "react";
import {Grid, Typography} from "@material-ui/core";

export function EmptyContainer(props: { content: string, button?: any }) {
    return <Grid direction="column" wrap="nowrap" container alignItems="center" justifyContent="center"
                 className="text-center p-5 border border-danger">
        <Typography className="p-3 text-uppercase text-danger font-weight-bold">
            {props.content}
        </Typography>
        {
            props.button && props.button
        }
    </Grid>
}