import { useEffect } from "react";

const useMicroFrontendLoader = (props) => {
  const {
    microAppsJSON,
    domainUrl = "",

    ProcessDefId,
  } = props;

  const loadMicrofrontend = () => {
    // const scriptInt = document.createElement("script");
    // scriptInt.type = "text/javascript";
    // scriptInt.src = "/integration/integration.js";
    // scriptInt.onload = () => {
    //   console.log("inside integration compo");
    // };
    // console.log("inside loadmicro");
    // document.body.appendChild(scriptInt);
    // if (window && window?.getMicroApps)
    //   window.getMicroApps = (microAppsHandler) => {
    //     console.log("inside microapps");
    //     microAppsHandler(microAppsJSON);
    //   };
  };

  useEffect(() => {
    loadMicrofrontend();
  }, [ProcessDefId]);

  return { loadMicrofrontend };
};

export default useMicroFrontendLoader;
