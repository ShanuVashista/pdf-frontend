import React from "react";
import {Grid, IconButton, MenuItem, TextField, withStyles} from "@material-ui/core";
import {ChevronLeft, ChevronRight} from "react-feather";

interface PaginationProps {
    limit: number,
    total: number,
    page: number,
    onLimitChange?: (limit: number) => void,
    onPageChange: (page: number) => void
    classes?: {
        input?: string
    }
}


// @ts-ignore
@withStyles({
    input: {
        width: 25
    }
})
export class Pagination extends React.Component<PaginationProps> {

    changePage(page: string | number) {
        const totalPages = Math.ceil(this.props.total / this.props.limit);
        page = Number(String(page).replace(/\D/, ""));
        if (page > totalPages)
            page = totalPages;
        if (page < 1)
            page = 1;
        if (page !== this.props.page)
            this.props.onPageChange(page);
    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const {props} = this;
        const {classes, total} = props;
        return <Grid container alignItems="center" justify="flex-end" className="p-2-all w-auto">
            <span>Total : {total} | </span>
            <TextField size="small" select value={props.limit}
                       onChange={e => props.onLimitChange(Number(e.target.value))}>
                {
                    [10, 25, 50, 100].map(limit => <MenuItem key={limit} value={limit}>{limit}</MenuItem>)
                }
            </TextField>
            <span>Per Page | Page:</span>
            <IconButton onClick={() => this.changePage(props.page - 1)}>
                <ChevronLeft size={15}/>
            </IconButton>
            <IconButton onClick={() => this.changePage(props.page + 1)}>
                <ChevronRight size={15}/>
            </IconButton>
        </Grid>;
    }
}
