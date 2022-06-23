import { useEffect } from "react";

const useMicroFrontendLoader = (props) => {
  const { microAppsJSON, domainUrl } = props;

  window.getMicroApps = (microAppsHandler) => {
    microAppsHandler(microAppsJSON);
  };

  useEffect(() => {
    const scriptInt = document.createElement("script");
    scriptInt.type = "text/javascript";
    scriptInt.src = `${domainUrl}/integration/integration.js`;
    document.body.appendChild(scriptInt);
  }, [domainUrl]);
};

export default useMicroFrontendLoader;
