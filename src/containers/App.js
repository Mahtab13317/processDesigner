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
import { APP_HEADER_HEIGHT, SERVER_URL } from "../Constants/appConstants";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  setToastDataFunc,
  ToastDataValue,
} from "../redux-store/slices/ToastDataHandlerSlice";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../UI/ErrorToast";
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
    window.getMicroApps = function (microAppsHandler) {
      let microAppsJSON = {
        MicroApps: [
          {
            AuthData: {
              authtype: "JWT",
              JwtToken: JSON.parse(localStorage.getItem("launchpadKey"))?.token,
              from: "LPWEB",
            },

            Module: "MDM",
          },
        ],
      };

      microAppsHandler({ ...microAppsJSON });
    };
    if (window.loadIntegrator) {
      window.loadIntegrator();
    }
    const ApiMethod = async () => {
      const res = await axios.get(SERVER_URL + "/fetchSavedData/PMWEB");
      if (res.data !== "" && res.data) {
        setlocalinMemoryDB(res?.data);
        setisLoading(false);
      }
    };
    ApiMethod();
  }, []);

  const token = launchpadKey?.token;
  if (token) {
    axios.interceptors.request.use(function (config) {
      config.headers.Authorization = token;
      return config;
    });
    axios.interceptors.response.use(
      function (response) {
        // Do something with response data
        return response;
      },
      function (error) {
        dispatch(
          setToastDataFunc({
            message: error.response.data.error,
            severity: "error",
            open: true,
          })
        );
      }
    );
  }

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
          <DisplayMessage
            displayMessage={state.displayMessage}
            setDisplayMessage={(message, toShow) =>
              setDisplayMessage(message, toShow)
            }
          />
          <div
            className="pmwidth100"
            style={{
              direction: direction,
              height: `calc(100vh - ${APP_HEADER_HEIGHT})`,
            }}
          >
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
          </div>
        </BrowserRouter>
      )}
    </React.Fragment>
  );
};

export default withTranslation()(Radium(App));
