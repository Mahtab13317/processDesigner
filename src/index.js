// Pollyfills for IE and edge
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./containers/App";
import reportWebVitals from "./reportWebVitals";
// import './locale/locale';
import "./i18n";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./redux-store/reducers/reducers";
import thunk from "redux-thunk";
import theme from "./assets/theme/theme";
import { ThemeProvider, CssBaseline } from "@material-ui/core";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, applyMiddleware(thunk));

window.loadIntegrator = function () {
  const scriptInt = document.createElement("script");

  scriptInt.type = "text/javascript";

  scriptInt.src = "/integration/integration.js";
  scriptInt.onload = () => {
    console.log("inside integration compo");
  };

  document.body.appendChild(scriptInt);
};
window.MdmDataModel = function (props) {
  if (window && window?.loadMicroFrontend) {
    window.loadMicroFrontend(props);
  }
};

window.loadActivityStream = function () {
  window.lpweb_containerId_mf = "mf_activitystream_lpweb";
  var props = {
    Module: "LPWEB",
    Component: "ActivityStream",
    InFrame: false,
    ContainerId: "mf_activitystream_lpweb",
    Callback: null,
    passedData: { componentId: "PMWEB" },
    Renderer: "renderActivityStream",
  };
  try {
    if (window && window?.loadMicroFrontend) {
      window.loadMicroFrontend(props);
    }
  } catch (err) {
    console.log(err);
  }
};

window.loadFormTemplates = function (callback) {
  window.appdesigner_containerId_mf = "mf_forms_int_des";
  var props = {
    Module: "INTERFACEDESIGNER",
    Component: "template",
    InFrame: false,
    ContainerId: "mf_forms_int_des",
    Callback: callback,
    passedData: null,
    // isMF: true,
    Renderer: "renderTemplate",
  };

  if (window && window?.loadMicroFrontend) {
    window.loadMicroFrontend(props);
  }
};
window.loadForm_INT_DES = function (callback) {
  window.appdesigner_containerId_mf = "mf_formsOtherProcesses";
  var props = {
    Module: "INTERFACEDESIGNER",
    Component: "forms",
    InFrame: false,
    ContainerId: "mf_formsOtherProcesses",
    Callback: null,
    passedData: null,
    isMF: true,
    Renderer: "renderForms",
    // processState: processType,
    // processDefIdArray: arrProcessDefId,
  };

  if (window && window?.loadMicroFrontend) {
    window.loadMicroFrontend(props);
  }
};

window.loadForm_DesignerPreview = function (passedData, containerId) {
  var props = {
    Module: "FORMBUILDER",
    Component: "Preview",
    // "Component": "Interface",
    InFrame: false,
    ContainerId: containerId || "process_form_opening_mf",
    Callback: null,
    passedData: { ...passedData, device: "Mobile", activePage: undefined },
  };
  if (window && window?.loadMicroFrontend) {
    window.loadMicroFrontend(props);
  }
};

window.loadFormBuilder = function (containerId, passedData) {
  window.formBuilder_containerId_mf = containerId;

  var props = {
    Module: "FORMBUILDER",
    Component: "App",
    InFrame: false,
    ContainerId: containerId,
    Callback: null,
    passedData: { ...passedData, activePage: undefined },
  };
  if (window && window?.loadMicroFrontend) {
    window.loadMicroFrontend(props);
  }
};
window.loadFormBuilderPreview = function (passedData, containerId) {
  window.formBuilder_containerId_mf = containerId;
  var props = {
    Module: "FORMBUILDER",
    Component: "Preview",
    // "Component": "Interface",
    InFrame: false,
    ContainerId: containerId,
    Callback: null,
    passedData: { ...passedData, device: "Mobile", activePage: undefined },
  };

  if (window && window?.loadMicroFrontend) {
    window.loadMicroFrontend(props);
  }
};

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    </Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
