import React from "react";
import {Divider, Drawer, Grid, List, ListItem, makeStyles, Typography} from "@material-ui/core";
import classNames from "classnames";
import {$state} from "./router";
import {$user} from "./factories/UserFactory";

const useStyles = makeStyles(theme => ({
    drawerWidth: {
        width: 200,
        flexShrink: 0
    },
    logoContainer: {
        height: 120
    }
}));

export function SideNav({open}) {
    const classes = useStyles();

    const Links = [
        // {
        //     label: "Dashboard",
        //     sref: "dashboard"
        // },
        {
            label: "Files",
            sref: "files"
        },
        {
            label: "Shared Files",
            sref: "sharedFiles"
        },
        {
            label: "Shared With Me",
            sref: "sharedWithMeFiles"
        }
    ];

    const content = <Grid container direction="column" wrap="nowrap">
        <Grid className={classes.logoContainer}></Grid>
        <Divider/>
        <List className="p-0">
            {
                Links.map((link) => <>
                        <ListItem
                            button
                            key={link.label}
                            onClick={() => $state.go(link.sref)}
                            className="p-3"
                        >
                            <Typography variant="body2" className="font-weight-bold">
                                {link.label}
                            </Typography>
                        </ListItem>
                        <Divider/>
                    </>
                )
            }
            <ListItem
                button
                onClick={
                    async () => {
                        await $user.logout();
                        $state.go("login");
                    }
                }
                className="p-3"
            >
                <Typography variant="body2" className="font-weight-bold">
                    Logout
                </Typography>
            </ListItem>
        </List>
    </Grid>;

    return <>
        <Drawer
            open={open}
            variant="persistent"
            anchor="left"
            className={classNames(classes.drawerWidth)}
            classes={{paper: "w-100 position-static"}}
            ModalProps={{keepMounted: true}}
        >
            {content}
        </Drawer>
    </>;
}