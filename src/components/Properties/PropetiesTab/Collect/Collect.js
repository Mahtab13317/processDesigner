import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import classes from "./Collect.module.css";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import StarRateSharpIcon from "@material-ui/icons/StarRateSharp";
import SelectWithInput from "../../../../UI/SelectWithInput/index.js";
import { useGlobalState, store } from "state-pool";
import { PROCESSTYPE_LOCAL } from "../../../../Constants/appConstants.js";
import MenuItem from "@material-ui/core/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import { OpenProcessSliceValue } from "../../../../redux-store/slices/OpenProcessSlice";

function Collect(props) {
  let { t } = useTranslation();
  const [isDisabled, setisDisabled] = useState(false);
  // const [Collect?.ExpireOnPrimaryFlag, setCollect?.ExpireOnPrimaryFlag] =
  //   React.useState("C");
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedProcessData] = useGlobalState("loadedProcessData");
  const [localVariableDefinition] = useGlobalState("variableDefinition");
  const openProcessData = useSelector(OpenProcessSliceValue);

  const [isDisableTab, setisDisableTab] = useState(false);

  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
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

  const dispatch = useDispatch();
  const [primaryError, setprimaryError] = useState(false);
  const [distributeError, setdistributeError] = useState(false);
  const [comboBoxError, setcomboBoxError] = useState(false);

  //check if activity is parallel or inclusive collect
  useEffect(() => {
    function checkParallelCollectActivity() {
      if (
        localLoadedActivityPropertyData.ActivityProperty.ActivityType === 6 &&
        localLoadedActivityPropertyData.ActivityProperty.ActivitySubType === 2
      )
        setisParallelCollect(true);
      else setisParallelCollect(false);
    }
    checkParallelCollectActivity();
  }, [
    isParallelCollect,
    localLoadedActivityPropertyData.ActivityProperty.ActivitySubType,
    localLoadedActivityPropertyData.ActivityProperty.ActivityType,
  ]);

  //create distributeworkstep dropdown
  useEffect(() => {
    openProcessData.loadedData?.MileStones.forEach((mileStone) => {
      mileStone.Activities.forEach((activity, index) => {
        if (!isParallelCollect) {
          if (activity.ActivityType === 5 && activity.ActivitySubType === 1) {
            setInclusiveDistributeActivitiesList((prevState) => [
              ...prevState,
              activity,
            ]);
          }
        } else if (isParallelCollect) {
          if (activity.ActivityType === 5 && activity.ActivitySubType === 2) {
            setparallelDistributeActivitiesList((prevState) => [
              ...prevState,
              activity,
            ]);
          }
        }
      });
    });
  }, [isParallelCollect, openProcessData.loadedData]);

  //create primaryworkstep dropdown
  useEffect(() => {
    function createPrimaryWorkstepActivityList() {
      openProcessData.loadedData?.MileStones.forEach((mileStone) => {
        mileStone.Activities.forEach((activity, index) => {
          if (activity["Target WorkStep"][0] == props.cellName) {
            setPrimaryActivityList((prevState) => [...prevState, activity]);
          }
        });
      });
    }
    createPrimaryWorkstepActivityList();
  }, [openProcessData.loadedData]);

  useEffect(() => {
    if (localLoadedProcessData.ProcessType !== PROCESSTYPE_LOCAL)
      setisDisableTab(true);
  }, [localLoadedProcessData.ProcessType]);

  useEffect(() => {
    localVariableDefinition.forEach((item) => {
      if (item.VariableType === "3") {
        setintVariables((prevState) => [...prevState, item]);
      }
    });
  }, []);

  const getSelectedActivity = (data) => {};

  // const PrimaryActivityList = [{ ActivityId: 8, ActivityName: "WorkDesk_10" }];

  const [
    selectedDistributeWorkstepActivity,
    setselectedDistributeWorkstepActivity,
  ] = useState();

  useEffect(() => {
    const getActivityDataFromId = (id) => {
      inclusiveDistributeActivitiesList.forEach((item) => {
        if (item.ActivityId == id) setselectedDistributeWorkstepActivity(item);
      });
    };

    getActivityDataFromId(
      +localLoadedActivityPropertyData?.ActivityProperty.collectInfo?.assocActId
    );
  }, [inclusiveDistributeActivitiesList]);

  const collectChangeHandler = (e) => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));

    if (e.target.name === "primaryDistributeDropdown") {
      temp.ActivityProperty.collectInfo.primaryAct = e.target.value;
    } else if (e.target.name === "DistributeWorkstepDropdown") {
      temp.ActivityProperty.collectInfo.assocActId = e.target.value + "";
      // temp.ActivityProperty.collectInfo["assocActivityId"] =
      //   e.target.value + "";
    } else if (e.target.name === "deleteCheckbox") {
      temp.ActivityProperty.collectInfo.deleteOnCollect = e.target.checked
        ? "Y"
        : "N";
    } else if (e.target.name === "radioGroup") {
      temp.ActivityProperty.collectInfo.exOnPrimaryFlag = e.target.value;
    }
    dispatch(
      setActivityPropertyChange({
        Collect: { isModified: true, hasError: false },
      })
    );
    setlocalLoadedActivityPropertyData(temp);
  };

  useEffect(() => {
    if (
      localLoadedActivityPropertyData?.ActivityProperty.collectInfo
        .exOnPrimaryFlag !== "C" &&
      localLoadedActivityPropertyData?.ActivityProperty.collectInfo
        .primaryAct === ""
    ) {
      setprimaryError(true);
    } else setprimaryError(false);
  }, [
    localLoadedActivityPropertyData?.ActivityProperty.collectInfo
      .exOnPrimaryFlag,
    localLoadedActivityPropertyData?.ActivityProperty.collectInfo.primaryAct,
  ]);

  useEffect(() => {
    if (
      localLoadedActivityPropertyData?.ActivityProperty.collectInfo
        .assocActId === ""
    ) {
      setdistributeError(true);
    } else setdistributeError(false);
  }, [
    localLoadedActivityPropertyData?.ActivityProperty.collectInfo.assocActId,
  ]);
  useEffect(() => {
    if (
      localLoadedActivityPropertyData?.ActivityProperty.collectInfo
        .collNoOfIns === "" &&
      localLoadedActivityPropertyData?.ActivityProperty.collectInfo
        .holdTillVar === "" &&
      localLoadedActivityPropertyData?.ActivityProperty.collectInfo
        .exOnPrimaryFlag !== "A"
    ) {
      setcomboBoxError(true);
    } else setcomboBoxError(false);
  }, [
    localLoadedActivityPropertyData?.ActivityProperty.collectInfo.collNoOfIns,
    localLoadedActivityPropertyData?.ActivityProperty.collectInfo.holdTillVar,
    localLoadedActivityPropertyData?.ActivityProperty.collectInfo
      .exOnPrimaryFlag,
  ]);

  const handleComboBoxValue = (val) => {
    let temp = JSON.parse(JSON.stringify(localLoadedActivityPropertyData));
    if (!isNaN(val)) {
      temp.ActivityProperty.collectInfo.collNoOfIns = val;
      temp.ActivityProperty.collectInfo.holdTillVar = "";
    } else {
      temp.ActivityProperty.collectInfo.holdTillVar = val.VariableName;
      temp.ActivityProperty.collectInfo.collNoOfIns = "";
    }
    dispatch(
      setActivityPropertyChange({
        Collect: { isModified: true, hasError: false },
      })
    );
    setlocalLoadedActivityPropertyData(temp);
  };

  useEffect(() => {
    if (distributeError || comboBoxError || primaryError) {
      dispatch(
        setActivityPropertyChange({
          Collect: { isModified: true, hasError: true },
        })
      );
    } else {
      dispatch(
        setActivityPropertyChange({
          Collect: { isModified: true, hasError: false },
        })
      );
    }
  }, [comboBoxError, distributeError, primaryError]);

  return (
    <div className={classes.mainDiv}>
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
                }}
              >
                {t("primaryWorkstep")}
              </p>
              <Select
                disabled={
                  isDisabled ||
                  localLoadedActivityPropertyData?.ActivityProperty.collectInfo
                    ?.exOnPrimaryFlag === "C"
                }
                IconComponent={ExpandMoreIcon}
                style={{
                  width: props.isDrawerExpanded ? "50%" : "95%",
                  height: "2rem",
                  opacity:
                    localLoadedActivityPropertyData?.ActivityProperty
                      .collectInfo?.exOnPrimaryFlag === "i"
                      ? "0.5"
                      : "1",
                }}
                variant="outlined"
                value={
                  localLoadedActivityPropertyData?.ActivityProperty.collectInfo
                    .primaryAct
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
                  disabled={isDisabled}
                  IconComponent={ExpandMoreIcon}
                  style={{
                    width: props.isDrawerExpanded ? "50%" : "95%",
                    height: "2rem",
                  }}
                  variant="outlined"
                  value={parseInt(
                    localLoadedActivityPropertyData?.ActivityProperty
                      .collectInfo.assocActId
                  )}
                  onChange={collectChangeHandler}
                  name="DistributeWorkstepDropdown"
                >
                  {inclusiveDistributeActivitiesList.map((item) => {
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
                  disabled={isDisabled}
                  IconComponent={ExpandMoreIcon}
                  style={{
                    width: props.isDrawerExpanded ? "50%" : "95%",
                    height: "2rem",
                  }}
                  variant="outlined"
                  value={parseInt(
                    localLoadedActivityPropertyData?.ActivityProperty
                      .collectInfo?.assocActId
                  )}
                  onChange={collectChangeHandler}
                  name="DistributeWorkstepDropdown"
                >
                  {parallelDistributeActivitiesList.map((item) => {
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
              }}
            >
              <Checkbox
                style={{ marginLeft: "-0.625rem" }}
                disabled={isDisabled}
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
                  paddingTop: "0.5rem",
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
            }}
          >
            {t("collectionCriteria")}
          </p>
          <RadioGroup
            name="radioGroup"
            value={
              localLoadedActivityPropertyData?.ActivityProperty.collectInfo
                ?.exOnPrimaryFlag + ""
            }
            onChange={collectChangeHandler}
          >
            {!isParallelCollect ? (
              <FormControlLabel
                classes={{
                  label: classes.radioButton,
                }}
                value="A"
                control={<Radio size="small" />}
                label={t("waitPrimary")}
              />
            ) : null}

            {!isParallelCollect ? (
              <FormControlLabel
                classes={{
                  label: classes.radioButton,
                }}
                value="F"
                control={<Radio size="small" />}
                label={t("waitPrimaryAndInstances")}
              />
            ) : null}
            <FormControlLabel
              classes={{
                label: classes.radioButton,
              }}
              disabled={isParallelCollect}
              value="C"
              control={<Radio size="small" />}
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
            </div>
          ) : null}
          {comboBoxError ? (
            <p style={{ fontSize: "12px", color: "red" }}>
              Please specify value for no. of Instances
            </p>
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
