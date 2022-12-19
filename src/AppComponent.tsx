import * as React from "react";
import {
    AppBar,
    Button,
    Grid,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    ThemeProvider,
    Toolbar,
    Typography,
} from "@material-ui/core";
import classNames from "classnames";
import {theme} from "./theme";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/moment";
import {UIRouter, UISref, UIView} from "@uirouter/react";
import {$state, $transition, router} from "./router";
import {$crud} from "./factories/CrudFactory";
import {$user, useCurrentUser} from "./factories/UserFactory";
import {AlertDialog, ConfirmDialog, NotifySnackbar, ProgressIndicator,} from "react-material-crud";
import {CrudProvider} from "@crud/react";
import {Menu as MenuIcon} from "react-feather";

const useStyles = makeStyles({
    root: {
        color: "#fff",
    },
    appContainer: {
        backgroundColor: "#eee",
        overflowY: "auto",
    },
    [theme.breakpoints.up("md")]: {
        maxWidth: "80%",
    },
    "@global": {
        body: {
            fontFamily: theme.typography.fontFamily,
        },
    },
});

$transition.onStart({}, async (trans) => {
    const to = trans.to();
    const loggedIn = to.data?.loggedIn;
    const loggedOut = to.data?.loggedOut;
    if (loggedIn || loggedOut) {
        const user = await $user.current();
        if (user && loggedOut) {
            return $state.target(
                "files",
                {},
                {
                    location: "replace",
                }
            );
        } else if (!user && loggedIn) {
            return $state.target(
                "login",
                {},
                {
                    location: "replace",
                }
            );
        }
    }
});

$transition.onBefore({}, () => {
    $crud.toggleLoading(true);
});

$transition.onSuccess({}, () => {
    $crud.toggleLoading(false);
});

$transition.onError({}, () => {
    $crud.toggleLoading(false);
});

export function AppComponent() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const classes = useStyles({});

    const user = useCurrentUser();

    const handleClose = () => {
        setAnchorEl(null);
    };

    const Links = [
        // {
        //     label: "Dashboard",
        //     sref: "dashboard"
        // },
        {
            label: "Files",
            sref: "files",
        },
        // {
        //     label: "Shared Files",
        //     sref: "sharedFiles"
        // },
        {
            label: "Shared With Me",
            sref: "sharedWithMeFiles",
        },
        // {
        //   label: "Signed Files",
        //   sref: "SignedDocument",
        // },
        {
            label: "Reviewed Files",
            sref: "reviewFiles",
        },
    ];

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            {
                // @ts-ignore
                <CrudProvider crud={$crud}>
                    <UIRouter router={router}>
                        <ThemeProvider theme={theme}>
                            <Grid container wrap="nowrap">
                                <Grid item xs container direction="column">
                                    {user && (
                                        <AppBar
                                            elevation={1}
                                            className={classNames(classes.root)}
                                            position="static"
                                        >
                                            <Toolbar className="pl-0">
                                                <Grid item xs className="pl-3">
                                                    <Typography variant="h6">PDF Signed App</Typography>
                                                </Grid>
                                                <Grid>
                                                    <Grid container className="desktop-menu p-1 p-1-all">
                                                        {Links.map((link, index) => (
                                                            <Grid key={index}>
                                                                <UISref to={link.sref}>
                                                                    <Button
                                                                        size="small"
                                                                        color="inherit"
                                                                        className="link-button"
                                                                    >
                                                                        {link.label}
                                                                    </Button>
                                                                </UISref>
                                                            </Grid>
                                                        ))}
                                                        <Grid>
                                                            <Button
                                                                size="small"
                                                                color="inherit"
                                                                className="link-button"
                                                                onClick={async () => {
                                                                    await $user.logout();
                                                                    $state.go("login");
                                                                }}
                                                            >
                                                                Logout
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid className="mobile-menu">
                                                        <IconButton
                                                            onClick={(event) =>
                                                                setAnchorEl(event.currentTarget)
                                                            }
                                                            color="inherit"
                                                        >
                                                            <MenuIcon/>
                                                        </IconButton>
                                                        <Menu
                                                            anchorEl={anchorEl}
                                                            open={Boolean(anchorEl)}
                                                            onClose={handleClose}
                                                        >
                                                            {Links.map((link, index) => (
                                                                <UISref to={link.sref}>
                                                                    <MenuItem onClick={handleClose}>
                                                                        {link.label}
                                                                    </MenuItem>
                                                                </UISref>
                                                            ))}
                                                            <MenuItem
                                                                onClick={async () => {
                                                                    await $user.logout();
                                                                    $state.go("login");
                                                                }}
                                                            >
                                                                Logout
                                                            </MenuItem>
                                                        </Menu>
                                                    </Grid>
                                                </Grid>
                                            </Toolbar>
                                        </AppBar>
                                    )}
                                    <Grid
                                        item
                                        xs
                                        container
                                        direction="column"
                                        className={classNames(classes.appContainer)}
                                    >
                                        <UIView/>
                                    </Grid>
                                </Grid>
                                <ProgressIndicator/>
                                <NotifySnackbar autoHideDuration={5000}/>
                                <AlertDialog/>
                                <ConfirmDialog/>
                            </Grid>
                        </ThemeProvider>
                    </UIRouter>
                </CrudProvider>
            }
        </MuiPickersUtilsProvider>
    );
}
