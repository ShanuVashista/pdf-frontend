import * as React from "react";
import {useState} from "react";
import {
    AppBar,
    Grid,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    ThemeProvider,
    Toolbar,
    Typography
} from "@material-ui/core";
import classNames from "classnames";
import {theme} from "./theme";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/moment";
import {UIRouter, UISref, UIView} from "@uirouter/react";
import {$state, $transition, router} from "./router";
import {$crud} from "./factories/CrudFactory";
import {$user, useCurrentUser} from "./factories/UserFactory";
import {AlertDialog, ConfirmDialog, NotifySnackbar, ProgressIndicator} from "react-material-crud";
import {CrudProvider} from "@crud/react";
import {Menu as MenuIcon} from "react-feather";
import {SideNav} from "./SideNav";

const useStyles = makeStyles(({
    root: {
        color: "#fff",
        backgroundColor: theme.palette.primary.main
    },
    appContainer: {
        backgroundColor: "#eee",
        overflowY: "auto",
    },
    [theme.breakpoints.up("md")]: {
        maxWidth: "80%"
    },
    '@global': {
        body: {
            fontFamily: theme.typography.fontFamily
        }
    }
}));

$transition.onStart({}, async (trans) => {
    const to = trans.to();
    const loggedIn = to.data?.loggedIn;
    const loggedOut = to.data?.loggedOut;
    if (loggedIn || loggedOut) {
        const user = await $user.current();
        if (user && loggedOut) {
            return $state.target("files", {}, {
                location: "replace"
            });
        } else if (!user && loggedIn) {
            return $state.target("login", {}, {
                location: "replace"
            })
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

    const [open, setOpen] = useState(true);

    return <MuiPickersUtilsProvider utils={DateFnsUtils}>
        {
            // @ts-ignore
            <CrudProvider crud={$crud}>
                <UIRouter router={router}>
                    <ThemeProvider theme={theme}>
                        <Grid container wrap="nowrap">
                            {
                                user && open &&
                                <SideNav open={open}/>
                            }
                            <Grid item xs container direction="column">
                                {
                                    user &&
                                    <AppBar elevation={1} className={classNames(classes.root)} position="static">
                                        <Toolbar className="pl-0">
                                            <Grid item className="pl-3">
                                                <Typography variant="h6">PDF Signed App</Typography>
                                            </Grid>
                                            <Grid item xs>
                                                {/*<IconButton*/}
                                                {/*    onClick={() => setOpen(!open)}*/}
                                                {/*    color="inherit">*/}
                                                {/*    <MenuIcon/>*/}
                                                {/*</IconButton>*/}
                                            </Grid>
                                            <Grid item md={2} xs={2} sm={2} justifyContent="flex-end" container>
                                                <IconButton
                                                    onClick={event => setAnchorEl(event.currentTarget)}
                                                    color="inherit">
                                                    <MenuIcon/>
                                                </IconButton>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    // keepMounted
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleClose}
                                                >
                                                    <UISref to="profile">
                                                        <MenuItem onClick={handleClose}>Account Information</MenuItem>
                                                    </UISref>
                                                    <UISref to="changePassword">
                                                        <MenuItem onClick={handleClose}>Change Password</MenuItem>
                                                    </UISref>
                                                    <UISref to="help">
                                                        <MenuItem onClick={handleClose}>Help</MenuItem>
                                                    </UISref>
                                                    <UISref to="login">
                                                        <MenuItem
                                                            onClick={
                                                                async () => {
                                                                    await $user.logout();
                                                                    $state.go("login");
                                                                }
                                                            }
                                                        >
                                                            Logout
                                                        </MenuItem>
                                                    </UISref>
                                                </Menu>
                                            </Grid>
                                        </Toolbar>
                                    </AppBar>

                                }
                                <Grid item xs container direction="column"
                                      className={classNames(classes.appContainer)}>
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
    </MuiPickersUtilsProvider>;
}
