import React, { useEffect, useState } from "react";
import styles from "./rights.module.css";
import arabicStyles from "./rightArabic.module.css";
import SearchComponent from "../../../UI/Search Component/index";

import "./index.css";
import { Checkbox, FormControl, FormControlLabel, Switch, FormGroup, Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { connect, useDispatch, useSelector } from "react-redux";
import { getActivityProps } from "../../../utility/abstarctView/getActivityProps";
import { store, useGlobalState } from "state-pool";


function DataRights() {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  let dispatch = useDispatch();
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);

  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);


  const [variables, setVariables] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {

    let temp = []
    localLoadedProcessData?.Variable.filter(d => d.VariableScope === "U" || d.VariableScope === "I").map((data, i) => {
      temp.push({
        id: data.VariableId,
        name: data.VariableName
      })
    });
    console.log("mahtab variables", temp)



    setVariables(temp);

    console.log("mahtab milestones", localLoadedProcessData?.MileStones);

    let arr = [];

    localLoadedProcessData?.MileStones.map((mileStone) => {
      mileStone.Activities.map((activity, index) => {
        arr.push({ id: activity.ActivityId, actName: activity.ActivityName });
      });
    });



    setActivities(arr);
  }, []);

  const getList = () => {
    //alert("sfdsf")
  };

  return (
    <>
      <div className={styles.flexContainer}>
        <div className={styles.leftPanel}>
          <div className={styles.leftHeadSection}>
            <div className={styles.variableHead}>
              <div >
                <h4 className={styles.heading}>{t("toolbox.dataRights.variables")}</h4>
              </div>
              <div className={styles.showCount}>
                {"<"} {t("toolbox.dataRights.showing")} 1-50 of 500 {">"}
              </div>
            </div>
            <div className={styles.row}>
              <span className={styles.searchBar}>
                <SearchComponent onSearchChange={getList} />
              </span>
            </div>
          </div>
          <div className={styles.variableSection}>
            {variables.map((data, i) => (
              <div className={styles.varibleList}>
                <p className={styles.varTitle}>{data.name}</p>
                <p className={styles.checkGroup}><FormGroup row>

                  <FormControlLabel className={styles.rightsCheck} control={<Checkbox defaultChecked />} label="Read" />
                  <FormControlLabel className={styles.rightsCheck} control={<Checkbox />} label="Modify" />
                </FormGroup></p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.rightHeadSection}>
            <div className={styles.rightsHead}>
              <div style={{flexGrow:"4"}}>
                <h4 className={styles.heading}>{t("toolbox.dataRights.rightsAct")}</h4>
              </div>
              <div className={styles.showCountRight}> {"<"} {t("toolbox.dataRights.showing")}  1-50 of 500 {">"}</div>
              <div className={styles.searchBar}><SearchComponent onSearchChange={getList} /></div>
              <div className="switch">
                <FormControl>
                  <FormControlLabel

                    control={<Switch className={styles.switchToggle} color="primary" size="small" />}
                    label="Compact"
                    labelPlacement="start"


                  />


                </FormControl>

              </div>
            </div>


            <div style={{ marginTop: "0.5rem" }}>
              <div style={{ padding: "0.25rem", height: "2.5rem" }}>
                <div className={styles.rightsTableHead}>

                  {
                    activities.map((data, i) => (
                      <div className={styles.item}> <FormControlLabel className={styles.rightsCheck} control={<Checkbox defaultChecked />} /><span className={styles.actTitle}>{data.actName}</span></div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
          <div className={styles.variableSection}>
            {variables.map((data, i) => (
              <div className={styles.varibleList}>
                <div className={styles.rightsTableHead}>
                  {
                    activities.map((data, i) => (
                      <div className={styles.item}>
                        <FormGroup row>

                          <FormControlLabel className={styles.rightsCheck} control={<Checkbox defaultChecked />} label="Read" />
                          <FormControlLabel className={styles.rightsCheck} control={<Checkbox />} label="Modify" />
                        </FormGroup>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>


        </div>
        <div className={styles.footer}>
          <div className={styles.btnList}>

            <Button
              id="cancel"
              color="primary"
              variant="outlined"
              size="small"

            >
              {t("toolbox.dataRights.discard")}
            </Button>
            <Button
              id="save"
              className="btnSave"
              variant="contained"
              size="small"

            >
              {t("toolbox.dataRights.save")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DataRights;
