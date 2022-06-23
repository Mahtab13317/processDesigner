import React, { useState, useEffect } from "react";
import styles from "./index.module.css";
import arabicStyles from "./arabicStyles.module.css";
import CloseIcon from "@material-ui/icons/Close";
import { useTranslation } from "react-i18next";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import {
  ENDPOINT_ADD_METHOD,
  ENDPOINT_SAP_DETAIL,
  RTL_DIRECTION,
  SERVER_URL,
} from "../../../Constants/appConstants";
import { useDispatch } from "react-redux";
import { MenuItem, Select } from "@material-ui/core";
import { setToastDataFunc } from "../../../redux-store/slices/ToastDataHandlerSlice";
import TextInput from "../../../UI/Components_With_ErrrorHandling/InputField";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core";
import "./sapModal.css";

const useStyles = makeStyles((theme) => ({}));

function SapFunctionModal(props) {
  const classes = useStyles();
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  const [selctedRadio, setSelctedRadio] = useState("ListAll");
  const [allFunctionList, setAllFunctionList] = useState([]);
  const [allList, setallList] = useState(null);
  const [bussniessObj, setBussniessObj] = useState([]);
  const [businessObjectType, setbusinessObjectType] = useState(null);
  const [method, setmethod] = useState([]);
  const [selectedMethod, setselectedMethod] = useState(null);
  const [ABPAname, setABPAname] = useState("");

  const cancelHandler = () => {
    props.setShowModal(false);
  };
  const createHandler = () => {
    if (selctedRadio == "ListAll") {
      props.functionName(allList);
      props.setShowModal(false);
    } else {
      props.functionName(ABPAname);
      props.setShowModal(false);
    }
  };
  const radioBtnHandler = (e) => {
    setSelctedRadio(e.target.value);
  };
  const onChange = () => {};

  const listAllHandler = (val) => {
    setallList(val.SAPFunctionModule);
  };

  const bussniessObjHandler = (e) => {
    setbusinessObjectType(e.target.value);
  };
  const methodHandler = (e) => {
    setselectedMethod(e.target.value);
  };
  useEffect(() => {
    method?.map((el) => {
      if (el.MethodName == selectedMethod) {
        setABPAname(el.ABAPFunName);
      }
    });
  }, [selectedMethod, selctedRadio, ABPAname]);

  useEffect(() => {
    let json = {
      strSAPHostName: props.changedSelection.hostName,
      strSAPClient: props.changedSelection.clientName,
      strSAPUserName: props.changedSelection.username,
      strSAPAuthCred: props.changedSelection.password,
      strSAPLanguage: props.changedSelection.language,
      strSAPInstanceNo: props.changedSelection.instanceNo,
    };
    if (selctedRadio == "ListAll") {
      axios
        .post(SERVER_URL + ENDPOINT_SAP_DETAIL + "/" + selctedRadio, json)
        .then((res) => {
          setAllFunctionList(res.data.SAPFunctionModules);
        });
    } else {
      axios
        .post(SERVER_URL + ENDPOINT_SAP_DETAIL + "/" + selctedRadio, json)
        .then((res) => {
          setBussniessObj(res.data.SAPBusinessObjects);
        });

      axios.post(SERVER_URL + ENDPOINT_ADD_METHOD, json).then((res) => {
        setmethod(res?.data?.ABAPFunction);
      });
    }
  }, [selctedRadio]);

  return (
    <React.Fragment>
      <div className="row">
        <p className="heading_create">{t("SAPFunction")}</p>
        <p
          className="close"
          onClick={cancelHandler}
          style={{ marginLeft: "auto", cursor: "pointer" }}
        >
          <CloseIcon />
        </p>
      </div>
      <hr className="hr" />

      <div style={{ marginTop: "1%" }}>
        <RadioGroup
          name="protocol"
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.webS_radioDiv
              : styles.webS_radioDiv
          }
          value={selctedRadio}
          onChange={(e) => radioBtnHandler(e)}
        >
          <FormControlLabel
            value={"ListAll"}
            control={<Radio />}
            label={t("ListAll")}
            id="webS_ManualOpt"
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.webS_radioButton
                : styles.webS_radioButton
            }
          />
          <FormControlLabel
            value={"BusinessObject"}
            control={<Radio />}
            label={t("bussinessObject")}
            id="webS_LoadOpt"
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.webS_radioButton
                : styles.webS_radioButton
            }
          />
        </RadioGroup>
      </div>

      {selctedRadio == "ListAll" ? (
        <>
          <label
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.webSLabel
                : styles.webSLabel
            }
          >
            {t("AvailableFunctionList")}
          </label>

          <Autocomplete
            size="small"
            classes={classes}
            onChange={(event, newValue) => {
              listAllHandler(newValue);
            }}
            id="functionDropdown"
            name="configuration"
            options={allFunctionList}
            ListboxProps={{
              style: {
                maxHeight: "350px",
              },
            }}
            getOptionLabel={(option) => option.SAPFunctionModule}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" size="small" />
            )}
          />
        </>
      ) : (
        <>
          <label
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.webSLabel
                : styles.webSLabel
            }
          >
            {t("bussinessObjectType")}
            <span
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.starIcon
                  : styles.starIcon
              }
            >
              *
            </span>
          </label>

          <Select
            className={`webSSelect ${
              direction === RTL_DIRECTION
                ? arabicStyles.webSSelect
                : styles.webSSelect
            }`}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
            name="configuration"
            value={businessObjectType}
            idTag="webS_configuration"
            onChange={bussniessObjHandler}
          >
            <MenuItem
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.webSDropdownData
                  : styles.webSDropdownData
              }
              value={""}
            >
              {""}
            </MenuItem>
            {bussniessObj.map((option) => {
              return (
                <MenuItem
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.webSDropdownData
                      : styles.webSDropdownData
                  }
                  value={option.SAPBusinessObject}
                >
                  {option.SAPBusinessObject}
                </MenuItem>
              );
            })}
          </Select>

          <label
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.webSLabel
                : styles.webSLabel
            }
          >
            {t("Method")}
            <span
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.starIcon
                  : styles.starIcon
              }
            >
              *
            </span>
          </label>

          <Select
            className={`webSSelect ${
              direction === RTL_DIRECTION
                ? arabicStyles.webSSelect
                : styles.webSSelect
            }`}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
            name="configuration"
            value={selectedMethod}
            idTag="webS_configuration"
            onChange={methodHandler}
          >
            <MenuItem
              className={
                direction === RTL_DIRECTION
                  ? arabicStyles.webSDropdownData
                  : styles.webSDropdownData
              }
              value={""}
            >
              {""}
            </MenuItem>
            {method.map((option) => {
              return (
                <MenuItem
                  className={
                    direction === RTL_DIRECTION
                      ? arabicStyles.webSDropdownData
                      : styles.webSDropdownData
                  }
                  value={option.MethodName}
                >
                  {option.MethodName}
                </MenuItem>
              );
            })}
          </Select>

          <label
            className={
              direction === RTL_DIRECTION
                ? arabicStyles.webSLabel
                : styles.webSLabel
            }
          >
            {t("AbpsFunction")}
          </label>
          <TextInput
            classTag={styles.webSInput}
            inputValue={ABPAname}
            idTag="Sap_hostName"
          />
        </>
      )}

      <div className={styles.footerModal}>
        <button className="cancel" onClick={cancelHandler}>
          {t("cancel")}
        </button>
        <button
          className="create"
          style={{ marginRight: ".2rem" }}
          onClick={createHandler}
        >
          {t("Ok")}
        </button>
      </div>
    </React.Fragment>
  );
}

export default SapFunctionModal;
