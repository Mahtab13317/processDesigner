import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomizedDropdown from "../../../../UI/Components_With_ErrrorHandling/Dropdown";
import "./index.css";
import { Select, MenuItem } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { store, useGlobalState } from "state-pool";
import arabicStyles from "./ArabicStyles.module.css";
import {
  propertiesLabel,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { OpenProcessSliceValue } from "../../../../redux-store/slices/OpenProcessSlice";

function Fax(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [variableDefinition] = useGlobalState("variableDefinition");
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [checked, setChecked] = useState({});
  const [allData, setAllData] = useState({});
  const [FaxNo, setFaxNo] = useState([]);
  const [faxNumber, setfaxNumber] = useState([]);
  const openProcessData = useSelector(OpenProcessSliceValue);
  let DropdownOptions = ["Status"];

  const [varDocSelected, setVarDocSelected] = useState("");

  useEffect(() => {
    let temp = [];
    variableDefinition &&
      variableDefinition.map((el) => {
        if (el.VariableScope === "M") {
          temp.push(el);
        }
      });
    setFaxNo(temp);
  }, []);

  const docTypeHandler = (e) => {
    setVarDocSelected(e.target.value);
  };

  const menuProps = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    style: {
      maxHeight: 400,
    },
    getContentAnchorEl: null,
  };

  const dispatch = useDispatch();

  useEffect(() => {
    let temp = {};
    let tempLocal = JSON.parse(JSON.stringify(openProcessData.loadedData));
    tempLocal?.DocumentTypeList.forEach((el) => {
      temp = {
        ...temp,
        [`d_${el.DocTypeId}`]: {
          createDoc: "N",
          docTypeId: el.DocTypeId,
          m_bCreateCheckbox: false,
          m_bFax: false,
          varFieldId: "0",
          variableId: "0",
          DocName: el.DocName,
        },
      };
    });
    setAllData(temp);

    let tempList =
      localLoadedActivityPropertyData.ActivityProperty?.sendInfo?.faxInfo
        ?.mapselectedfaxDocList;

    let tempCheck = {};
    Object.keys(tempList).forEach((el) => {
      tempCheck = {
        ...tempCheck,
        [el]: {
          m_bCreateCheckbox: tempList[el].m_bCreateCheckbox,
          m_bFax: tempList[el].m_bFax,
        },
      };
    });
    setChecked(tempCheck);

    setfaxNumber(
      localLoadedActivityPropertyData.ActivityProperty?.sendInfo?.faxInfo
        ?.m_strFaxNumber
    );
  }, [openProcessData.loadedData]);

  const faxNumHandler = (e) => {
    setfaxNumber(e.target.value);
  };

  const CheckHandler = (e, el) => {
    let tempCheck = { ...checked };
    tempCheck[el] = { ...tempCheck[el], [e.target.name]: e.target.checked };
    setChecked(tempCheck);

    let temp = { ...localLoadedActivityPropertyData };
    let SaveFax = {
      ...temp.ActivityProperty?.sendInfo?.faxInfo?.mapselectedfaxDocList,
    };
    // if (e.target.checked) {
    temp.ActivityProperty.sendInfo.faxInfo.mapselectedfaxDocList = {
      ...SaveFax,
      [`d_${allData[el].docTypeId}`]: {
        createDoc: allData[el].createDoc,
        doctypeId: allData[el].docTypeId,
        m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
        m_bFax: tempCheck[el].m_bFax ? true : false,
        varFieldId: allData[el].varFieldId,
        variableId: allData[el].variableId,
      },
    };

    setlocalLoadedActivityPropertyData(temp);

    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.send]: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <div className="marginAllAround">
      <div className="row">
        <div>
          <p className="varUsedLabel">{t("Fax No")}*</p>
          <Select
            className="dropdownEmail"
            MenuProps={menuProps}
            value={faxNumber}
            onChange={(event) => faxNumHandler(event)}
          >
            {FaxNo &&
              FaxNo.map((element) => {
                return (
                  <MenuItem
                    className="menuItemStylesDropdown"
                    key={element.VariableName}
                    value={element.VariableName}
                  >
                    {element.VariableName}
                  </MenuItem>
                );
              })}
          </Select>
        </div>
        <div>
          <p className="varUsedLabel">{t("varUsedForDocType")}</p>
          <Select
            className="dropdownEmail"
            MenuProps={menuProps}
            value={varDocSelected}
            onChange={(event) => docTypeHandler(event)}
          >
            {DropdownOptions &&
              DropdownOptions.map((element) => {
                return (
                  <MenuItem
                    className="menuItemStylesDropdown"
                    key={element}
                    value={element}
                  >
                    {element}
                  </MenuItem>
                );
              })}
          </Select>
        </div>
        <button className="addbtnEmail" style={{ marginTop: "15px" }}>
          {t("add")}
        </button>
      </div>

      <table style={{ marginTop: "1.5rem" }}>
        <tr style={{ background: "#F8F8F8", height: "40px" }}>
          <td className="document" style={{ fontWeight: "700" }}>
            {t("Document")}
          </td>
          <td className="print" style={{ fontWeight: "700" }}>
            {t("Print")}
          </td>
          <td className="notFound" style={{ fontWeight: "700" }}>
            {t("Create if not found")}
          </td>
        </tr>
        <tbody>
          {Object.keys(allData)?.map((el) => {
            return (
              <tr
                style={{
                  height: "30px",
                  padding: "12px",
                  //   background: index % 2 ? "#f8f8f8" : null,
                }}
              >
                <td className="document">{allData[el].DocName}</td>
                <td className="print" style={{ paddingLeft: "10px" }}>
                  <Checkbox
                    style={{
                      height: "14px",
                      width: "14px",
                    }}
                    name="m_bFax"
                    checked={checked[el]?.m_bFax}
                    onChange={(e) => CheckHandler(e, el)}
                  />
                </td>
                <td className="notFound" style={{ paddingLeft: "50px" }}>
                  <Checkbox
                    style={{
                      height: "14px",
                      width: "14px",
                    }}
                    name="m_bCreateCheckbox"
                    checked={checked[el]?.m_bCreateCheckbox}
                    onChange={(e) => CheckHandler(e, el)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Fax;
