import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomizedDropdown from "../../../../UI/Components_With_ErrrorHandling/Dropdown";
import "./index.css";
import { Select, MenuItem } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import { store, useGlobalState } from "state-pool";
import { propertiesLabel } from "../../../../Constants/appConstants";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { OpenProcessSliceValue } from "../../../../redux-store/slices/OpenProcessSlice";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(even)": {
      backgroundColor: "#fff",
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    height: 40,
    borderSpacing: "0 0.125rem",
  },
  tableContainer: {
    padding: "1.5rem 0 0",
    height: 270,
  },
  tableRow: {
    height: 40,
  },
  tableHeader: {
    fontWeight: 600,
    fontSize: 13,
    backgroundColor: "#f8f8f8",
    borderTop: "1px solid #f8f8f8",
    borderBottom: "1px solid #f8f8f8",
    borderRadius: "0.125rem",
    color: "black",
    padding: "0 1vw",
  },
  tableBodyCell: {
    fontSize: "var(--base_text_font_size) !important",
    fontWeight: "500 !important",
    padding: "0 1vw",
  },
}));

function Fax(props) {
  let { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const [checked, setChecked] = useState({});
  const [allData, setAllData] = useState({});
  const [FaxDropdown, setFaxDropdown] = useState([]);
  const [faxNumber, setfaxNumber] = useState([]);
  const [isFaxConst, setIsFaxConst] = useState(false);
  const openProcessData = useSelector(OpenProcessSliceValue);
  const DropdownOptions = ["Status"];
  const [varDocSelected, setVarDocSelected] = useState(DropdownOptions[0]);
  const [allChecked, setAllChecked] = useState(false);
  const [isStatusCreated, setIsStatusCreated] = useState(null);

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

  useEffect(() => {
    let temp = [];
    let tempLocal = JSON.parse(JSON.stringify(localLoadedProcessData));
    tempLocal?.DynamicConstant?.forEach((el) => {
      let tempObj = {
        VariableName: el.ConstantName,
        VariableScope: "C",
        ExtObjId: "0",
        VarFieldId: "0",
        VariableId: "0",
      };
      temp.push(tempObj);
    });
    tempLocal?.Variable?.forEach((el) => {
      if (el.VariableScope === "M") {
        temp.push(el);
      }
    });
    setFaxDropdown(temp);
  }, [localLoadedProcessData]);

  const docTypeHandler = (e) => {
    setVarDocSelected(e.target.value);
  };

  const addHandler = () => {
    let temp1 = { ...allData };
    if (temp1["v_42_0"]) {
      dispatch(
        setToastDataFunc({
          message: t("docAlreadyAdded"),
          severity: "error",
          open: true,
        })
      );
    } else {
      let tempdata = {
        docTypeId: "0",
        DocName: "Status",
        createDoc: "N",
        m_bCreateCheckbox: false,
        m_bFax: false,
        varFieldId: "0",
        variableId: "42",
      };
      temp1 = { ...temp1, ["v_42_0"]: tempdata }; // key = [v_${variableId}_${varFieldId}]
      setAllData(temp1);

      let temp = { ...localLoadedActivityPropertyData };
      let SaveFax = {
        ...temp.ActivityProperty?.sendInfo?.faxInfo?.mapselectedfaxDocList,
      };
      temp.ActivityProperty.sendInfo.faxInfo.mapselectedfaxDocList = {
        ...SaveFax,
        [`v_42_0`]: tempdata,
      };
      setlocalLoadedActivityPropertyData(temp);
    }
  };

  useEffect(() => {
    let tempList =
      localLoadedActivityPropertyData?.ActivityProperty?.sendInfo?.faxInfo
        ?.mapselectedfaxDocList;
    let temp = {
      [`-998`]: {
        createDoc: "N",
        docTypeId: "-998",
        m_bCreateCheckbox: false,
        m_bFax: false,
        varFieldId: "0",
        variableId: "0",
        DocName: "Conversation",
      },
      [`-999`]: {
        createDoc: "N",
        docTypeId: "-999",
        m_bCreateCheckbox: false,
        m_bFax: false,
        varFieldId: "0",
        variableId: "0",
        DocName: "Audit Trail",
      },
    };
    if (tempList && tempList["v_42_0"]) {
      temp = {
        ...temp,
        ["v_42_0"]: {
          docTypeId: "0",
          DocName: "Status",
          createDoc: "N",
          m_bCreateCheckbox: false,
          m_bFax: false,
          varFieldId: "0",
          variableId: "42",
        },
      };
      if (isStatusCreated === null) {
        setIsStatusCreated(true);
      }
    }
    let tempLocal = JSON.parse(JSON.stringify(openProcessData.loadedData));
    tempLocal?.DocumentTypeList.forEach((el) => {
      temp = {
        ...temp,
        [`d_${el.DocTypeId}`]: {
          createDoc: "N",
          docTypeId: el.DocTypeId,
          m_bCreateCheckbox: false,
          m_bFax: true,
          varFieldId: "0",
          variableId: "0",
          DocName: el.DocName,
        },
      };
    });
    setAllData(temp);

    let tempCheck = {};
    let isFaxAllChecked = true;
    Object.keys(temp)?.forEach((el) => {
      tempCheck = {
        ...tempCheck,
        [el]: {
          m_bCreateCheckbox: tempList[el]?.m_bCreateCheckbox
            ? tempList[el].m_bCreateCheckbox
            : false,
          m_bFax: tempList[el]?.m_bFax ? tempList[el].m_bFax : false,
        },
      };
      if (!tempList[el]?.m_bFax) {
        isFaxAllChecked = false;
      }
    });
    setChecked(tempCheck);
    setAllChecked(isFaxAllChecked);

    setIsFaxConst(
      localLoadedActivityPropertyData?.ActivityProperty?.sendInfo?.faxInfo
        ?.m_bConstFaxFlag
    );
    if (
      localLoadedActivityPropertyData?.ActivityProperty?.sendInfo?.faxInfo
        ?.m_bConstFaxFlag
    ) {
      setfaxNumber(
        localLoadedActivityPropertyData?.ActivityProperty?.sendInfo?.faxInfo
          ?.m_strConstantFaxNumber
      );
    } else {
      setfaxNumber(
        localLoadedActivityPropertyData?.ActivityProperty?.sendInfo?.faxInfo
          ?.m_strFaxNumber
      );
    }
  }, [openProcessData.loadedData, localLoadedActivityPropertyData]);

  const faxNumHandler = (e, isConst) => {
    setfaxNumber(e.target.value);
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    temp.ActivityProperty.sendInfo.faxInfo.m_bConstFaxFlag = isConst;
    if (isConst) {
      temp.ActivityProperty.sendInfo.faxInfo.m_strConstantFaxNumber =
        e.target.value;
      temp.ActivityProperty.sendInfo.faxInfo.varFieldIdFax = "0";
      temp.ActivityProperty.sendInfo.faxInfo.varIdFax = "0";
      temp.ActivityProperty.sendInfo.faxInfo.varTypeFax = "0";
    } else {
      let varId, varFieldId, varType;
      FaxDropdown?.forEach((el) => {
        if (el.VariableName === e.target.value) {
          varId = el.VariableId;
          varFieldId = el.VarFieldId;
          varType = el.VariableType;
        }
      });
      temp.ActivityProperty.sendInfo.faxInfo.m_strFaxNumber = e.target.value;
      temp.ActivityProperty.sendInfo.faxInfo.varFieldIdFax = varFieldId;
      temp.ActivityProperty.sendInfo.faxInfo.varIdFax = varId;
      temp.ActivityProperty.sendInfo.faxInfo.varTypeFax = varType;
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.send]: { isModified: true, hasError: false },
      })
    );
  };

  const CheckHandler = (e, el) => {
    let tempCheck = { ...checked };
    let isFaxAllChecked = true;
    if (e.target.name === "m_bFax" && !e.target.checked) {
      tempCheck[el] = {
        ...tempCheck[el],
        [e.target.name]: e.target.checked,
        m_bCreateCheckbox: false,
      };
    } else {
      tempCheck[el] = { ...tempCheck[el], [e.target.name]: e.target.checked };
    }
    Object.keys(allData)?.forEach((el) => {
      if (!tempCheck[el].m_bFax) {
        isFaxAllChecked = false;
      }
    });
    setChecked(tempCheck);
    setAllChecked(isFaxAllChecked);
    let temp = { ...localLoadedActivityPropertyData };
    let SaveFax = {
      ...temp.ActivityProperty?.sendInfo?.faxInfo?.mapselectedfaxDocList,
    };
    if (el === "-998" || el === "-999") {
      temp.ActivityProperty.sendInfo.faxInfo.mapselectedfaxDocList = {
        ...SaveFax,
        [`${allData[el].docTypeId}`]: {
          createDoc: allData[el].createDoc,
          docTypeId: allData[el].docTypeId,
          m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
          m_bFax: tempCheck[el].m_bFax ? true : false,
          varFieldId: allData[el].varFieldId,
          variableId: allData[el].variableId,
        },
      };
    } else if (el === "v_42_0") {
      setIsStatusCreated(false);
      temp.ActivityProperty.sendInfo.faxInfo.mapselectedfaxDocList = {
        ...SaveFax,
        [`v_42_0`]: {
          createDoc: tempCheck[el].m_bCreateCheckbox
            ? "Y"
            : allData[el].createDoc,
          docTypeId: allData[el].docTypeId,
          m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
          m_bFax: tempCheck[el].m_bFax ? true : false,
          varFieldId: allData[el].varFieldId,
          variableId: allData[el].variableId,
        },
      };
    } else {
      temp.ActivityProperty.sendInfo.faxInfo.mapselectedfaxDocList = {
        ...SaveFax,
        [`d_${allData[el].docTypeId}`]: {
          createDoc: allData[el].createDoc,
          docTypeId: allData[el].docTypeId,
          m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
          m_bFax: tempCheck[el].m_bFax ? true : false,
          varFieldId: allData[el].varFieldId,
          variableId: allData[el].variableId,
        },
      };
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.send]: { isModified: true, hasError: false },
      })
    );
  };

  const handleAllCheck = (e) => {
    setIsStatusCreated(false);
    setAllChecked(e.target.checked);
    let tempCheck = { ...checked };
    Object.keys(allData)?.forEach((el) => {
      if (!e.target.checked) {
        tempCheck[el] = {
          ...tempCheck[el],
          m_bFax: e.target.checked,
          m_bCreateCheckbox: false,
        };
      } else {
        tempCheck[el] = { ...tempCheck[el], m_bFax: e.target.checked };
      }
    });
    setChecked(tempCheck);
    let temp = { ...localLoadedActivityPropertyData };
    let SaveFax = {
      ...temp.ActivityProperty?.sendInfo?.faxInfo?.mapselectedfaxDocList,
    };
    let tempLocalCheck = {};
    Object.keys(allData)?.forEach((el) => {
      if (el === "-998" || el === "-999") {
        tempLocalCheck = {
          ...tempLocalCheck,
          [`${allData[el].docTypeId}`]: {
            createDoc: allData[el].createDoc,
            docTypeId: allData[el].docTypeId,
            m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
            m_bFax: tempCheck[el].m_bFax ? true : false,
            varFieldId: allData[el].varFieldId,
            variableId: allData[el].variableId,
          },
        };
      } else if (el === "v_42_0") {
        tempLocalCheck = {
          ...tempLocalCheck,
          [`v_42_0`]: {
            createDoc: tempCheck[el].m_bCreateCheckbox
              ? "Y"
              : allData[el].createDoc,
            docTypeId: allData[el].docTypeId,
            m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
            m_bFax: tempCheck[el].m_bFax ? true : false,
            varFieldId: allData[el].varFieldId,
            variableId: allData[el].variableId,
          },
        };
      } else {
        tempLocalCheck = {
          ...tempLocalCheck,
          [`d_${allData[el].docTypeId}`]: {
            createDoc: allData[el].createDoc,
            docTypeId: allData[el].docTypeId,
            m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
            m_bFax: tempCheck[el].m_bFax ? true : false,
            varFieldId: allData[el].varFieldId,
            variableId: allData[el].variableId,
          },
        };
      }
    });

    temp.ActivityProperty.sendInfo.faxInfo.mapselectedfaxDocList = {
      ...SaveFax,
      ...tempLocalCheck,
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
      <div
        style={{
          display: "flex",
          flexDirection: props.isDrawerExpanded ? "row" : "column",
          gap: props.isDrawerExpanded ? "3vw" : "1rem",
        }}
      >
        <div className="row" style={{ alignItems: "end", gap: "1vw" }}>
          <div>
            <p className="varUsedLabel">{t("DocType")}</p>
            <Select
              className="dropdownEmail"
              MenuProps={menuProps}
              value={varDocSelected}
              onChange={(event) => docTypeHandler(event)}
              style={{ margin: "var(--spacing_v) 0" }}
            >
              {DropdownOptions?.map((element) => {
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
          <button
            className="addbtnEmail"
            style={{ margin: "0 !important" }}
            onClick={addHandler}
          >
            {t("add")}
          </button>
        </div>
        <div>
          <p className="varUsedLabel">
            {t("faxNo")}
            <span className="starIcon">*</span>
          </p>
          <div style={{ margin: "var(--spacing_v) 0" }}>
            <CustomizedDropdown
              className="dropdownEmail"
              value={faxNumber}
              onChange={(event, isConst) => faxNumHandler(event, isConst)}
              isConstant={isFaxConst}
              setIsConstant={(val) => setIsFaxConst(val)}
              showConstValue={true}
              menuItemStyles="menuItemStylesDropdown"
            >
              {FaxDropdown?.map((element) => {
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
            </CustomizedDropdown>
          </div>
        </div>
      </div>

      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table
          className={`${classes.table} ${
            props.isDrawerExpanded
              ? "webServicePropertiestableEx"
              : "webServicePropertiestableCo"
          } webServicePropertiestable`}
          style={{ width: "60%" }}
          aria-label="customized table"
          stickyHeader
        >
          <TableHead>
            <StyledTableRow className={classes.tableRow}>
              <StyledTableCell
                className={classes.tableHeader}
                style={{ width: "32vw" }}
              >
                {t("Document")}
              </StyledTableCell>
              <StyledTableCell
                className={classes.tableHeader}
                style={{ width: "32vw" }}
              >
                <Checkbox
                  className="emailCheck"
                  checked={allChecked}
                  onChange={(e) => handleAllCheck(e)}
                />
                {t("fax")}
              </StyledTableCell>
              <StyledTableCell
                className={classes.tableHeader}
                style={{ width: "32vw" }}
              >
                <Checkbox className="emailCheck" disabled />
                {t("CreateIfNotFound")}
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody className="associatedTemplateDiv">
            {Object.keys(allData).map((el) => (
              <StyledTableRow
                key={allData[el].DocId}
                className={classes.tableRow}
              >
                <StyledTableCell
                  className={classes.tableBodyCell}
                  component="th"
                  scope="row"
                  style={{ width: "32vw" }}
                >
                  {allData[el].DocName}
                </StyledTableCell>

                <StyledTableCell
                  className={classes.tableBodyCell}
                  style={{ width: "32vw" }}
                >
                  <Checkbox
                    className="emailCheck"
                    name="m_bFax"
                    checked={checked[el]?.m_bFax}
                    onChange={(e) => CheckHandler(e, el)}
                  />
                </StyledTableCell>
                <StyledTableCell
                  className={classes.tableBodyCell}
                  style={{ width: "32vw" }}
                >
                  <Checkbox
                    className="emailCheck"
                    name="m_bCreateCheckbox"
                    disabled={
                      allData[el].DocName !== "Status"
                        ? true
                        : isStatusCreated && allData[el].DocName === "Status"
                        ? true
                        : !checked[el]?.m_bFax
                        ? true
                        : false
                    }
                    checked={
                      isStatusCreated ? false : checked[el]?.m_bCreateCheckbox
                    }
                    onChange={(e) => CheckHandler(e, el)}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(mapStateToProps, null)(Fax);
