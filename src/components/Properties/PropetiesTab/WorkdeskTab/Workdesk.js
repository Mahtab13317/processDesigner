import React, { useState, useEffect } from "react";
import { store, useGlobalState } from "state-pool";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import "./index.css";
import axios from "axios";
import Tabs from "../../../../UI/Tab/Tab.js";
import Todo from "./Todo";
import Action from "./Action";
import Exception from "./Exception";
import Document from "./Document";
import Scan from "./Scan";
import {
  ENDPOINT_GET_PROCESS_FEATURES,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import Mobile from "./Mobile";
import Others from "./Others";
import Sap from "./Sap";

function Workdesk(props) {
  let { t } = useTranslation();
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [bmobile, setbmobile] = useState(false);

  useEffect(() => {
    axios
      .get(
        SERVER_URL +
          `${ENDPOINT_GET_PROCESS_FEATURES}/${props.openProcessID}/${props.openProcessType}/S`
      )
      .then((res) => {
        if (res.status === 200) {
          let mobileSelected = res.data.GlobalInterfaceData.filter((d) => {
            if (d.ClientInvocation == "Mobile") {
              return d.Included;
            }
          });

          setbmobile(mobileSelected[0]);
        }
      });
  }, []);

  return (
    <React.Fragment>
      <Tabs
        tabType="processSubTab"
        tabContentStyle="processSubTabContentStyle"
        tabBarStyle="processSubTabBarStyle"
        oneTabStyle="processSubOneTabStyle"
        tabStyling="processViewTabs"
        tabsStyle="processViewSubTabs"
        TabNames={
          localLoadedActivityPropertyData.ActivityProperty.actType == 11 &&
          localLoadedActivityPropertyData.ActivityProperty.actSubType == 1 //query
            ? [
                t("todo"),
                t("exception(s)"),
                t("document"),
                t("scan"),
                t("mobile"),
              ]
            : localLoadedActivityPropertyData.ActivityProperty.actType == 4 &&
              localLoadedActivityPropertyData.ActivityProperty.actSubType == 1 //timer
            ? [t("document"), t("scan")]
            : localLoadedActivityPropertyData.ActivityProperty.actType == 2 &&
              localLoadedActivityPropertyData.ActivityProperty.actSubType == 1 //endevent
            ? [t("todo"), t("exception(s)"), t("document")]
            : localLoadedActivityPropertyData.ActivityProperty.actType == 3 &&
              localLoadedActivityPropertyData.ActivityProperty.actSubType == 1 // terminate
            ? [t("todo"), t("exception(s)"), t("document")]
            : localLoadedActivityPropertyData.ActivityProperty.actType == 2 &&
              localLoadedActivityPropertyData.ActivityProperty.actSubType == 2 // mesageEnd
            ? [t("todo"), t("exception(s)"), t("document")]
            : localLoadedProcessData?.SAPRequired
            ? [
                t("todo"),
                t("actions"),
                t("exception(s)"),
                t("document"),
                t("scan"),
                t("mobile"),
                t("others"),
                t("SAP"),
              ]
            : [
                t("todo"),
                t("actions"),
                t("exception(s)"),
                t("document"),
                t("scan"),
                t("mobile"),
                t("others"),
              ]
        }
        TabElement={
          localLoadedActivityPropertyData.ActivityProperty.actType == 11 &&
          localLoadedActivityPropertyData.ActivityProperty.actSubType == 1 //query
            ? [<Todo />, <Exception />, <Document />, <Scan />, <Mobile />]
            : localLoadedActivityPropertyData.ActivityProperty.actType == 4 &&
              localLoadedActivityPropertyData.ActivityProperty.actSubType == 1 //timer
            ? [<Document />, <Scan />]
            : localLoadedActivityPropertyData.ActivityProperty.actType == 2 &&
              localLoadedActivityPropertyData.ActivityProperty.actSubType == 1 //endevent
            ? [<Todo />, <Exception />, <Document />]
            : localLoadedActivityPropertyData.ActivityProperty.actType == 3 &&
              localLoadedActivityPropertyData.ActivityProperty.actSubType == 1 // terminate
            ? [<Todo />, <Exception />, <Document />]
            : localLoadedActivityPropertyData.ActivityProperty.actType == 2 &&
              localLoadedActivityPropertyData.ActivityProperty.actSubType == 2 // mesageEnd
            ? [<Todo />, <Exception />, <Document />]
            : [
                <Todo />,
                <Action />,
                <Exception />,
                <Document />,
                <Scan />,
                <Mobile />,
                <Others />,
                <Sap />,
              ]
        }
      />
    </React.Fragment>
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
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(mapStateToProps, null)(Workdesk);
