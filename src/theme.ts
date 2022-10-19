import {createTheme, responsiveFontSizes} from "@material-ui/core";

const primary = {
    50: '#e6e6ea',
    100: '#c1c1cb',
    200: '#9897a9',
    300: '#6f6d86',
    400: '#504e6c',
    500: '#312f52',
    600: '#2c2a4b',
    700: '#252341',
    800: '#1f1d38',
    900: '#131228',
    A100: '#7269ff',
    A200: '#4236ff',
    A400: '#1103ff',
    A700: '#0d00e9',
    main: '#212121',
    'contrastDefaultColor': 'light',
};

const secondary = {
    50: '#fdebe4',
    100: '#fbcebd',
    200: '#f8ad91',
    300: '#f58c64',
    400: '#f37343',
    500: '#f15a22',
    600: '#ef521e',
    700: '#ed4819',
    800: '#eb3f14',
    900: '#e72e0c',
    A100: '#ffffff',
    A200: '#ffe2de',
    A400: '#ffb5ab',
    A700: '#ff9f91',
    main: '#f15a22',
    'contrastDefaultColor': 'dark',
};

export const theme = responsiveFontSizes(createTheme({
    palette: {
        primary,
        secondary
    },
    overrides: {
        MuiRadio: {
            root: {
                padding: 2
            }
        }
    },
    typography: {
        fontSize: 13,
        fontFamily: "Muli"
    }
}));
