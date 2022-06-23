import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Radium from "radium";
import { withTranslation } from "react-i18next";
import DisplayMessage from "../components/DisplayMessage/DisplayMessage";
import ProcessView from "../components/ViewingArea/ProcessView";
import MainView from "../components/MainView/MainView";
import AppHeader from "../components/AppHeader/AppHeader";
import { store, useGlobalState } from "state-pool";

import axios from "axios";
import { SERVER_URL } from "../Constants/appConstants";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  setToastDataFunc,
  ToastDataValue,
} from "../redux-store/slices/ToastDataHandlerSlice";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../UI/ErrorToast";
import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";
import { setLaunchpadToken } from "../redux-store/slices/LaunchpadTokenSlice";

function initializeStore() {
  store.setState("arrProcessesData", [], { persist: false });
  store.setState("loadedProcessData", null, { persist: false });
  store.setState("variableDefinition", []);
  store.setState("openProcessesArr", [], { persist: false });
  store.setState("activityPropertyData", null, { persist: false });
  store.setState("inMemoryDB", null, { persist: false });
  store.setState("originalProcessData", null, { persist: false });
  store.setState("allFormsList", [], { persist: false });
  store.setState("allFormAssociationData", []);
  store.setState("selectedTemplateData", {});
}

initializeStore();

const App = (props) => {
  const inMemoryDB = store.getState("inMemoryDB");
  const [localinMemoryDB, setlocalinMemoryDB] = useGlobalState(inMemoryDB);
  const [isLoading, setisLoading] = useState(false);

  let mainContainer = React.createRef();
  useEffect(() => {
    window.loadIntegrator();
  }, []);

  const [state, setstate] = useState({
    //sets state
    displayMessage: {
      display: false,
      message: "",
    },
  });
  // const [dataObjectLaunchpad, setdataObjectLaunchpad] = useState({
  //   session: window?.sharedKey?.session,
  //   userIndex: window?.sharedKey?.userIndex,
  // });

  const launchpadKey = JSON.parse(localStorage.getItem("launchpadKey"));
  const toastDataValue = useSelector(ToastDataValue);
  const dispatch = useDispatch();

  useEffect(() => {
    const ApiMethod = async () => {
      // const res2 = await axios.get(
      //   SERVER_URL + "/setSession/" + launchpadKey?.token
      // );

      // if (res2.data === "Done") {
      //   // dispatch(setLaunchpadToken(launchpadKey?.token));

      // }
      const res = await axios.get(SERVER_URL + "/fetchSavedData/PMWEB");
      if (res.data !== "" && res.data) {
        setlocalinMemoryDB(res?.data);
        setisLoading(false);
      }
    };
    ApiMethod();
  }, []);

  const setDisplayMessage = (message, toShow) => {
    if (
      toShow === false ||
      message === null ||
      message === undefined ||
      message === ""
    ) {
      setstate((prev) => {
        return {
          ...prev,
          displayMessage: {
            display: false,
            message: "",
          },
        };
      });
    } else {
      setstate((prev) => {
        return {
          ...prev,
          displayMessage: {
            display: true,
            message: message,
          },
        };
      });
    }
  };

  const direction = `${props.t("HTML_DIR")}`;

  // changeLang = (event) => {
  //   this.props.i18n.changeLanguage(event.target.value);
  // }

  const translate = (langKey, defaultWord) => {
    return props.t(langKey, defaultWord);
  };
  const generateClassName = createGenerateClassName({
    seed: "pdes",

    // disableGlobal:true,

    productionPrefix: "pdes",
  });

  return (
    <React.Fragment className="App">
      {isLoading ? (
        <div
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        // <StylesProvider generateClassName={generateClassName}>
        <BrowserRouter basename="/processDesigner">
          <AppHeader />
          {toastDataValue?.open ? (
            <Toast
              open={toastDataValue.open}
              closeToast={() => dispatch(setToastDataFunc({ open: false }))}
              message={toastDataValue.message}
              severity={toastDataValue.severity}
            />
          ) : null}

          {/* <select value = {this.props.i18n.language}
                onChange = {(event) => this.changeLang(event)}>
          <option value = "en">English</option>
          <option value = "fr">French</option>
        </select> */}

          <DisplayMessage
            displayMessage={state.displayMessage}
            setDisplayMessage={(message, toShow) =>
              setDisplayMessage(message, toShow)
            }
          />

          <table
            className="pmwidth100"
            ref={mainContainer}
            style={{ direction: direction }}
          >
            <tbody>
              <tr className="pmwidth100" style={{ direction: direction }}>
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={(props) => (
                      <MainView {...props} mainContainer={mainContainer} />
                    )}
                  />
                  <Route
                    path="/process"
                    render={(props) => (
                      <ProcessView
                        {...props}
                        mainContainer={mainContainer}
                        setDisplayMessage={setDisplayMessage}
                      />
                    )}
                  />
                </Switch>
              </tr>
            </tbody>
          </table>
        </BrowserRouter>
        // </StylesProvider>
      )}
    </React.Fragment>
  );
};

export default withTranslation()(Radium(App));
