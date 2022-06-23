import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

export const LightTooltip = withStyles((theme) => ({
  tooltip: {
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    boxShadow: "0px 3px 6px #00000029",
    border: "1px solid #70707075",
    font: "normal normal normal 12px/17px Open Sans",
    letterSpacing: "0px",
    color: "#000000",
    zIndex: "100",
    transform: "translate3d(0px, -0.125rem, 0px) !important",
  },
  arrow: {
    "&:before": {
      backgroundColor: "#FFFFFF !important",
      border: "1px solid #70707075 !important",
      zIndex: "100",
    },
  },
}))(Tooltip);
