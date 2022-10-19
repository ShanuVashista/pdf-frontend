import {ReactStateDeclaration} from "@uirouter/react";
import React, {useState} from "react";
import {Button, Grid, makeStyles, Paper, TextField} from "@material-ui/core";
import {$user} from "../factories/UserFactory";


const useStyles = makeStyles(theme => ({}));

export function LoginPage() {
    const classes = useStyles();
    const [params, setParams] = useState({
        email: "",
        password: ""
    });

    const setParam = (name: string, value: any) => {
        setParams(prev => {
            return {
                ...prev,
                [name]: value
            }
        });
    };

    const login = async () => {
        await $user.login(params);
    };

    return <Grid item xs container alignItems="center" justifyContent="center" className="p-2 p-2-all">
        <Grid item xs={12} md={6} lg={4}>
            <Grid container direction="column" wrap="nowrap" component={Paper} className="p-2 p-2-all">
                <Grid>
                    <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="Email"
                        value={params.email}
                        onChange={e => setParam("email", e.target.value)}
                    />
                </Grid>
                <Grid>
                    <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        label="Password"
                        value={params.password}
                        onChange={e => setParam("password", e.target.value)}
                    />
                </Grid>
                <Grid container alignItems="center">
                    <Grid item xs>
                        <Button color="primary" size="small" variant="outlined">
                            Create Account
                        </Button>
                    </Grid>
                    <Grid>
                        <Button color="primary" size="small" variant="contained" onClick={login}>
                            Login
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </Grid>;
}

export const states: ReactStateDeclaration[] = [
    {
        url: "/",
        name: "login",
        data: {
            title: "Login",
            loggedOut: true
        },
        component: LoginPage
    }
];