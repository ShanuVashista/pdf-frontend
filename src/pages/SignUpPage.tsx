import { ReactStateDeclaration, UISref } from "@uirouter/react";
import React, { useState } from "react";
import {
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { Eye, EyeOff } from "react-feather";
import { $crud } from "../factories/CrudFactory";
import { $state } from "../router";
import { Loading } from "./Loading";
import PasswordChecklist from "react-password-checklist";

export function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const setParam = (name: string, value: any) => {
    setParams((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleChange = (e) => {
    setParam("email", e.target.value);
    if (!isValidEmail(e.target.value)) {
      setError("Email is invalid");
    } else {
      setError(null);
    }
  };

  const setDisabledFunc = (val) => {
    if (val == true) {
      if (
        params.firstname != null &&
        params.phone != null &&
        params.email != null
      ) {
        setDisabled(false);
      }
    } else {
      setDisabled(true);
    }
  };

  const register = async () => {
    try {
      setLoading(true);
      await $crud.post("user/register", params);
    } finally {
      await setLoading(false);
      $state.go("login");
    }
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
      {loading && <Loading />}
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
            PDF Sign Register
          </Typography>
          <Grid container className="p-2-all">
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label="First Name"
                value={params.firstname}
                onChange={(e) => setParam("firstname", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                label="Last Name"
                value={params.lastname}
                onChange={(e) => setParam("lastname", e.target.value)}
              />
            </Grid>
          </Grid>
          <Grid>
            <TextField
              fullWidth
              type="email"
              size="small"
              variant="outlined"
              label="Email"
              value={params.email}
              onChange={(e) => handleChange(e)}
            />
            {error && (
              <Typography variant="subtitle2" style={{ color: "red" }}>
                {error}
              </Typography>
            )}
          </Grid>
          <Grid>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              label="Phone"
              value={params.phone}
              onChange={(e) => setParam("phone", e.target.value)}
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
                    {!showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid>
            <TextField
              fullWidth
              size="small"
              type={showConfirmPassword ? "text" : "password"}
              variant="outlined"
              label="Confirm Password"
              value={params.confirmPassword}
              onChange={(e) => setParam("confirmPassword", e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {!showConfirmPassword ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid>
            <PasswordChecklist
              rules={["minLength", "specialChar", "number", "capital", "match"]}
              minLength={8}
              value={params.password}
              valueAgain={params.confirmPassword}
              onChange={(isValid) => setDisabledFunc(isValid)}
            />
          </Grid>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography style={{ fontSize: 12 }} className="text-uppercase">
                You already have a account?
                <UISref to="login">
                  <span className="d-inline-block ml-1 pointer text-primary">
                    Login
                  </span>
                </UISref>
              </Typography>
            </Grid>
            <Grid>
              <Button
                disabled={disabled}
                color="primary"
                size="small"
                variant="contained"
                onClick={register}
              >
                Register
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
    url: "/sign-up",
    name: "signupUser",
    data: {
      title: "Register User",
      loggedOut: true,
    },
    component: SignUpPage,
  },
];

