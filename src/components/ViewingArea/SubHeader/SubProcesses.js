import React from "react";
import { useTranslation } from "react-i18next";
import CallActivityLogo from "../../../assets/bpmnViewIcons/CallActivity.svg";
import SubprocessLogo from "../../../assets/bpmnViewIcons/EmbeddedSubprocess.svg";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import * as actionCreators from "../../../redux-store/actions/processView/actions.js";

import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import { store, useGlobalState } from "state-pool";

function SubProcesses(props) {
  let { t } = useTranslation();

  const history = useHistory();
  const { callActivity, embededSubProcess, subProcessCount } = props;
  const ToolDescription = withStyles((theme) => ({
    tooltip: {
      fontSize: "12px",
      letterSpacing: "0px",
      lineHeight: "1rem",
      color: "#FFFFFF",
      backgroundColor: "#414141",
      boxShadow: "0px 3px 6px #00000029",
      border: "none !important",
      padding: "0.5vw 1vw",
    },

    arrow: {
      "&:before": {
        backgroundColor: "#414141",
        border: "none !important",
        zIndex: "100",
      },
    },
  }))(Tooltip);

  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);

  const openSubProcess = (el) => {
    props.openProcessClick(
      el.AssociatedProcess.Associated_ProcessDefId,
      el.AssociatedProcess.Associated_ProjectName,
      "R",
      el.AssociatedProcess.Associated_VersionNo,
      el.AssociatedProcess.Associated_ProcessName
    );
    props.openTemplate(null, null, false);
    setlocalLoadedProcessData(null);
    history.push("/process");
  };
  return (
    <React.Fragment>
      <div className="modalDivOnClick">
        <p className="modalActivityTitle">
          {t("callActivity")}
          {subProcessCount > 1 ? (
            <span className="openAllModalActivity">{t("openall")}</span>
          ) : null}
        </p>
        {callActivity.length > 0 ? (
          <div className="row">
            {callActivity &&
              callActivity.map((el) => {
                return (
                  <React.Fragment>
                    <div className="row">
                      <div>
                        <img
                          src={CallActivityLogo}
                          width="15px"
                          height="15px"
                        />
                      </div>

                      {el.AssociatedProcess == undefined ||
                      el.AssociatedProcess.Associated_ProcessDefId == "" ? (
                        <p className="subProcessActivityNameDisable">
                          {el.ActivityName} ({t("ProcessNotAttached")})
                        </p>
                      ) : (
                        <ToolDescription
                          arrow
                          title={
                            t("AssociatedProcess") +
                            el.AssociatedProcess.Associated_ProcessName
                          }
                          placement="right"
                        >
                          <p
                            className="subProcessActivityName"
                            onClick={() => openSubProcess(el)}
                          >
                            {el.ActivityName}
                          </p>
                        </ToolDescription>
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
          </div>
        ) : (
          <p className="noProcessAdded">
            <i>{t("noProcessAdded")}</i>
          </p>
        )}

        <div className="subProcessDiv">
          <p className="modalActivityTitle">{t("embededSubProcess")}</p>

          {embededSubProcess.length > 0 ? (
            <div className="row">
              {embededSubProcess &&
                embededSubProcess.map((el) => {
                  return (
                    <React.Fragment>
                      <div>
                        <img src={SubprocessLogo} width="15px" height="15px" />
                      </div>
                      <p className="subProcessActivityName">
                        {el.ActivityName}
                      </p>
                    </React.Fragment>
                  );
                })}
            </div>
          ) : (
            <p className="noProcessAdded">
              <i>{t("noProcessAdded")}</i>
            </p>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    openProcessClick: (id, name, type, version, processName) =>
      dispatch(
        actionCreators.openProcessClick(id, name, type, version, processName)
      ),
    openTemplate: (id, name, flag) =>
      dispatch(actionCreators.openTemplate(id, name, flag)),
  };
};

export default connect(null, mapDispatchToProps)(SubProcesses);
