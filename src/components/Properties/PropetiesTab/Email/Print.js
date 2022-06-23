import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomizedDropdown from "../../../../UI/Components_With_ErrrorHandling/Dropdown";
import "./index.css";
import { Select, MenuItem } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { store, useGlobalState } from "state-pool";
import arabicStyles from "./ArabicStyles.module.css";
import { RTL_DIRECTION } from "../../../../Constants/appConstants";

function Print(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [varDocSelected, setVarDocSelected] = useState("");
  const [checked, setChecked] = useState({});

  let DropdownOptions = ["Status"];

  const [allData, setAllData] = useState({});
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

  const addHandler = () => {
    let tempdata = {
      docTypeId: "0",
      DocName: "Status",
      createDoc: "N",
      m_bCreateCheckbox: false,
      m_bPrint: false,
      varFieldId: "0",
      variableId: "42",
    };
    let temp = { ...allData };
    temp = { ...temp, ["v_42_0"]: tempdata };
    setAllData(temp);
  };

  useEffect(() => {
    let temp = {};

    localLoadedProcessData &&
      localLoadedProcessData.DocumentTypeList.forEach((el) => {
        temp = {
          ...temp,
          [`d_${el.DocTypeId}`]: {
            createDoc: "N",
            docTypeId: el.DocTypeId,
            m_bCreateCheckbox: false,
            m_bPrint: true,
            varFieldId: "0",
            variableId: "0",
            DocName: el.DocName,
          },
        };
      });
    setAllData(temp);

    let tempList =
      localLoadedActivityPropertyData?.ActivityProperty?.sendInfo?.printInfo
        ?.mapselectedprintDocList;
    Object.keys(tempList).forEach((el) => {
      tempList[el] = { ...tempList[el] };
    });

    let tempCheck = {};
    Object.keys(tempList).forEach((el) => {
      tempCheck = {
        ...tempCheck,
        [el]: {
          m_bCreateCheckbox: tempList[el].m_bCreateCheckbox,
          m_bPrint: tempList[el].m_bPrint,
        },
      };
    });
    setChecked(tempCheck);
  }, []);

  const CheckHandler = (e, el) => {
    let tempCheck = { ...checked };
    tempCheck[el] = {};
  };

  return (
    <div className="marginAllAround" style={{ direction: direction }}>
      <p
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.varUsedLabel
            : "varUsedLabel"
        }
      >
        {t("varUsedForDocType")}
      </p>

      <div className="row">
        <CustomizedDropdown
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
        </CustomizedDropdown>

        <button
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.addbtnEmail
              : "addbtnEmail"
          }
          onClick={addHandler}
        >
          {t("add")}
        </button>
      </div>

      <table style={{ marginTop: "1.5rem" }}>
        <tr style={{ background: "#F8F8F8", height: "40px" }}>
          <td className="document" style={{ fontWeight: "600" }}>
            {t("Document")}
          </td>
          <td className="print" style={{ fontWeight: "600" }}>
            {t("Print")}
          </td>
          <td className="notFound" style={{ fontWeight: "600" }}>
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
                    checked={checked[el]?.m_bPrint}
                    onChange={(e) => CheckHandler(e, el)}
                  />
                </td>
                <td className="notFound" style={{ paddingLeft: "50px" }}>
                  <Checkbox
                    style={{
                      height: "14px",
                      width: "14px",
                    }}
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

export default Print;
