import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import Radium from "radium";
import { useTranslation, withTranslation } from "react-i18next";
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
import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";
import { removeUserSession } from "../utility/CommonFunctionCall/CommonFunctionCall";

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
  store.setState("calendarList", []);
  store.setState("selectedTemplateData", {});
}

initializeStore();

const App = (props) => {
  let { t } = useTranslation();
  const inMemoryDB = store.getState("inMemoryDB");
  const [localinMemoryDB, setlocalinMemoryDB] = useGlobalState(inMemoryDB);
  const [isLoading, setisLoading] = useState(true);

  let mainContainer = React.createRef();

  const [state, setstate] = useState({
    //sets state
    displayMessage: {
      display: false,
      message: "",
    },
  });

  const launchpadKey = JSON.parse(localStorage.getItem("launchpadKey"));
  const token = launchpadKey?.token;
  const toastDataValue = useSelector(ToastDataValue);
  const dispatch = useDispatch();

  const includeTheme = (cabinet_name, resolution, locale, auth_token) => {
    var themeURL =
      "/oap-rest/app/theme/" + cabinet_name + `/${resolution}` + `/${locale}`;
    if (auth_token && auth_token.trim().length > 0) {
      themeURL += `/${auth_token}`;
    }
    // if(resolution){
    //   themeURL += `/${resolution}`
    // }
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = themeURL;
    document.head.appendChild(link);
    setisLoading(false);
  };

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

    window.loadIntegrator();

    const ApiMethod = async () => {
      const res = await axios.get(SERVER_URL + "/fetchSavedData/PMWEB");
      try {
        if (res.data !== "" && res.data) {
          setlocalinMemoryDB(res?.data);
          // code added for theme implementation
          includeTheme(
            localStorage.getItem("cabinet"),
            "1024_768",
            "en_US",
            token
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    ApiMethod();
  }, []);

  if (token) {
    axios.interceptors.request.use(function (config) {
      config.headers.Authorization = token;
      return config;
    });
  }

  axios.interceptors.response.use(
    function (response) {
      // Do something with response data
      return response;
    },
    function (error) {
      console.log("999","error messgae",error?.response?.data)
      if (error?.response?.status === 401) {
        dispatch(
          setToastDataFunc({
            message: t("loggedOutMessage"),
            severity: "error",
            open: true,
          })
        );
        const timeout = setTimeout(() => {
          removeUserSession();
          window.location.href = window.location.origin + `/lpweb`;
        }, 200);
        return () => clearTimeout(timeout);
      } else {
        dispatch(
          setToastDataFunc({
            message: error?.response?.data?.error?.message,
            severity: "error",
            open: true,
          })
        );
      }
    }
  );

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

  /*****************************************************************************************
   * @author asloob_ali BUG ID: 113218  control window is closing on single click
   * Reason:there was some css styles which were getting overrides.
   * Resolution : added styles provider to distinguish beetween css classes names.
   * Date : 19/09/2022
   ****************/
  /*const generateClassName = createGenerateClassName({
    productionPrefix: `processDesignerPmWeb`,
    disableGlobal: true,
  });*/
  return (
    <React.StrictMode>
      {/*<StylesProvider generateClassName={generateClassName}>*/}
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
      {/*</StylesProvider>*/}
    </React.StrictMode>
  );
};

export default withTranslation()(Radium(App));
