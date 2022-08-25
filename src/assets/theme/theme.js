import { createMuiTheme } from "@material-ui/core/styles";
const orange = "#FF6600";
const orange2 = "#FD6620";
const dark = "#222222";
const blue = "#0072C6";
const lightblue = "#E5F1F9";
const blue2 = "#57A5DE";
const dodgerBlue = "#19B5FE";
//const lightSkyBlue = "#0072C614";
const lightSkyBlue = "#E5F1F9";

/**
 * const primary1={
 * main:'#0072C6',
 * onHover:'#005EA3',
 * onSelection:"#E5F1F9"
 * }
 * const primary2={
 * main:'#FF6600',
 * onHover:'#F26100',
 * onSelection:"#FFEFE5"
 * }.
 * const alertColor:{
 * error:'#D53D3D',
 * warning:'#AD6503',
 * success:'#0D6F08'
 *
 * }
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

export default createMuiTheme({
  overrides: {
    MuiOutlinedInput: {
      input: {
        padding: "6.5px 6px",
        height: "28px",
      },
      multiline: {
        padding: "6.5px 6px",
        border: `0px solid #CECECE`,
      },
      root: {
        borderRadius: 1,
        border: `0px solid #CECECE`,
      },
      adornedStart: {
        paddingLeft: "9px",
      },

      "& focus": {
        border: `0px solid #CECECE`,
      },
      /*   marginDense: {
        padding: "6.5px 6px",
      },*/
    },
    MuiSelect: {
      select: {
        "&:focus": {
          backgroundColor: "transparent",
        },
        color: "#000000",
      },
      selectMenu: {
        paddingLeft: "10px",
        alignItems: "center",
      },
    },
    MuiButton: {
      root: {
        "&$disabled": {
          pointerEvents: "none",
          cursor: "default",
          backgroundColor: "transparent",
          opacity: 0.9,
          //color: "#000000",
        },
        minWidth: 35,
        minHeight: 28,
        padding: "5px 8px 6px 8px",
        borderRadius: 2,
        //fontSize: 12,
      },
      sizeSmall: {
        fontSize: 12,
        fontWeight: "bold",
      },
      label: {
        fontSize: 12,
        fontWeight: 600,
      },
    },
  },
  palette: {
    common: {
      dark: `${dark}`,
      orange: `${orange2}`,
      blue: `${blue}`,
    },

    primary: {
      main: `${blue}`,
      light: `${lightSkyBlue}`,
      secondary: `${lightblue}`,
    },
    secondary: {
      main: `${orange2}`,
    },
  },
  typography: {
    button: {
      textTransform: "none",
      fontSize: 12,
    },
    lineHeight: 17,
    fontSize: "var(--base_text_font_size)",
    fontWeightRegular: 500,
    htmlFontSize: 15,
    fontFamily: ["Open Sans", "sans-serif"].join(","),
  },
  shadows: ["none"],
});
