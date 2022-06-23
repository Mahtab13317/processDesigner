import React, { useState } from "react";
import cx from "classnames";
import NavigationPanel from "../NavigationPanel/NavigationPanel";
import ProcessesView from "./ProcessesView/ProcessesView";
import {
  iconsForMainView,
  defaultSelectedForMainView,
} from "../../utility/navigationPanel";
import { connect } from "react-redux";
import CreateProcessByTemplate from "./Create/CreateProcessByTemplate";
import {
  CREATE_PROCESS_FLAG_FROM_PROCESS,
  CREATE_PROCESS_FLAG_FROM_PROCESSES,
  SERVER_URL,
} from "../../Constants/appConstants";
import { store, useGlobalState } from "state-pool";
import axios from "axios";
import * as actionCreators from "../../redux-store/actions/processView/actions.js";
import { useHistory } from "react-router-dom";

const MainView = (props) => {
  const [selectedNavigationPanel, setSelectedNavigationPanel] = useState(
    defaultSelectedForMainView
  );
  let history = useHistory();

  const inMemoryDB = store.getState("inMemoryDB");
  const [localinMemoryDB, setlocalinMemoryDB] = useGlobalState(inMemoryDB);
  const [counter, setCounter] = useState(true);

  React.useEffect(() => {
    // if (counter) {
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
    // props.openProcessClick("11808", null, "L", "1.0", "wwe");
    // history.push("/process");
    // } else return;
  }, [counter, localinMemoryDB, localinMemoryDB?.value, props]);

  return (
    <React.Fragment>
      {props.CreateProcessFlag === CREATE_PROCESS_FLAG_FROM_PROCESS ||
      props.CreateProcessFlag === CREATE_PROCESS_FLAG_FROM_PROCESSES ? (
        <CreateProcessByTemplate bCreateFromScratchBtn={true} bCancel={true} />
      ) : (
        <div className="flex">
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
