import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ModalForm from "./../../../../UI/ModalForm/modalForm";
import Field from "./../../../../UI/InputFields/TextField/Field";
import { useTranslation } from "react-i18next";
import { Grid, Button, Typography } from "@material-ui/core";

import { useHistory } from "react-router-dom";
import { DeleteIcon } from "../../../../utility/AllImages/AllImages";

const useStyles = makeStyles((props) => ({
  container: {
    marginTop: "4rem",
  },
  deleteBtn: {
    marginTop: ".5rem",
    width: "1rem",
    height: "1rem",
  },
  root: {
    pointerEvents: "none",
    opacity: 0.8,
    overflowY: "scroll",
    display: "flex",
    height: "68vh",
    flexDirection: "column",
    direction: props.direction,
    "&::-webkit-scrollbar": {
      backgroundColor: "transparent",
      width: "0.375rem",
      height: "1.125rem",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
      borderRadius: "0.313rem",
    },

    "&:hover::-webkit-scrollbar": {
      overflowY: "visible",
      width: "0.375rem",
      height: "1.125rem",
    },
    "&:hover::-webkit-scrollbar-thumb": {
      background: "#8c8c8c 0% 0% no-repeat padding-box",
      borderRadius: "0.313rem",
    },
  },
}));
{
  /*Making inputs for fields */
}
const makeFieldInputs = (value) => {
  return {
    value: value,
    error: false,
    helperText: "",
  };
};

const PreviewHtmlModal = (props) => {
  console.log(props);
  let { t } = useTranslation();

  const { taskVariablesList } = props;
  const [open, setOpen] = useState(props.isOpen ? true : false);

  const handleClose = () => {
    setOpen(false);

    props.handleClose();
  };
  return (
    <ModalForm
      isOpen={open}
      title={`${t("HTML")} ${t("Form")} ${t("Preview")}`}
      Content={<Content taskVariablesList={taskVariablesList} />}
      headerCloseBtn={true}
      onClickHeaderCloseBtn={handleClose}
      closeModal={handleClose}
      btn1Title={"Close"}
      onClick1={handleClose}
      containerHeight={425}
      containerWidth={638}
    />
  );
};
export default PreviewHtmlModal;

{
  /*Fields, content of the modal */
}
const Content = ({ taskVariablesList }) => {
  const classes = useStyles();

  return (
    /*<div className={classes.root}>*/
    <Grid
      container
      direction="column"
      spacing={1}
      style={{ pointerEvents: "none", opacity: "0.8" }}
    >
      {taskVariablesList.map((taskVar) => (
        <Grid item>
          <Field
            type={
              taskVar.VariableType === 8
                ? "date"
                : taskVar.ControlType === "2"
                ? "textArea"
                : "text"
            }
            dropdown={taskVar.ControlType === "3"}
            multiline={taskVar.ControlType === "2"}
            name={taskVar.VariableName}
            label={taskVar.DisplayName}
            //disabled={true}
          />
        </Grid>
      ))}
    </Grid>
    /* </div>*/
  );
};
