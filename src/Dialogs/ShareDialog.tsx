import React, {useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogProps,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    TextField,
    Typography
} from "@material-ui/core";
import {X} from "react-feather";
import {UserType} from "../types";
import {$crud} from "../factories/CrudFactory";
import {useCurrentUser} from "../factories/UserFactory";

interface ShareDialogInterface extends Partial<DialogProps> {
    fileId: any
}

export function ShareDialog(props: ShareDialogInterface) {
    const {open, fileId, ...dialogProps} = props;
    const [users, setUsers] = useState<UserType[]>([]);
    const [user, setUser] = useState<any>("");

    const currentUser = useCurrentUser();

    const close = () => {
        dialogProps.onClose(null, null);
    };

    const retrieveUser = async () => {
        const {data} = await $crud.post("user/list-users", {limit: 100, page: 1});
        setUsers(data);
    };

    const shareFile = async () => {
        await $crud.post("files/share-file", {
            userId: user,
            fileId
        });
        close();
    };

    useEffect(() => {
        retrieveUser();
    }, []);

    return <Dialog
        open={open}
        maxWidth="xs"
        fullWidth
        {...dialogProps}
    >
        <Grid container alignItems="center">
            <Grid item xs>
                <Typography variant={"h6"} className="p-3 font-weight-bold">
                    Share PDF for signature
                </Typography>
            </Grid>
            <IconButton onClick={close}>
                <X/>
            </IconButton>
        </Grid>
        <Divider/>
        <Grid className="p-3">
            <TextField
                select
                fullWidth
                size="small"
                value={user}
                color="primary"
                variant="outlined"
                label="Select User"
                onChange={(e) => setUser(e.target.value)}
            >
                <MenuItem value={""}><small>None</small></MenuItem>
                {
                    users.filter(u => u?.id !== currentUser?.id).map(row => <MenuItem value={row?.id} key={row?.id}>
                        {row?.fullname}
                    </MenuItem>)
                }
            </TextField>
        </Grid>
        <Divider/>
        <Grid container alignItems="center" justifyContent="flex-end" className="p-2-all">
            <Grid className="pr-3">
                <Button size="small" variant="contained" color="primary" onClick={shareFile}>
                    Share
                </Button>
            </Grid>
        </Grid>
    </Dialog>
}