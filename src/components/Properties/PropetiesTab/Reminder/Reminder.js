import React from "react";
import TabsHeading from "../../../../UI/TabsHeading";
import ActivityRules from "../ActivityRules";
function Reminder(props) {
  console.log("reminder props", props);
  return (
    <>
      <TabsHeading heading={props?.heading} />
      <ActivityRules activityTab="Reminder" />
    </>
  );
}

export default Reminder;
