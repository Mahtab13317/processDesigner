import React, { useState, useEffect } from "react";
import { store, useGlobalState } from "state-pool";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import "./index.css";
import Tabs from "../../../../UI/Tab/Tab.js";
import Todo from "./MobileTab/Todo";
import Exception from "./MobileTab/Exception";
import Document from "./MobileTab/Document";
import Variable from "./MobileTab/Variable";
import styles from "./MobileTab/index.module.css";
import arabicStyles from "./MobileTab/ArabicStyles.module.css";
import {
  propertiesLabel,
  RTL_DIRECTION,
} from "../../../../Constants/appConstants";
import { useDispatch } from "react-redux";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { Checkbox } from "@material-ui/core";

function Mobile(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [checkMobile, setCheckMobile] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setCheckMobile(
      localLoadedActivityPropertyData?.ActivityProperty?.wdeskInfo
        ?.objPMWdeskPDA?.m_bchkBoxChecked
    );
  }, [localLoadedActivityPropertyData]);

  const CheckMobileHandler = () => {
    let val;
    setCheckMobile((prev) => {
      val = !prev;
      return !prev;
    });
    let temp = { ...localLoadedActivityPropertyData };
    if (temp?.ActivityProperty?.wdeskInfo) {
      if (temp?.ActivityProperty?.wdeskInfo?.objPMWdeskPDA) {
        let valTemp =
          temp?.ActivityProperty?.wdeskInfo?.objPMWdeskPDA?.m_bchkBoxChecked;
        if (valTemp === false || valTemp === true) {
          temp.ActivityProperty.wdeskInfo.objPMWdeskPDA.m_bchkBoxChecked = val;
        } else {
          temp.ActivityProperty.wdeskInfo.objPMWdeskPDA = {
            ...temp.ActivityProperty.wdeskInfo.objPMWdeskPDA,
            m_bchkBoxChecked: val,
          };
        }
      } else {
        temp.ActivityProperty.wdeskInfo = {
          ...temp.ActivityProperty.wdeskInfo,
          objPMWdeskPDA: {
            m_bchkBoxChecked: val,
          },
        };
      }
    } else {
      temp.ActivityProperty = {
        ...temp.ActivityProperty,
        wdeskInfo: {
          objPMWdeskPDA: {
            m_bchkBoxChecked: val,
          },
        },
      };
    }
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.workdesk]: { isModified: true, hasError: false },
      })
    );
  };

  return (
    <div className={styles.flexColumn}>
      <div className={styles.checklist}>
        <Checkbox
          checked={checkMobile}
          onChange={() => CheckMobileHandler()}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.mainCheckbox
              : styles.mainCheckbox
          }
          data-testid="CheckMobile"
          type="checkbox"
        />
        {t("mobile")}
      </div>
      {checkMobile ? (
        <div className={styles.mobileTabDiv}>
          <Tabs
            tabType="processSubTab"
            tabContentStyle="processSubTabContentStyle"
            tabBarStyle="processSubTabBarStyle"
            oneTabStyle="processSubOneTabStyle"
            tabStyling="processViewTabs"
            tabsStyle="processViewSubTabs"
            TabNames={[
              t("todo"),
              t("exception(s)"),
              t("document"),
              t("variable"),
            ]}
            TabElement={[<Todo />, <Exception />, <Document />, <Variable />]}
          />
        </div>
      ) : null}
    </div>
  );
}

export default Mobile;
