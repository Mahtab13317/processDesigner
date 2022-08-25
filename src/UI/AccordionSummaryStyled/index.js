import { styled } from "@material-ui/core/styles";
import { AccordionSummary } from "@material-ui/core";
import KeyboardArrowUpOutlinedIcon from "@material-ui/icons/KeyboardArrowUpOutlined";
import styles from "./index.module.css";

export const AccordionSummaryStyled = styled((props) => (
  <AccordionSummary
    expandIcon={
      <KeyboardArrowUpOutlinedIcon
        className={styles.arrowIcon}
        // fontSize="small"
      />
    }
    {...props}
  />
))(({ theme }) => ({
  color: "#0072C6",
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  height: "3rem",
  minHeight: "0rem !important",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));
