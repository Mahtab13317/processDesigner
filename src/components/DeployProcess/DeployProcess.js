// To solve bug - Making comments mandatory while deploying process- 110015

import React, { useState, useEffect } from "react";
import classes from "./DeployProcess.module.css";
import { useTranslation } from "react-i18next";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import { store, useGlobalState } from "state-pool";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import { connect } from "react-redux";
import {
  SERVER_URL,
  REGISTRATION_NO,
  RTL_DIRECTION,
  SEQUENCE_NO,
  ENDPOINT_GETREGISTRATIONPROPERTY,
  ENDPOINT_REGISTERPROCESS,
  ENDPOINT_DEPLOYPROCESS,
} from "../../Constants/appConstants";
import axios from "axios";

function DeployProcess(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [
    localLoadedProcessData,
    setlocalLoadedProcessData,
    updatelocalLoadedProcessData,
  ] = useGlobalState(loadedProcessData);

  const [processName, setprocessName] = useState(
    localLoadedProcessData.ProcessName
  );
  const [displayName, setdisplayName] = useState(
    localLoadedProcessData.ProcessName
  );
  const [prefix, setprefix] = useState(t("prefix"));
  const [suffix, setsuffix] = useState(t("suffix"));
  const [regLength, setregLength] = useState(REGISTRATION_NO);
  const [startSeqNo, setstartSeqNo] = useState(SEQUENCE_NO);
  const [displayNameSuffix, setdisplayNameSuffix] = useState("001");
  const [type1PreviewValue, settype1PreviewValue] = React.useState("");
  const [siteValues, setSiteValues] = useState(null);
  const [volumeValues, setVolumeValues] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [thresholdCount, setThresholdCount] = useState(null);
  const [secureFolderFlag, setSecureFolderFlag] = useState(null);
  const [createWSFlag, setCreateWSFlag] = useState(null);
  const [comment, setComment] = useState(null);
  const [showCommentError, setShowCommentError] = useState(false);

  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          ENDPOINT_GETREGISTRATIONPROPERTY +
          `/${props.openProcessName}/${props.openProcessID}/${props.openProcessType}`
      )
      .then((res) => {
        setprefix(res?.data?.Registration?.RegPrefix);
        setsuffix(res?.data?.Registration?.RegSuffix);
        setregLength(res?.data?.Registration?.RegSeqLength);
        setdisplayName(res?.data?.Registration?.DisplayName);
        setSelectedSite(res?.data?.Registration?.SelectedSite);
        setstartSeqNo(res?.data?.Registration?.RegStartingNo);
        setSelectedVolume(res?.data?.Registration?.SelectedVolume);
        setThresholdCount(res?.data?.Registration?.ThreshHoldCount);
        setSiteValues(res?.data?.Site);
        setVolumeValues(res?.data?.Volume);
        setSecureFolderFlag(
          res?.data?.Registration?.ISSecureFolder == "N" ? false : true
        );
        setCreateWSFlag(
          res?.data?.Registration?.CreateWS == "N" ? false : true
        );
      });
  }, []);

  useEffect(() => {
    let zeroes = "";
    let temp =
      regLength - prefix.length - suffix.length - 2 < 10
        ? 10
        : regLength - prefix.length - suffix.length - 2;
    for (let i = 0; i < temp; i++) {
      zeroes = zeroes + "0";
    }
    let startSeqNoLen = startSeqNo?.toString().length;
    settype1PreviewValue(
      startSeqNoLen !== 0
        ? prefix +
            "-" +
            zeroes.slice(0, -startSeqNoLen) +
            startSeqNo +
            "-" +
            suffix
        : prefix + "-" + zeroes.slice(0, -1) + startSeqNo + "-" + suffix
    );
  }, [prefix, suffix, regLength, startSeqNo]);

  useEffect(() => {
    let displayZeroes = "000";
    let startSeqNoLen = startSeqNo ? startSeqNo.toString().length : 0;
    let num =
      startSeqNoLen !== 0
        ? displayZeroes.slice(0, -startSeqNoLen) + startSeqNo
        : displayZeroes;
    setdisplayNameSuffix(num);
  }, [startSeqNo]);

  useEffect(() => {
    let num = prefix.length + suffix.length + 12;
    setregLength(num);
  }, [prefix, suffix]);

  const handleOnLoseFocus = (e) => {
    if (
      e.target.name === "regLengthInput" &&
      regLength < prefix.length + suffix.length + 12
    ) {
      setregLength(prefix.length + suffix.length + 12);
    }
  };

  const deployProcessHandler = () => {
    const obj = {
      processDefId: props.openProcessID,
      processState: props.openProcessType,
      regPrefix: prefix,
      regSuffix: suffix,
      regStarNo: startSeqNo,
      regSeqLength: regLength,
      regThreshHold: thresholdCount,
      m_bCreateWS: createWSFlag,
      strDisplayName: displayName,
      m_bSecureFolder: secureFolderFlag,
      m_sSeletedSite: selectedSite ? selectedSite : "",
      m_sSelectedVolume: selectedVolume ? selectedVolume : "",
      strDefaultStartID: "1",
      deploy: true,
      pMProcessOperationInfo: {
        processDefId: props.openProcessID,
        action: "RE",
        processName: props.openProcessName,
        displayName: displayName,
        newProcessName: processName,
        comment: comment,
        processVariantType: props.openProcessType,
        bNewVersion: false,
      },
    };

    if (comment) {
      setShowCommentError(false);
      axios.post(SERVER_URL + ENDPOINT_REGISTERPROCESS, obj).then((res) => {
        if (res.data.Status === 0 && !res.data.hasOwnProperty("Error")) {
          props.setErrorVariables([]);
          if (props.setShowDeployModal) {
            props.setShowDeployModal(true);
            props.toggleDrawer();
          }
          props.setModalClosed();
        } else if (res.data.Status === 0 && res.data.hasOwnProperty("Error")) {
          props.setErrorVariables(res.data.Error);
          props.toggleDrawer();
          if (props.setShowDeployFailModal) {
            props.setShowDeployFailModal(true);
          }
          props.setModalClosed();
        }
      });
    } else {
      setShowCommentError(true);
    }
  };

  const saveProcessHandler = () => {
    const obj = {
      processDefId: props.openProcessID,
      processState: props.openProcessType,
      regPrefix: prefix,
      regSuffix: suffix,
      regStarNo: startSeqNo,
      regSeqLength: regLength,
      regThreshHold: thresholdCount,
      m_bCreateWS: createWSFlag,
      strDisplayName: displayName,
      m_bSecureFolder: secureFolderFlag,
      m_sSeletedSite: selectedSite,
      m_sSelectedVolume: selectedVolume,
      strDefaultStartID: "1",
      deploy: false,
    };

    axios.post(SERVER_URL + ENDPOINT_REGISTERPROCESS, obj).then((res) => {
      if (res.status === 200) {
        alert("PROCESS SAVED");
        // setShowDeployModal(true);
      }
    });
  };

  const startSeqHandler = (e) => {
    if (e.target.value.toString().length <= 10) {
      setstartSeqNo(e.target.value);
    }
  };

  const handleThresholdCount = (e) => {
    if (e.target.value > 100) {
      setThresholdCount(100);
    } else {
      setThresholdCount(e.target.value);
    }
  };

  return (
    <div
      className={classes.mainDiv}
      style={{ height: props.deployFrom == "Settings" ? "72vh" : "90vh" }}
    >
      {props.deployFrom == "Settings" ? null : (
        <div className={classes.header}>
          <p
            className={classes.deployProcessHeading}
            style={{
              marginLeft: direction == RTL_DIRECTION ? "0rem" : "1.1rem",
              marginRight: direction == RTL_DIRECTION ? "1.5rem" : "0rem",
            }}
          >
            {t("deployProcess")}
          </p>
        </div>
      )}
      {props.deployFrom == "Settings" ? null : <hr className={classes.hrTag} />}

      <div
        className={classes.contentDiv}
        style={{
          paddingTop: props.deployFrom == "Settings" ? "0px" : "0.6rem",
          backgroundColor: "white",
        }}
      >
        <div
          className={
            props.deployFrom == "Settings"
              ? classes.fieldsDivSettings
              : classes.fieldsDiv
          }
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              whiteSpace: "nowrap",
            }}
          >
            <p
              className={classes.fieldsName}
              style={{
                marginTop: "0.3125rem",
              }}
            >
              {t("processC")}
            </p>
            <span className={classes.starIcon}>★</span>
          </div>
          <input
            value={processName}
            onChange={(e) => setprocessName(e.target.value)}
            className={classes.processNameInput}
          />
        </div>
        <p
          className={classes.fieldsName}
          style={{
            opacity: "0.7",
          }}
        >
          {t("workItemIdDetails")}
        </p>
        <div
          className={
            props.deployFrom == "Settings"
              ? classes.fieldsDivSettings
              : classes.fieldsDiv
          }
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <p className={classes.fieldsName}>{t("startSeqNo")}</p>
            <span className={classes.starIcon}>★</span>
          </div>
          <input
            value={startSeqNo}
            type="number"
            onChange={(e) => startSeqHandler(e)}
            className={classes.processNameInput}
          />
        </div>

        <div
          className={
            props.deployFrom == "Settings"
              ? classes.fieldsDivSettings
              : classes.fieldsDiv
          }
          style={{
            background: "#0072C621",
            height: "3.3125rem",
            padding: "0.625rem",
          }}
        >
          <p
            style={{ fontSize: "0.8rem", textAlign: "left", color: "#606060" }}
          >
            {t("deployProcessDesc")}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: props.deployFrom == "Settings" ? "row" : "column",
          }}
        >
          <div
            className={
              props.deployFrom == "Settings"
                ? classes.fieldsDivSettings
                : classes.fieldsDiv
            }
            style={{
              width: props.deployFrom == "Settings" ? "80%" : "100%",
              flexDirection: "column",
              background: "#0000000D",
              marginRight: "15px",
            }}
          >
            <p className={classes.type1text}>{t("type1Preview")}</p>
            <input
              readOnly
              className={classes.processNameInput}
              value={type1PreviewValue}
              style={{
                width: "100%",
                fontSize: "0.85rem",
                fontWeight: "bolder",
                color: "#606060",
                border: "none",
                borderBottom: "1px solid rgba(86, 71, 71, 0.33)",
              }}
            />

            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                marginBlock: "0.3rem",
                justifyContent: "space-between",
                padding: "5px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className={classes.fieldsName}>
                  {t("prefix")} / {t("suffix")}
                </p>
                <span className={classes.starIcon}>★</span>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <input
                  name="prefix"
                  value={prefix}
                  onChange={(e) => setprefix(e.target.value)}
                  onBlur={(e) => handleOnLoseFocus(e)}
                  className={classes.processNameInput}
                  style={{
                    width: "8rem",
                    fontSize: "0.85rem",
                    color: "#606060",
                    marginRight: "0.625rem",
                  }}
                />
                <p style={{ marginTop: "0.1875rem" }}> / </p>
                <input
                  name="suffix"
                  value={suffix}
                  onBlur={(e) => handleOnLoseFocus(e)}
                  onChange={(e) => setsuffix(e.target.value)}
                  className={classes.processNameInput}
                  style={{
                    width: "8rem",
                    fontSize: "0.85rem",
                    color: "#606060",
                    marginLeft: "0.625rem",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                marginBlock: "0.3rem",
                justifyContent: "space-between",
                padding: "5px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className={classes.fieldsName}>{t("regLength")}</p>
                <span className={classes.starIcon}>★</span>
              </div>
              <input
                name="regLengthInput"
                value={regLength}
                onBlur={handleOnLoseFocus}
                onChange={(e) => setregLength(e.target.value)}
                className={classes.processNameInput}
                style={{
                  fontSize: "0.85rem",
                  color: "#606060",
                  marginLeft: "0.625rem",
                }}
              />
            </div>
          </div>

          <div
            className={
              props.deployFrom == "Settings"
                ? classes.fieldsDivSettings
                : classes.fieldsDiv
            }
            style={{
              width: props.deployFrom == "Settings" ? "80%" : "100%",
              flexDirection: "column",
              background: "#0000000D",
            }}
          >
            <p
              style={{
                fontSize: "0.85rem",
                textAlign: "left",
                color: "#606060",
                marginBottom: "0.5rem",
                padding: "5px",
              }}
            >
              {t("type2Preview")}
            </p>
            <input
              readOnly
              value={displayName + "-" + displayNameSuffix}
              className={classes.processNameInput}
              style={{
                width: "100%",
                fontSize: "0.85rem",
                fontWeight: "bolder",
                color: "#606060",
                border: "none",
                borderBottom: "1px solid rgba(86, 71, 71, 0.33)",
              }}
            />
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                marginBlock: "0.3rem",
                justifyContent: "space-between",
                padding: "5px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p
                  className={classes.fieldsName}

                  //remove
                >
                  {t("displayName")}
                </p>
                <span className={classes.starIcon}>★</span>
              </div>
              <input
                name="displayName"
                onBlur={(e) => handleOnLoseFocus(e)}
                value={displayName}
                onChange={(e) => setdisplayName(e.target.value)}
                className={classes.processNameInput}
                style={{
                  fontSize: "0.85rem",
                  color: "#606060",
                  marginLeft: "0.625rem",
                }}
              />
            </div>
          </div>
        </div>
        <div
          className={
            props.deployFrom == "Settings"
              ? classes.fieldsDivSettings
              : classes.fieldsDiv
          }
          style={{ flexDirection: "column" }}
        >
          <p className={classes.fieldsName} style={{ opacity: "0.8" }}>
            {t("processDocStorageDetails")}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: props.deployFrom == "Settings" ? "row" : "column",
              marginBottom: props.deployFrom == "Settings" ? "15px" : "0px",
              alignItems: props.deployFrom == "Settings" ? "center" : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection:
                  props.deployFrom == "Settings" ? "column" : "row",
                marginBlock: "0.3rem",
                justifyContent: "space-between",
              }}
            >
              <p className={classes.fieldsName}>{t("site")}</p>
              <Select
                variant="standard"
                defaultValue={1}
                className={classes.dropDown}
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
              >
                {siteValues?.map((site) => {
                  return (
                    <MenuItem
                      style={{ width: "16rem", padding: "0.5rem" }}
                      value={site.Id}
                    >
                      <p style={{ font: "0.8rem Open Sans" }}>
                        {site.SiteName}
                      </p>
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection:
                  props.deployFrom == "Settings" ? "column" : "row",
                marginBlock: "0.3rem",
                justifyContent: "space-between",
              }}
            >
              <p className={classes.fieldsName}>{t("volume")}</p>
              <Select
                variant="standard"
                //autoWidth
                defaultValue={1}
                className={classes.dropDown}
                value={selectedVolume}
                onChange={(e) => setSelectedVolume(e.target.value)}
              >
                {volumeValues?.map((volume) => {
                  if (volume.HomeSite == selectedSite) {
                    return (
                      <MenuItem
                        style={{ width: "16rem", padding: "0.5rem" }}
                        value={volume.VolumeIndex}
                      >
                        <p style={{ font: "0.8rem Open Sans" }}>
                          {volume.VolumeName}
                        </p>
                      </MenuItem>
                    );
                  }
                })}
              </Select>
            </div>
            <div
              style={{
                display: "flex",
                width: "49%",
                // flexDirection:
                //   props.deployFrom == "Settings" ? "column" : "row",
                marginBlock: "0.3rem",
                justifyContent:
                  props.deployFrom == "Settings" ? "none" : "space-between",
                alignItems:
                  props.deployFrom == "Settings" ? "flex-start" : "center",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <p className={classes.fieldsName}>{t("secureFolder")}</p>
                <Tooltip
                  disableFocusListener
                  title="Secure Folder"
                  placement="right"
                >
                  <InfoOutlinedIcon className={classes.infoIcon} />
                </Tooltip>
              </div>
              <Checkbox
                checked={secureFolderFlag ? true : false}
                onChange={(e) => setSecureFolderFlag(!secureFolderFlag)}
                style={{ marginTop: "-0.3125rem" }}
              />
            </div>
          </div>
          <div
            className={
              props.deployFrom == "Settings"
                ? classes.fieldsSettingsDiv
                : classes.fieldsDiv
            }
            style={{ flexDirection: "column" }}
          >
            <p className={classes.fieldsName} style={{ opacity: "0.8" }}>
              {t("otherDetails")}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection:
                  props.deployFrom == "Settings" ? "row" : "column",
                alignItems: props.deployFrom == "Settings" ? "center" : "none",
              }}
            >
              <div
                className={
                  props.deployFrom == "Settings"
                    ? classes.fieldsSettingsDiv
                    : classes.fieldsDiv
                }
                style={{ width: "49%" }}
              >
                {" "}
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p
                    className={classes.fieldsName}
                    // style={{ fontSize: "0.85rem", fontWeight: "bold" }}
                  >
                    {t("createWebservice")}
                  </p>
                  <Tooltip
                    disableFocusListener
                    title={t("createWebserviceDesc")}
                    placement="right"
                  >
                    <InfoOutlinedIcon className={classes.infoIcon} />
                  </Tooltip>
                </div>
                <Checkbox
                  checked={createWSFlag ? true : false}
                  onChange={() => setCreateWSFlag(!createWSFlag)}
                  style={{ marginTop: "-0.3125rem" }}
                />
              </div>
              <div
                className={
                  props.deployFrom == "Settings"
                    ? classes.fieldsSettingsDiv
                    : classes.fieldsDiv
                }
                style={{
                  marginTop: "0",
                  alignItems:
                    props.deployFrom == "Settings" ? "center" : "none",
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <p
                    className={classes.fieldsName}
                    style={{
                      //   fontSize: "0.85rem",
                      //   fontWeight: "bold",
                      marginTop: "0.1rem",
                    }}
                  >
                    {t("thresholdCount")}
                  </p>
                  <Tooltip
                    disableFocusListener
                    title={t("thresholdCountDesc")}
                    placement="right"
                  >
                    <InfoOutlinedIcon
                      className={classes.infoIcon}
                      style={{ marginTop: "0.1rem" }}
                    />
                  </Tooltip>
                </div>
                <input
                  className={classes.processNameInput}
                  value={thresholdCount}
                  onChange={(e) => handleThresholdCount(e)}
                />
              </div>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontSize: "12px", color: "#606060" }}>
                  Comments
                </span>
                <textarea
                  style={{
                    width: "360px",
                    height: "56px",
                    border: "1px solid #cecece",
                    borderRadius: "1px",
                    opacity: "1",
                  }}
                  onChange={(e) => setComment(e.target.value)}
                />
                {!comment && showCommentError ? (
                  <span style={{ color: "red", fontSize: "11px" }}>
                    Please enter comment!
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          props.deployFrom == "Settings"
            ? classes.footerDivSettings
            : classes.footerDiv
        }
      >
        {props.deployFrom == "Settings" ? (
          <button
            className={classes.buttons}
            style={{ backgroundColor: "var(--button_color)", cursor: "pointer" }}
            onClick={() => saveProcessHandler()}
          >
            Save
          </button>
        ) : (
          <button
            className={
              props.buttonFrom == "DeployHeader"
                ? classes.DeploynSaveButton
                : classes.buttons
            }
            style={{ backgroundColor: "var(--button_color)", cursor: "pointer" }}
            onClick={() => deployProcessHandler()}
          >
            {props.buttonFrom == "DeployHeader" ? "Save & Deploy" : t("Deploy")}
          </button>
        )}
        <button
          onClick={props.setModalClosed}
          className={classes.buttons}
          style={{
            color: "#606060",
            border: "1px solid #C4C4C4",
            cursor: "pointer",
          }}
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
    templateId: state.openTemplateReducer.templateId,
    templateName: state.openTemplateReducer.templateName,
    openTemplateFlag: state.openTemplateReducer.openFlag,
  };
};

export default connect(mapStateToProps)(DeployProcess);
