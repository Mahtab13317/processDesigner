import { useEffect } from "react";

const useMicroFrontendLoader = (props) => {
  const {
    microAppsJSON,
    domainUrl = "",

    ProcessDefId,
  } = props;

  window.getMicroApps = (microAppsHandler) => {
    // debugger;
    console.log("inside microapps");
    microAppsHandler(microAppsJSON);
  };

  const loadMicrofrontend = () => {
    const scriptInt = document.createElement("script");

    scriptInt.type = "text/javascript";

    scriptInt.src = "/integration/integration.js";
    scriptInt.onload = () => {
      console.log("inside integration compo");
    };
    console.log("inside loadmicro");
    document.body.appendChild(scriptInt);
  };

  useEffect(() => {
    loadMicrofrontend();
  }, [ProcessDefId]);

  return { loadMicrofrontend };
};

export default useMicroFrontendLoader;
