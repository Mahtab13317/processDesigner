import React from "react";
import { useTranslation } from "react-i18next";
import "./index.css";
import Tabs from "../../../../UI/Tab/Tab.js";
import EmailTab from "./EmailTab.js";
import Fax from "./Fax.js";
import Print from "./Print.js";
import TabsHeading from "../../../../UI/TabsHeading";

function Email(props) {
  let { t } = useTranslation();

  return (
   <>
   <TabsHeading heading={props?.heading} />
     <div style={{ background: "white", margin: "1rem 0" }}>
      <Tabs
        tabType="processSubTab"
        tabContentStyle="processSubTabContentStyle"
        tabBarStyle="processSubTabBarStyle"
        oneTabStyle="processSubOneTabStyle"
        tabStyling="processViewTabs"
        tabsStyle="processViewSubTabs"
        TabNames={[t("print"), t("fax"), t("email")]}
        TabElement={[<Print />, <Fax />, <EmailTab />]}
      />
    </div>
   </>
  );
}

export default Email;
