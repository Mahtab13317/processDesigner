import React, { useState, useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import SunEditor from "../../../../UI/SunEditor/SunTextEditor";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuItem from "@material-ui/core/MenuItem";
import { store, useGlobalState } from "state-pool";
import axios from "axios";
import {
  BASE_URL,
  propertiesLabel,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { useDispatch } from "react-redux";

function FormsAndValidations(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const localActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(localActivityPropertyData);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);

  const [customValidations, setcustomValidations] = React.useState(false);

  const [selectedFormName, setselectedFormName] = React.useState("");
  const [formList, setformList] = React.useState([]);

  useEffect(() => {
    getAllFormList();
  }, []);

  const getAllFormList = async () => {
    const res = await axios.get(
      BASE_URL +
        `/process/${
          localLoadedProcessData.ProcessType === "R" ? "registered" : "local"
        }/getFormlist/${localLoadedProcessData?.ProcessDefId}`
    );
    setformList([
      { formId: -1, formName: "HTML", deviceType: "H" },
      ...res.data,
    ]);
  };
  const enableSaveBtn = () => {
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.basicDetails]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };
  const handleCheckSwitch = (e) => {
    let temp = global.structuredClone(localLoadedActivityPropertyData);
    temp.ActivityProperty.actGenPropInfo.m_bFormView = e.target.checked;
    setlocalLoadedActivityPropertyData(temp);
    enableSaveBtn();
  };

  const handleFormChange = (e) => {
    let temp = global.structuredClone(localLoadedActivityPropertyData);
    temp.ActivityProperty.actGenPropInfo.selFormId = e.target.value + "";
    setlocalLoadedActivityPropertyData(temp);
    enableSaveBtn();
  };

  return (
    <>
      <p
        style={{
          color: "#727272",
          fontWeight: "bolder",
        }}
      >
        {t("formsAndValidations")}
      </p>
      <div
        style={{
          flexDirection: "row",
          marginLeft: "-0.6875rem",
          marginBottom: "0.3rem",
        }}
        className="flexScreen"
      >
        <Checkbox
          name="formEnabled"
          checked={
            localLoadedActivityPropertyData?.ActivityProperty?.actGenPropInfo
              ?.m_bFormView
          }
          onChange={handleCheckSwitch}
          disabled={props.disabled}
          size="small"
        />
        <p
          style={{
            paddingTop: "0.8rem",

            fontWeight: "600",
          }}
        >
          {t("formEnabled")}
        </p>
      </div>

      <div style={{ marginBlock: "0.3rem" }}>
        <p
          style={{
            color: "black",

            fontWeight: "500",
          }}
        >
          {t("formName")}
        </p>
        <Select
          disabled={
            props.disabled ||
            !localLoadedActivityPropertyData?.ActivityProperty?.actGenPropInfo
              ?.m_bFormView
          }
          IconComponent={ExpandMoreIcon}
          style={{ width: props.customStyle, height: "2rem" }}
          variant="outlined"
          //autoWidth
          onChange={handleFormChange}
          value={
            localLoadedActivityPropertyData?.ActivityProperty?.actGenPropInfo
              ?.selFormId
          }
        >
          {formList.map((form) => (
            <MenuItem
              style={{ width: "100%", marginBlock: "0.2rem" }}
              key={form.formId}
              value={form.formId}
            >
              <p
                style={{
                  font: "0.8rem Open Sans",
                }}
              >
                {form.formName}
              </p>
            </MenuItem>
          ))}
        </Select>
      </div>
      {/* <>
        <div>
          <div
            style={{
              flexDirection: "row",
              marginLeft: "-0.6875rem",
              marginBottom: "0.3rem",
            }}
            className="flexScreen"
          >
            <Checkbox
              name="bulkEnabled"
              checked={
                localLoadedActivityPropertyData?.ActivityProperty
                  ?.actGenPropInfo?.m_bFormView
              }
              onChange={handleCheckSwitch}
              disabled={!formEnabledCheck}
              size="small"
            />
            <p
              style={{
                paddingTop: "0.8rem",

                fontWeight: "600",
              }}
            >
              {t("bulkEnabled")}
            </p>
          </div>

          <div style={{ marginBlock: "0.3rem" }}>
            <p
              style={{
                color: "black",

                fontWeight: "500",
              }}
            >
              {t("bulkForm")}
            </p>
            <Select
              IconComponent={ExpandMoreIcon}
              style={{ width: props.customStyle, height: "2rem" }}
              variant="outlined"
              //autoWidth
              // onChange={}
              disabled={!formEnabledCheck}
            >
              {formList.map((form) => (
                <MenuItem
                  style={{
                    width: "100%",
                    marginBlock: "0.2rem",
                    height: "2rem",
                    fontSize: "var(--base_text_font_size)",
                  }}
                >
                  <p
                    style={{
                      font: "0.8rem Open Sans",
                    }}
                  >
                    {form.formName}
                  </p>
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </> */}

      {/* <>
        {" "}
        {!customValidations ? (
          <p
            style={{
              color: "var(--link_color)",
              cursor: "pointer",
              marginTop: "1rem",
            }}
            onClick={() => setcustomValidations(true)}
          >
            {t("mentionCustomValidations")}
          </p>
        ) : null}
        {customValidations ? (
          <div style={{ marginBlock: "0.7rem" }}>
            <p
              style={{
                color: "#606060",
                marginBottom: "0.3rem",
              }}
            >
              {t("customValidations")}
            </p>
            <SunEditor
              width="100%"
              customHeight="6rem"
              placeholder={t("placeholderCustomValidation")}
              value={
                localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo
                  .genPropInfo.customValidation
              }
              getValue={(e) =>
                props.changeBasicDetails(e, "validationBasicDetails")
              }
            />
          </div>
        ) : null}
      </> */}
    </>
  );
}

export default FormsAndValidations;
