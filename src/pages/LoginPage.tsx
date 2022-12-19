import {ReactStateDeclaration, UISref} from "@uirouter/react";
import React, {useState} from "react";
import {Button, Grid, IconButton, TextField, Typography,} from "@material-ui/core";
import {$user} from "../factories/UserFactory";
import {$state} from "../router";
import {Eye, EyeOff} from "react-feather";

export function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [params, setParams] = useState({
        email: "",
        password: "",
    });

    const setParam = (name: string, value: any) => {
        setParams((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const login = async () => {
        setLoading(true);
        await $user.login(params);
        setLoading(false);
        $state.reload();
    };

    return (
        <Grid
            item
            xs
            container
            alignItems="center"
            justifyContent="center"
            className="p-2 p-2-all bg-white"
        >
            <Grid item xs={12} sm={6} lg={4}>
                <Grid
                    container
                    direction="column"
                    wrap="nowrap"
                    className="p-2 p-2-all"
                >
                    <Typography
                        component={Grid}
                        variant="h4"
                        className="mb-3 font-weight-bold"
                    >
                        PDF Sign Login
                    </Typography>
                    <Grid>
                        <TextField
                            fullWidth
                            size="small"
                            variant="outlined"
                            label="Email"
                            value={params.email}
                            onChange={(e) => setParam("email", e.target.value)}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            fullWidth
                            size="small"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            label="Password"
                            value={params.password}
                            onChange={(e) => setParam("password", e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {!showPassword ? <Eye size={18}/> : <EyeOff size={18}/>}
                                    </IconButton>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid container alignItems="center">
                        <Grid item xs>
                            <Typography style={{fontSize: 12}} className="text-uppercase">
                                You already have a account?
                                <UISref to="signupUser">
                                  <span className="d-inline-block ml-1 pointer text-primary">
                                    Sign Up
                                  </span>
                                </UISref>
                            </Typography>
                        </Grid>
                        <Grid>
                            <Button
                                color="primary"
                                size="small"
                                disabled={loading}
                                variant="contained"
                                onClick={login}
                            >
                                {!loading ? 'Login' : 'Logging...'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export const states: ReactStateDeclaration[] = [
    {
        url: "/",
        name: "login",
        data: {
            title: "Login",
            loggedOut: true,
        },
        component: LoginPage,
    },
];
