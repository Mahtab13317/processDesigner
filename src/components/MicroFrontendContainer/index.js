import React from "react";
import useMicroFrontendLoader from "./MicroFrontendLoader";

const MicroFrontendContainer = (props) => {
  let payload;
  const { containerId, data, moduleName, styles, componentName, domainUrl } =
    props;
  console.log("ffffffffffffff", props);

  if (moduleName === "ORM") {
    payload = { data: data, locale: "en_US", ContainerId: containerId };
  }
  // else if (moduleName === "FormBuilder") {
  //   payload = [
  //     {
  //       ContainerId: containerId,
  //       passedData: { formMataData_json: data },
  //       Renderer: "renderPreview",
  //     },
  //   ];
  // }

  let microAppsJSON = {
    AuthData: {},
    MicroApps: [
      {
        Module: moduleName, // Need to check
        MicroFrontends: [
          {
            Component: componentName, //Need to check
            InFrame: false,
            Props: payload,
          },
        ],
      },
    ],
  };

  useMicroFrontendLoader({
    microAppsJSON,
    domainUrl: domainUrl,
  });

  return (
    <React.Fragment>
      <div id={containerId} style={styles}></div>
    </React.Fragment>
  );
};

export default MicroFrontendContainer;
