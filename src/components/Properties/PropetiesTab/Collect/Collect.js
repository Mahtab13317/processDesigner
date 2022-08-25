import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import classes from "./Collect.module.css";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import StarRateSharpIcon from "@material-ui/icons/StarRateSharp";
import SelectWithInput from "../../../../UI/SelectWithInput/index.js";
import { useGlobalState, store } from "state-pool";
import {
  PROCESSTYPE_LOCAL,
  propertiesLabel,
} from "../../../../Constants/appConstants.js";
import MenuItem from "@material-ui/core/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import {
  ActivityPropertyChangeValue,
  setActivityPropertyChange,
} from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { OpenProcessSliceValue } from "../../../../redux-store/slices/OpenProcessSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import TabsHeading from "../../../../UI/TabsHeading";

function Collect(props) {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const openProcessData = useSelector(OpenProcessSliceValue);
  const [isDisableTab, setisDisableTab] = useState(false);
  const allTabStatus = useSelector(ActivityPropertyChangeValue);
  const saveCancelStatus = useSelector(ActivityPropertySaveCancelValue);

  const [
    inclusiveDistributeActivitiesList,
    setInclusiveDistributeActivitiesList,
  ] = useState([]);

  const [
    parallelDistributeActivitiesList,
    setparallelDistributeActivitiesList,
  ] = useState([]);

  const [PrimaryActivityList, setPrimaryActivityList] = useState([]);
  const [isParallelCollect, setisParallelCollect] = useState(false);
  const [isConstantFlag, setisConstantFlag] = useState(false);
  const [intVariables, setintVariables] = useState([]);
  const [primaryError, setprimaryError] = useState(false);
  const [distributeError, setdistributeError] = useState(false);
  const [comboBoxError, setcomboBoxError] = useState(false);

  useEffect(() => {
    if (saveCancelStatus.SaveClicked) {
      validateCollectInfo("SAVE_CLICKED");
      dispatch(setSave({ SaveClicked: false }));
    }
  }, [saveCancelStatus.SaveClicked, saveCancelStatus.CancelClicked]);

  //check if activity is parallel or inclusive collect
  useEffect(() => {
    // code edited on 12 August 2022 for BugId 114242
    function checkParallelCollectActivity() {
      if (
        +localLoadedActivityPropertyData?.ActivityProperty?.actType === 6 &&
        +localLoadedActivityPropertyData?.ActivityProperty?.actSubType === 2
      )
        setisParallelCollect(true);
      else setisParallelCollect(false);
    }
    checkParallelCollectActivity();
  }, [
    localLoadedActivityPropertyData?.ActivityProperty?.actSubType,
    localLoadedActivityPropertyData?.ActivityProperty?.actType,
  ]);

  //create distributeworkstep dropdown
  useEffect(() => {
    // code edited on 12 August 2022 for BugId 114242
    let tempOpenProcess = JSON.parse(
      JSON.stringify(openProcessData.loadedData)
    );
    let inclusiveDistributeList = [];
    let parallelDistributeList = [];
    tempOpenProcess?.MileStones?.forEach((mileStone) => {
      mileStone?.Activities?.forEach((activity) => {
        if (!isParallelCollect) {
          if (+activity.ActivityType === 5 && +activity.ActivitySubType === 1) {
            inclusiveDistributeList.push(activity);
          }
        } else if (isParallelCollect) {
          if (+activity.ActivityType === 5 && +activity.ActivitySubType === 2) {
            parallelDistributeList.push(activity);
          }
        }
      });
    });
    setInclusiveDistributeActivitiesList(inclusiveDistributeList);
    setparallelDistributeActivitiesList(parallelDistributeList);
  }, [isParallelCollect, openProcessData.loadedData]);

  const getActivityDetailsFromId = (id) => {
    let tempOpenProcess = JSON.parse(
      JSON.stringify(openProcessData.loadedData)
    );
    let act;
    tempOpenProcess?.MileStones?.forEach((mileStone) => {
      mileStone?.Activities?.forEach((activity) => {
        if (activity.ActivityId === id) {
          act = activity;
        }
      });
    });
    return act;
  };

  //create primaryworkstep dropdown
  useEffect(() => {
    function createPrimaryWorkstepActivityList() {
      let tempOpenProcess = JSON.parse(
        JSON.stringify(openProcessData.loadedData)
      );

      tempOpenProcess.Connections.forEach((conn) => {
        if (conn.TargetId === props.cellID) {
          setPrimaryActivityList((prevState) => [
            ...prevState,
            getActivityDetailsFromId(conn.SourceId),
          ]);
        }
      });
    }
    createPrimaryWorkstepActivityList();
  }, [openProcessData.loadedData]);

  useEffect(() => {
    if (localLoadedProcessData.ProcessType !== PROCESSTYPE_LOCAL)
      setisDisableTab(true);
  }, [localLoadedProcessData?.ProcessType]);

  useEffect(() => {
    let tempList = [];
    localLoadedProcessData?.Variable?.forEach((item) => {
      if (+item.VariableType === "3") {
        tempList.push(item);
      }
    });
    setintVariables(tempList);
  }, [localLoadedProcessData?.Variable]);

  const getSelectedActivity = (data) => {};

  const collectChangeHandler = (e) => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    if (e.target.name === "primaryDistributeDropdown") {
      temp.ActivityProperty.collectInfo.primaryAct = e.target.value;
    } else if (e.target.name === "DistributeWorkstepDropdown") {
      temp.ActivityProperty.collectInfo.assocActId = e.target.value + "";
    } else if (e.target.name === "deleteCheckbox") {
      temp.ActivityProperty.collectInfo.deleteOnCollect = e.target.checked
        ? "Y"
        : "N";
    } else if (e.target.name === "radioGroup") {
      temp.ActivityProperty.collectInfo.exOnPrimaryFlag = e.target.value;
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.collect]: { isModified: true, hasError: false },
      })
    );
  };

  const handleComboBoxValue = (val) => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    if (!isNaN(val)) {
      temp.ActivityProperty.collectInfo.collNoOfIns = val;
      temp.ActivityProperty.collectInfo.holdTillVar = "";
    } else {
      temp.ActivityProperty.collectInfo.holdTillVar = val.VariableName;
      temp.ActivityProperty.collectInfo.collNoOfIns = "";
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.collect]: { isModified: true, hasError: false },
      })
    );
  };

  // code edited on 12 August 2022 for BugId 114242
  const validateCollectInfo = (type) => {
    let hasError = false;
    if (
      localLoadedActivityPropertyData?.ActivityProperty?.collectInfo
        ?.assocActId === ""
    ) {
      if (type === "SAVE_CLICKED") {
        setdistributeError(true);
      }
      hasError = true;
    }
    if (
      localLoadedActivityPropertyData?.ActivityProperty?.collectInfo
        ?.collNoOfIns === "" &&
      localLoadedActivityPropertyData?.ActivityProperty?.collectInfo
        ?.holdTillVar === "" &&
      localLoadedActivityPropertyData?.ActivityProperty?.collectInfo
        ?.exOnPrimaryFlag !== "A" &&
      !isParallelCollect
    ) {
      if (type === "SAVE_CLICKED") {
        setcomboBoxError(true);
      }
      hasError = true;
    }
    if (
      localLoadedActivityPropertyData?.ActivityProperty?.collectInfo
        ?.exOnPrimaryFlag !== "C" &&
      localLoadedActivityPropertyData?.ActivityProperty?.collectInfo
        ?.primaryAct === "" &&
      !isParallelCollect
    ) {
      if (type === "SAVE_CLICKED") {
        setprimaryError(true);
      }
      hasError = true;
    }
    if (hasError) {
      dispatch(
        setActivityPropertyChange({
          [propertiesLabel.collect]: { isModified: true, hasError: true },
        })
      );
    }
  };

  useEffect(() => {
    // code edited on 12 August 2022 for BugId 114242
    if (
      localLoadedActivityPropertyData?.ActivityProperty?.collectInfo &&
      allTabStatus[propertiesLabel.collect].isModified
    ) {
      validateCollectInfo("GENERAL");
    }
  }, [localLoadedActivityPropertyData?.ActivityProperty?.collectInfo]);

  return (
    <div className={classes.mainDiv}>
    <TabsHeading heading={props?.heading} />
      <div
        className={classes.mainContent}
        style={{ flexDirection: props.isDrawerExpanded ? "row" : "column" }}
      >
        <div
          className={classes.firstContentBox}
          style={{ width: props.isDrawerExpanded ? "50%" : "100%" }}
        >
          {!isParallelCollect ? (
            <div style={{ marginBlock: "0.4rem" }}>
              <p
                style={{
                  color: "#727272",
                  fontWeight: "600",
                  marginBottom: "0.2rem",
                  fontSize:'1rem'
                }}
              >
                {t("primaryWorkstep")}
              </p>
              <Select
                disabled={
                  isDisableTab ||
                  localLoadedActivityPropertyData?.ActivityProperty.collectInfo
                    ?.exOnPrimaryFlag === "C"
                }
                IconComponent={ExpandMoreIcon}
                style={{
                  width: props.isDrawerExpanded ? "50%" : "95%",
                  height: "2rem",
                  opacity:
                    localLoadedActivityPropertyData?.ActivityProperty
                      ?.collectInfo?.exOnPrimaryFlag === "i"
                      ? "0.5"
                      : "1",
                }}
                variant="outlined"
                value={
                  localLoadedActivityPropertyData?.ActivityProperty?.collectInfo
                    ?.primaryAct
                }
                onChange={collectChangeHandler}
                name="primaryDistributeDropdown"
              >
                {PrimaryActivityList.map((item) => {
                  return (
                    <MenuItem
                      style={{ width: "100%", marginBlock: "0.2rem" }}
                      value={item.ActivityName}
                      onClick={() => getSelectedActivity(item)}
                    >
                      <p
                        style={{
                          marginInline: "0.4rem",
                          font: "0.8rem Open Sans",
                        }}
                      >
                        {item.ActivityName}
                      </p>
                    </MenuItem>
                  );
                })}
              </Select>
              {primaryError ? (
                <p style={{ fontSize: "12px", color: "red" }}>
                  Please select Primary workstep
                </p>
              ) : null}
            </div>
          ) : null}

          <div style={{ marginBlock: "0.4rem" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginBottom: "0.2rem",
              }}
            >
              <p
                style={{
                  color: "#727272",
                  fontWeight: "600",
                  fontSize:'1rem'
                }}
              >
                {t("distributeWorkStep")}
              </p>
              <StarRateSharpIcon
                style={{
                  color: "red",
                  padding: "0.35rem",
                  marginLeft: "-0.375rem",
                  marginTop: "-0.1875rem",
                }}
              />
            </div>

            {!isParallelCollect ? (
              <>
                <Select
                  disabled={isDisableTab}
                  IconComponent={ExpandMoreIcon}
                  style={{
                    width: props.isDrawerExpanded ? "50%" : "95%",
                    height: "2rem",
                  }}
                  variant="outlined"
                  value={
                    +localLoadedActivityPropertyData?.ActivityProperty
                      ?.collectInfo?.assocActId
                  }
                  onChange={collectChangeHandler}
                  name="DistributeWorkstepDropdown"
                >
                  {inclusiveDistributeActivitiesList?.map((item) => {
                    return (
                      <MenuItem
                        style={{ width: "100%", marginBlock: "0.2rem" }}
                        value={item.ActivityId}
                        onClick={() => getSelectedActivity(item)}
                      >
                        <p
                          style={{
                            font: "0.8rem Open Sans",
                          }}
                        >
                          {item.ActivityName}
                        </p>
                      </MenuItem>
                    );
                  })}
                </Select>
              </>
            ) : (
              <>
                <Select
                  disabled={isDisableTab}
                  IconComponent={ExpandMoreIcon}
                  style={{
                    width: props.isDrawerExpanded ? "50%" : "95%",
                    height: "2rem",
                  }}
                  variant="outlined"
                  value={
                    +localLoadedActivityPropertyData?.ActivityProperty
                      ?.collectInfo?.assocActId
                  }
                  onChange={collectChangeHandler}
                  name="DistributeWorkstepDropdown"
                >
                  {parallelDistributeActivitiesList?.map((item) => {
                    return (
                      <MenuItem
                        style={{ width: "100%", marginBlock: "0.2rem" }}
                        value={+item.ActivityId}
                        onClick={() => getSelectedActivity(item)}
                      >
                        <p
                          style={{
                            font: "0.8rem Open Sans",
                          }}
                        >
                          {item.ActivityName}
                        </p>
                      </MenuItem>
                    );
                  })}
                </Select>
              </>
            )}

            {distributeError ? (
              <p style={{ fontSize: "12px", color: "red" }}>
                Please select Distribute workstep
              </p>
            ) : null}
          </div>

          {!isParallelCollect ? (
            <div
              style={{
                marginBlock: "0.4rem",
                display: "flex",
                flexDirection: "row",
                alignItems:'center'
              }}
            >
              <Checkbox
                style={{ marginLeft: "-0.625rem" }}
                disabled={isDisableTab}
                checked={
                  localLoadedActivityPropertyData?.ActivityProperty.collectInfo
                    ?.deleteOnCollect === "Y"
                    ? true
                    : false
                }
                size="small"
                onChange={collectChangeHandler}
                name="deleteCheckbox"
              />
              <p
                style={{
                  color: "#727272",
                  fontWeight: "600",
                  fontSize:'1rem'
                }}
              >
                {t("deleteOnCount")}
              </p>
            </div>
          ) : null}
        </div>
        <hr
          style={{
            width: props.isDrawerExpanded ? "0" : "100%",
            height: props.isDrawerExpanded ? "100vh" : "0",
          }}
        />
        <div
          className={classes.firstContentBox}
          style={{ width: props.isDrawerExpanded ? "50%" : "100%" }}
        >
          <p
            style={{
              color: "#727272",
              fontWeight: "600",
              paddingTop: "0.5rem",
              fontSize:'1rem'
            }}
          >
            {t("collectionCriteria")}
          </p>
          <RadioGroup
            name="radioGroup"
            value={
              isParallelCollect
                ? "C"
                : localLoadedActivityPropertyData?.ActivityProperty?.collectInfo
                    ?.exOnPrimaryFlag + ""
            } //code edited on 12 August 2022 for BugId 114242
            onChange={collectChangeHandler}
          >
            {!isParallelCollect ? (
              <FormControlLabel
                classes={{
                  label: classes.radioButton,
                }}
                value="A"
                control={<Radio size="small" style={{color:'var(--radio_color)'}}/>}
                label={t("waitPrimary")}
              />
            ) : null}

            {!isParallelCollect ? (
              <FormControlLabel
                classes={{
                  label: classes.radioButton,
                }}
                value="F"
                control={<Radio size="small" style={{color:'var(--radio_color)'}}/>}
                label={t("waitPrimaryAndInstances")}
              />
            ) : null}

            <FormControlLabel
              classes={{
                label: classes.radioButton,
              }}
              disabled={isParallelCollect}
              value="C"
              control={<Radio size="small" style={{color:'var(--radio_color)'}}/>}
              label={t("waitInstances")}
            />
          </RadioGroup>

          {localLoadedActivityPropertyData?.ActivityProperty.collectInfo
            ?.exOnPrimaryFlag === "C" ||
          localLoadedActivityPropertyData?.ActivityProperty.collectInfo
            ?.exOnPrimaryFlag === "F" ? (
            <div style={{ marginTop: "0.6rem" }}>
              <p
                style={{
                  color: "#727272",
                  fontWeight: "600",
                }}
              >
                {t("NoOfInstances")}
              </p>
              <SelectWithInput
                dropdownOptions={intVariables}
                optionKey="VariableName"
                setIsConstant={(val) => setisConstantFlag(val)}
                setValue={(val) => handleComboBoxValue(val)}
                value={
                  localLoadedActivityPropertyData?.ActivityProperty.collectInfo
                    .holdTillVar === ""
                    ? localLoadedActivityPropertyData?.ActivityProperty
                        .collectInfo.collNoOfIns
                    : localLoadedActivityPropertyData?.ActivityProperty
                        .collectInfo.holdTillVar
                }
                isConstant={isConstantFlag}
                showEmptyString={false}
                showConstValue={true}
                id="from_select_input"
              />
              {/* code edited on 12 August 2022 for BugId 114242*/}
              {comboBoxError ? (
                <p style={{ fontSize: "12px", color: "red" }}>
                  Please specify value for no. of Instances
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(mapStateToProps, null)(Collect);
