import React from "react";
import useMicroFrontendLoader from "./MicroFrontendLoader";

const MicroFrontendContainer = (props) => {
  let payload;
  const {
    containerId,
    data,
    moduleName,
    styles,
    componentName,
    domainUrl,
    microAppsJSON,
    ProcessDefId,
    loadExternalVariablesMFbool,
  } = props;

  if (moduleName === "ORM") {
    payload = { data: data, locale: "en_US", ContainerId: containerId };
  }

  useMicroFrontendLoader({
    microAppsJSON,
    domainUrl: "",
    ProcessDefId,
    loadExternalVariablesMFbool,
  });

  return (
    <React.Fragment>
      <div id={containerId} style={styles}></div>
    </React.Fragment>
  );
};

export default MicroFrontendContainer;
