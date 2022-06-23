import React, { useState, useEffect } from "react";
import axios from "axios";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import WarningIcon from "@material-ui/icons/Warning";
import Button from "@material-ui/core/Button";
import MinimizeIcon from "@material-ui/icons/Minimize";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import deploy from "../../../../../assets/Header/deploy.svg";
import "./index.css";
import Modal from "../../../../../UI/Modal/Modal.js";
import {
  ENDPOINT_VALIDATEPROCESS,
  RTL_DIRECTION,
  SERVER_URL,
  MENUOPTION_DEPLOY,
} from "../../../../../Constants/appConstants";
import { connect } from "react-redux";
import { template } from "suneditor/src/plugins";
import { useTranslation } from "react-i18next";
import DeployProcess from "../../../../../components/DeployProcess/DeployProcess.js";
import ProcessDeployment from "../../ProcessValidation/ProcessDeployment/DeploySucessModal.js";
import ProcessDeploymentFailed from "../../ProcessValidation/ProcessDeployment/DeployFailedModal.js";

function ProcessValidation(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 10,
      borderRadius: 5,
      width: 405,
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: "#619548",
    },
  }))(LinearProgress);
  let {errorVariables, setErrorVariables, warningVariables, setWarningVariables} = props; 
  const [isDrawerMinimised, setIsDrawerMinimised] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [action, setAction] = useState(null);
  const buttonFrom = "ValidationFooterDeploy";

  useEffect(() => {
    const obj = {
      processDefId: props.openProcessID,
      action: "RE",
      processVariantType: "S",
    };

    axios.post(SERVER_URL + ENDPOINT_VALIDATEPROCESS, obj).then((res) => {
      // if (res.status === 200) {
      let tempErrors = [];
      let tempWarnings = [];
      res &&
        res.data &&
        res?.data?.Error?.map((e) => {
          if (e.ErrorLevel == "E") {
            tempErrors.push(e);
          } else if (e.ErrorLevel == "W") {
            tempWarnings.push(e);
          }
        });
      setWarningVariables(tempWarnings);
      setErrorVariables(tempErrors);
      // }
    });
  }, []);

  const showErrors = (v) => {
    return (
      <div
        style={{
          display: "flex",
          marginBottom: "10px",
        }}
      >
        <CloseIcon
          style={{
            height: "13px",
            width: "13px",
            cursor: "pointer",
            color: "red",
            marginTop: "3px",
          }}
        />
        <p style={{ fontSize: "12px", marginLeft: "10px" }}>
          {v.ValidationLevel}
        </p>
        <p style={{ fontSize: "12px", marginLeft: "25px" }}>{v.ErrorLabel}</p>
      </div>
    );
    // });
  };

  const showWarnings = (v) => {
    // warningVariables &&
    //   warningVariables.map((v) => {
    return (
      <div
        style={{
          display: "flex",
          width: "368px",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <WarningIcon
          style={{
            height: "14px",
            width: "15px",
            cursor: "pointer",
            color: "#F0A229",
          }}
        />
        <p style={{ fontSize: "12px" }}>Process</p>
        <p style={{ fontSize: "12px" }}>
          Please eliminate this Warning to deploy the Process.
        </p>
      </div>
    );
    // });
  };

  const validateProcessHandler = () => {
    // API Integration to Validate Process
    const obj = {
      processDefId: props.openProcessID,
      action: "RE",
      processVariantType: "S",
    };

    axios.post(SERVER_URL + ENDPOINT_VALIDATEPROCESS, obj).then((res) => {
      if (res.status === 200) {
        let tempErrors = [];
        let tempWarnings = [];
        res?.data?.Error?.map((e) => {
          if (e.ErrorLevel == "E") {
            tempErrors.push(e);
          } else if (e.ErrorLevel == "W") {
            tempWarnings.push(e);
          }
        });
        setWarningVariables(tempWarnings);
        setErrorVariables(tempErrors);
      }
    });
  };

  return (
    <div
      style={{
        height: isDrawerMinimised ? "40px" : "183px",
        direction: direction,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "5px 10px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "220px",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "14px", fontWeight: "700" }}>Output</p>
          <p
            style={{ fontSize: "12px", display: "flex", alignItems: "center" }}
          >
            Errors{" "}
            <CloseIcon
              style={{
                height: "12px",
                width: "12px",
                cursor: "pointer",
                color: "red",
              }}
            />
            ({errorVariables.length})
          </p>
          <p
            style={{ fontSize: "12px", display: "flex", alignItems: "center" }}
          >
            Warnings{" "}
            <WarningIcon
              style={{
                height: "12px",
                width: "12px",
                cursor: "pointer",
                color: "#F0A229",
              }}
            />
            ({warningVariables.length})
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: errorVariables.length == 0 && warningVariables.length == 0 ? null : "125px",
            justifyContent: "space-between",
          }}
        >
          {errorVariables.length == 0 && warningVariables.length == 0 ? null : (
            <Button
              style={{
                width: "63px",
                height: "28px",
                background: "#FFFFFF 0% 0% no-repeat padding-box",
                border: "1px solid #338ED1",
                borderRadius: "2px",
                color: "#338ED1",
                padding: "2px",
                textTransform: "none",
              }}
              variant="outlined"
              onClick={() => validateProcessHandler()}
            >
              Validate
            </Button>
          )}
          {errorVariables.length == 0 && warningVariables.length == 0 ? null : isDrawerMinimised ? (
            <CheckBoxOutlineBlankIcon
              style={{
                cursor: "pointer",
                height: "11px",
                width: "11px",
                border: "#707070",
              }}
              onClick={() => setIsDrawerMinimised(!isDrawerMinimised)}
            />
          ) : (
            <MinimizeIcon
              style={{ cursor: "pointer" }}
              onClick={() => setIsDrawerMinimised(!isDrawerMinimised)}
            />
          )}

          {errorVariables.length == 0 && warningVariables.length == 0 ? (
            <button
              className="deployButton"
              // onClick={() => setShowDeployModal(true)}
              onClick={() => setAction(MENUOPTION_DEPLOY)}
              id="header_deploy_btn"
            >
              <span className="deployIcon">
                <img src={deploy} width="14px" height="13px" alt="" />
              </span>
              <span className="deployText">Deploy</span>
            </button>
          ) : null}

          {showDeployModal ? (
            <Modal
              show={showDeployModal}
              style={{
                width: "395px",
                height: "235px",
                left: "40%",
                top: "25%",
                padding: "0",
              }}
              modalClosed={() => setShowDeployModal(false)}
              children={
                <ProcessDeployment setShowDeployModal={setShowDeployModal} />
              }
            ></Modal>
          ) : null}
          <CloseIcon
            style={{ height: "14px", width: "14px", cursor: "pointer" }}
            onClick={props.toggleDrawer()}
          />
        </div>
      </div>
      <hr />
      {errorVariables.length == 0 && warningVariables.length == 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            padding: "10px 10px 5px 10px",
            height: "85px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "405px",
            }}
          >
            <p style={{ fontSize: "12px", color: "#606060" }}>
              Process Compliance Store
            </p>
            <p style={{ fontSize: "12px", color: "#000000" }}>100%</p>
          </div>
          <BorderLinearProgress variant="determinate" value={100} />
          <p style={{ fontSize: "12px", color: "#000000", fontWeight: "700" }}>
            Process is Valid
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            height: "100%",
            overflow: "scroll",
          }}
        >
          <div>
            {warningVariables &&
              warningVariables.map((v) => {
                return showWarnings(v);
              })}
            {errorVariables &&
              errorVariables.map((v) => {
                return showErrors(v);
              })}
          </div>
          <p
            style={{
              color: "#0072C6",
              fontSize: "12px",
              position: "absolute",
              right: "25%",
              cursor: "pointer",
            }}
            onClick={() => setAction(MENUOPTION_DEPLOY)}
          >
            Fill Deploy Process
          </p>
        </div>
      )}

      {action === MENUOPTION_DEPLOY ? (
        <Modal
          show={action === MENUOPTION_DEPLOY}
          style={{
            padding: "0",
            width: "40vw",
            height: "90vh",
            top: "5%",
          }}
          modalClosed={() => setAction(null)}
          children={
            <DeployProcess
              setModalClosed={() => setAction(null)}
              buttonFrom={buttonFrom}
              setErrorVariables={setErrorVariables}
              setWarningVariables={setWarningVariables}
            />
          }
        />
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps)(ProcessValidation);
