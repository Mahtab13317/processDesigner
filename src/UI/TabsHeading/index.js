import React from "react";

function TabsHeading(props) {
  return (
    <>
      {
        //added by mahtab
        props?.heading ? (
          <div className="headingSectionTab">{<h4>{props?.heading}</h4>}</div>
        ) : null
      }
    </>
  );
}

export default TabsHeading;
