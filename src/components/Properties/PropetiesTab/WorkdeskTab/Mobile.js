import React, { useState, useEffect } from "react";
import { store, useGlobalState } from "state-pool";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import "./index.css";
import Tabs from "../../../../UI/Tab/Tab.js";
import Todo from "./MobileTab/Todo";
import Exception from "./MobileTab/Exception";
import Document from "./MobileTab/Document";
import Variable from "./MobileTab/Variable";

function Mobile(props) {
  let { t } = useTranslation();
  return (
    <div>
      <Tabs
        tabType="processSubTab"
        tabContentStyle="processSubTabContentStyle"
        tabBarStyle="processSubTabBarStyle"
        oneTabStyle="processSubOneTabStyle"
        tabStyling="processViewTabs"
        tabsStyle="processViewSubTabs"
        TabNames={[t("todo"), t("exception(s)"), t("document"), t("variable")]}
        TabElement={[<Todo />, <Exception />, <Document />, <Variable />]}
      />
    </div>
  );
}

export default Mobile;
