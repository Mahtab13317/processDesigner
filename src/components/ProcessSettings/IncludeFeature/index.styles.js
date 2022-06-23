import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

export const LightTooltip = withStyles((theme) => ({
  arrow: { color: "lightgrey" },
  tooltip: {
    backgroundColor: "white",
    textAlign: "left",
    font: "normal normal normal 0.75rem/1.063rem Open Sans",
    letterSpacing: "0rem",
    color: "black",
    opacity: "1",
    border: "0.063rem solid lightgrey",
  },
}))(Tooltip);
