import React, { useState, useEffect } from "react";
import cx from "classnames";
import NavigationPanel from "../NavigationPanel/NavigationPanel";
import ProcessesView from "./ProcessesView/ProcessesView";
import {
  iconsForMainView,
  defaultSelectedForMainView,
} from "../../utility/navigationPanel";
import { connect, useDispatch, useSelector } from "react-redux";
import CreateProcessByTemplate from "./Create/CreateProcessByTemplate";
import {
  CREATE_PROCESS_FLAG_FROM_PROCESS,
  CREATE_PROCESS_FLAG_FROM_PROCESSES,
  SERVER_URL,
  ENDPOINT_GET_USER_RIGHTS,
} from "../../Constants/appConstants";
import { store, useGlobalState } from "state-pool";
import * as actionCreators from "../../redux-store/actions/processView/actions.js";
import { useHistory } from "react-router-dom";
import { setUserRightsDataFunc } from "../../redux-store/slices/UserRightsSlice";
import { userRightsData } from "./UserRightsData";
import axios from "axios";
import { projectCreationVal } from "../../redux-store/slices/projectCreationSlice";

const MainView = (props) => {
  const dispatch = useDispatch();
  const [selectedNavigationPanel, setSelectedNavigationPanel] = useState(
    defaultSelectedForMainView
  );
  const projectCreatedVal = useSelector(projectCreationVal);
  let history = useHistory();
  const inMemoryDB = store.getState("inMemoryDB");
  const [localinMemoryDB, setlocalinMemoryDB] = useGlobalState(inMemoryDB);

  // Function that runs when the component loads.
  useEffect(() => {
    // axios.get(SERVER_URL + ENDPOINT_GET_USER_RIGHTS).then((res) => {
    //   if (res?.status === 200) {
    //     dispatch(
    //       setUserRightsDataFunc({
    //         localProjRightsList: userRightsData?.localProjRightsList,
    //         menuRightsList: getMenuRightsList(userRightsData?.menuRightsList),
    //         regProjRightsList: userRightsData?.regProjRightsList,
    //       })
    //     );
    //   }
    // });
    dispatch(
      setUserRightsDataFunc({
        localProjRightsList: userRightsData?.localProjRightsList,
        menuRightsList: getMenuRightsList(userRightsData?.menuRightsList),
        regProjRightsList: userRightsData?.regProjRightsList,
      })
    );
  }, []);

  //code edited on 28 July 2022 for BugId 111769
  useEffect(() => {
    if (projectCreatedVal.projectCreated) {
      setSelectedNavigationPanel("navigationPanel.processes");
    }
  }, [projectCreatedVal.projectCreated]);

  // Function that returns an array of menu rights along with a show boolean.
  const getMenuRightsList = (menuRightsList) => {
    let tempArr = [];
    menuRightsList?.forEach((element) => {
      const show = getDisplayBoolean(element.display);
      const tempObj = {
        ...element,
        show: show,
      };
      tempArr.push(tempObj);
    });
    return tempArr;
  };

  // Function that returns a boolean value based on the flag passed as argument.
  const getDisplayBoolean = (flag) => {
    return flag === "Y" ? true : false;
  };

  useEffect(() => {
    if (localinMemoryDB !== null) {
      if (localinMemoryDB.value.option === "LIST") {
        setSelectedNavigationPanel("navigationPanel.processes");
      } else if (localinMemoryDB.value.option === "CREATE") {
        props.CreateProcessClickFlag(1);
      } else if (localinMemoryDB.value.option === "OPEN") {
        const { id, name, parent, mode, version } = localinMemoryDB.value.data;
        props.openProcessClick(
          id,
          parent,
          mode,
          Number.parseFloat(version).toPrecision(2) + "",
          name
        );
        history.push("/process");
      } else setSelectedNavigationPanel(defaultSelectedForMainView);
      setlocalinMemoryDB(null);
    }
  }, [localinMemoryDB, localinMemoryDB?.value, props]);

  return (
    <React.Fragment>
      {props.CreateProcessFlag === CREATE_PROCESS_FLAG_FROM_PROCESS ||
      props.CreateProcessFlag === CREATE_PROCESS_FLAG_FROM_PROCESSES ? (
        <CreateProcessByTemplate bCreateFromScratchBtn={true} bCancel={true} />
      ) : (
        <div className="flex h100">
          <NavigationPanel
            setSelection={(navigation) => {
              setSelectedNavigationPanel(navigation);
            }}
            selectedNavigation={selectedNavigationPanel}
            parentContainer={props.mainContainer}
            icons={iconsForMainView}
          />
          <div className={cx("pmviewingArea")}>
            <ProcessesView selectedNavigation={selectedNavigationPanel} />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    openProcessClick: (id, name, type, version, processName) =>
      dispatch(
        actionCreators.openProcessClick(id, name, type, version, processName)
      ),
    CreateProcessClickFlag: (flag) =>
      dispatch(actionCreators.createProcessFlag(flag)),
  };
};

const mapStateToProps = (state) => {
  return {
    CreateProcessFlag: state.createProcessFlag.clickedCreateProcess,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
