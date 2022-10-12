// #BugID - 115277
// #BugDescription - handled checks for redirecting blank page on close.
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import CustomizedDropdown from "../../../../UI/Components_With_ErrrorHandling/Dropdown";
import "./index.css";
import { Select, MenuItem } from "@material-ui/core";
import { Checkbox } from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import { store, useGlobalState } from "state-pool";
import arabicStyles from "./ArabicStyles.module.css";
import {
  propertiesLabel,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";
import { OpenProcessSliceValue } from "../../../../redux-store/slices/OpenProcessSlice";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";
import { isReadOnlyFunc } from "../../../../utility/CommonFunctionCall/CommonFunctionCall";

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

function Print(props) {
  let { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const DropdownOptions = ["Status"];
  const [varDocSelected, setVarDocSelected] = useState(DropdownOptions[0]);
  const [checked, setChecked] = useState({});
  const [allChecked, setAllChecked] = useState(false);
  const openProcessData = useSelector(OpenProcessSliceValue);
  const [isStatusCreated, setIsStatusCreated] = useState(null);
  const [allData, setAllData] = useState({});
  let isReadOnly = isReadOnlyFunc(localLoadedProcessData, props.cellCheckedOut);

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
        m_bPrint: false,
        varFieldId: "0",
        variableId: "42",
      };

      temp1 = { ...temp1, ["v_42_0"]: tempdata }; // key = [v_${variableId}_${varFieldId}]
      setAllData(temp1);

      let temp = { ...localLoadedActivityPropertyData };
      let SavePrint = {
        ...temp.ActivityProperty?.sendInfo?.printInfo?.mapselectedprintDocList,
      };
      temp.ActivityProperty.sendInfo.printInfo.mapselectedprintDocList = {
        ...SavePrint,
        [`v_42_0`]: tempdata,
      };
      setlocalLoadedActivityPropertyData(temp);
    }
  };

  useEffect(() => {
    let tempList =
      localLoadedActivityPropertyData?.ActivityProperty?.sendInfo?.printInfo
        ?.mapselectedprintDocList;
    let temp = {
      [`-998`]: {
        createDoc: "N",
        docTypeId: "-998",
        m_bCreateCheckbox: false,
        m_bPrint: false,
        varFieldId: "0",
        variableId: "0",
        DocName: "Conversation",
      },
      [`-999`]: {
        createDoc: "N",
        docTypeId: "-999",
        m_bCreateCheckbox: false,
        m_bPrint: false,
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
          m_bPrint: false,
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
          m_bPrint: true,
          varFieldId: "0",
          variableId: "0",
          DocName: el.DocName,
        },
      };
    });
    setAllData(temp);

    let tempCheck = {};
    let isPrintAllChecked = true;
    Object.keys(temp)?.forEach((el) => {
      console.log("mahtab", typeof tempList)
       tempCheck = {
        ...tempCheck,
        [el]: {
          m_bCreateCheckbox: typeof tempList != "undefined" && tempList[el]?.m_bCreateCheckbox
            ? tempList[el].m_bCreateCheckbox
            : false,
          m_bPrint: typeof tempList != "undefined" && tempList[el]?.m_bPrint ? tempList[el].m_bPrint : false, 
        },
      };
       if (typeof tempList != "undefined" && !tempList[el]?.m_bPrint) {
        isPrintAllChecked = false;
      }  
    });
    setChecked(tempCheck);
    setAllChecked(isPrintAllChecked);
  }, [openProcessData.loadedData, localLoadedActivityPropertyData]);

  const CheckHandler = (e, el) => {
    let tempCheck = { ...checked };
    let isPrintAllChecked = true;
    if (e.target.name === "m_bPrint" && !e.target.checked) {
      tempCheck[el] = {
        ...tempCheck[el],
        [e.target.name]: e.target.checked,
        m_bCreateCheckbox: false,
      };
    } else {
      tempCheck[el] = { ...tempCheck[el], [e.target.name]: e.target.checked };
    }
    Object.keys(allData)?.forEach((el) => {
      if (!tempCheck[el].m_bPrint) {
        isPrintAllChecked = false;
      }
    });
    setChecked(tempCheck);
    setAllChecked(isPrintAllChecked);
    let temp = { ...localLoadedActivityPropertyData };
    let SavePrint = {
      ...temp.ActivityProperty?.sendInfo?.printInfo?.mapselectedprintDocList,
    };
    if (el === "-998" || el === "-999") {
      temp.ActivityProperty.sendInfo.printInfo.mapselectedprintDocList = {
        ...SavePrint,
        [`${allData[el].docTypeId}`]: {
          createDoc: allData[el].createDoc,
          docTypeId: allData[el].docTypeId,
          m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
          m_bPrint: tempCheck[el].m_bPrint ? true : false,
          varFieldId: allData[el].varFieldId,
          variableId: allData[el].variableId,
        },
      };
    } else if (el === "v_42_0") {
      setIsStatusCreated(false);
      temp.ActivityProperty.sendInfo.printInfo.mapselectedprintDocList = {
        ...SavePrint,
        [`v_42_0`]: {
          createDoc: tempCheck[el].m_bCreateCheckbox
            ? "Y"
            : allData[el].createDoc,
          docTypeId: allData[el].docTypeId,
          m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
          m_bPrint: tempCheck[el].m_bPrint ? true : false,
          varFieldId: allData[el].varFieldId,
          variableId: allData[el].variableId,
        },
      };
    } else {
      temp.ActivityProperty.sendInfo.printInfo.mapselectedprintDocList = {
        ...SavePrint,
        [`d_${allData[el].docTypeId}`]: {
          createDoc: allData[el].createDoc,
          docTypeId: allData[el].docTypeId,
          m_bCreateCheckbox: tempCheck[el].m_bCreateCheckbox ? true : false,
          m_bPrint: tempCheck[el].m_bPrint ? true : false,
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
          m_bPrint: e.target.checked,
          m_bCreateCheckbox: false,
        };
      } else {
        tempCheck[el] = { ...tempCheck[el], m_bPrint: e.target.checked };
      }
    });
    setChecked(tempCheck);
    let temp = { ...localLoadedActivityPropertyData };
    let SavePrint = {
      ...temp.ActivityProperty?.sendInfo?.printInfo?.mapselectedprintDocList,
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
            m_bPrint: tempCheck[el].m_bPrint ? true : false,
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
            m_bPrint: tempCheck[el].m_bPrint ? true : false,
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
            m_bPrint: tempCheck[el].m_bPrint ? true : false,
            varFieldId: allData[el].varFieldId,
            variableId: allData[el].variableId,
          },
        };
      }
    });

    temp.ActivityProperty.sendInfo.printInfo.mapselectedprintDocList = {
      ...SavePrint,
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
    <div className="marginAllAround" style={{ direction: direction }}>
      <p
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.varUsedLabel
            : "varUsedLabel"
        }
      >
        {t("DocType")}
      </p>

      <div className="row" style={{ gap: "1vw" }}>
        <CustomizedDropdown
          className="dropdownEmail"
          MenuProps={menuProps}
          value={varDocSelected}
          onChange={(event) => docTypeHandler(event)}
          disabled={isReadOnly}
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
        </CustomizedDropdown>
        <button
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.addbtnEmail
              : isReadOnly
              ? "disabledbtnEmail"
              : "addbtnEmail"
          }
          disabled={isReadOnly}
          onClick={addHandler}
        >
          {t("add")}
        </button>
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
                  disabled={isReadOnly}
                />
                {t("Print")}
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
                    name="m_bPrint"
                    checked={checked[el]?.m_bPrint}
                    onChange={(e) => CheckHandler(e, el)}
                    disabled={isReadOnly}
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
                      allData[el].DocName !== "Status" || isReadOnly
                        ? true
                        : (isStatusCreated &&
                            allData[el].DocName === "Status") ||
                          isReadOnly
                        ? true
                        : !checked[el]?.m_bPrint || isReadOnly
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
    cellCheckedOut: state.selectedCellReducer.selectedCheckedOut,
  };
};

export default connect(mapStateToProps, null)(Print);
