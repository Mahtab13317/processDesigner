import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ModalForm from "./../../../../UI/ModalForm/modalForm";
import Field from "./../../../../UI/InputFields/TextField/Field";
import { useTranslation } from "react-i18next";
import { Grid, Button, Typography } from "@material-ui/core";

import { useHistory } from "react-router-dom";
import { DeleteIcon } from "../../../../utility/AllImages/AllImages";
import axios from "axios";
import { SERVER_URL_LAUNCHPAD } from "./../../../../Constants/appConstants";
import { getSelectedCellType } from "../../../../utility/abstarctView/getSelectedCellType";
import { getLaunchpadKey } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

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

const FormBuilderModal = (props) => {
  const { localLoadedProcessData, cellID, cellType } = props;
  const [open, setOpen] = useState(props.isOpen ? true : false);

  const handleClose = () => {
    setOpen(false);

    props.handleClose();
  };
  return (
    <ModalForm
      isOpen={open}
      title={"Form Builder"}
      Content={
        <Content
          cellID={cellID}
          cellType={cellType}
          localLoadedProcessData={localLoadedProcessData}
        />
      }
      contentNotScrollable={true}
      headerCloseBtn={true}
      onClickHeaderCloseBtn={handleClose}
      closeModal={handleClose}
      containerHeight={"98%"}
      containerWidth={"98%"}
    />
  );
};
export default FormBuilderModal;

const Content = (props) => {
  const launchForm = () => {
    if (props.cellType === getSelectedCellType("TASK")) {
      let newPassedDataTF = {
        taskId: props.cellID,

        component: "app",
        processDefId: props.localLoadedProcessData.ProcessDefId,

        formName: "Taskform Test",

        componentType: "TF",
        token: getLaunchpadKey(),
      };

      window.loadFormBuilder("mf_forms_int_des", newPassedDataTF);
    } else if (props.cellType === getSelectedCellType("TASKTEMPLATE")) {
      let newPassedDataTF = {
        templateId: props.cellID,

        component: "app",
        //processDefId: props.localLoadedProcessData.ProcessDefId,

        formName: "Taskform Test",

        componentType: "GT",
        token: getLaunchpadKey(),
      };

      window.loadFormBuilder("mf_forms_int_des", newPassedDataTF);
    }
  };
  useEffect(() => {
    launchForm();
  }, []);
  return <div id="mf_forms_int_des"></div>;
};
