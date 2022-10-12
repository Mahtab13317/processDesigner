import React, { useEffect, useState } from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Button } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { store, useGlobalState } from "state-pool";

function AddUserGroup(props) {
  let { t } = useTranslation();
  const [userGroupData, setUserGroupData] = useState([]);
  const actProperty = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData] = useGlobalState(actProperty);

  const saveChangeHandler = () => {
    props.getUserGroupList(userGroupData);
    props.closeModal();
    setUserGroupData([]);
  };

  const getInitialSelectedUsersGroups = () => {
    let users = [];
    let groups = [];
    Object.values(
      localLoadedActivityPropertyData.ActivityProperty?.wdeskInfo
        ?.objPMWdeskTasks?.taskMap
    ).forEach((task) => {
      if (task.taskTypeInfo.taskId == props.taskInfo.taskId) {
        task.m_arrUGInfoList.forEach((arr) => {
          if (arr.m_strType === "U") {
            users.push({ id: arr.m_strID, name: arr.m_strName });
          } else groups.push({ id: arr.m_strID, name: arr.m_strName });
        });
      }
    });

    return { selectedUsers: users, selectedGroups: groups };
  };

  const groupUserHandler = (val) => {
    let temp = global.structuredClone(localLoadedActivityPropertyData);
    let userDataList = [];
    let groupDataList = [];
    Object.values(
      temp?.ActivityProperty?.wdeskInfo?.objPMWdeskTasks?.taskMap
    ).forEach((task) => {
      if (+task.taskTypeInfo.taskId === +props.taskInfo.taskId) {
        val.selectedUsers.forEach((user) => {
          userDataList.push({
            m_strID: user.id,
            m_strType: user.type,
            m_strName: user.name,
          });
          const unique = [
            ...new Map(
              userDataList.map((item) => [item.m_strID, item])
            ).values(),
          ];
          userDataList = [...unique];
        });
        val.selectedGroups.forEach((group) => {
          groupDataList.push({
            m_strID: group.id,
            m_strType: group.type,
            m_strName: group.name,
          });
          const unique = [
            ...new Map(
              groupDataList.map((item) => [item.m_strID, item])
            ).values(),
          ];
          groupDataList = [...unique];
        });
      }
    });
    setUserGroupData([...userDataList, ...groupDataList]);
  };

  const pickListHandler = () => {
    let microProps = {
      data: {
        initialSelected: getInitialSelectedUsersGroups(),
        onSelection: (val) => groupUserHandler(val),
        token: JSON.parse(localStorage.getItem("launchpadKey"))?.token,
        ext: true,
        customStyle: {
          selectedTableMinWidth: "50%", // selected user and group listing width
          listTableMinWidth: "50%", // user/ group listing width
          listHeight: "15rem", // custom height common for selected listing and user/group listing
          showUserFilter: true, // true for showing user filter, false for hiding
          showExpertiseDropDown: true, // true for showing expertise dropdown, false for hiding
          showGroupFilter: true, // true for showing group filter, false for hiding
        },
      },
      locale: "en_US",
      ContainerId: "usergroupDiv",
      Module: "ORM",
      Component: "UserGroupPicklistMF",
      InFrame: false,
      Renderer: "renderUserGroupPicklistMF",
    };
    window.loadUserGroupMF(microProps);
  };

  useEffect(() => {
    pickListHandler();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Open Sans",
      }}
    >
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #D3D3D3",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 1vw",
        }}
      >
        <p
          style={{
            fontSize: "var(--subtitle_text_font_size)",
            fontWeight: "600",
          }}
        >
          {t("Associate User(s)/Group(s)")}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={props.closeModal}
            style={{ marginInline: "0.3rem" }}
          >
            {t("discard")}
          </Button>
          <Button
            variant="contained"
            style={{ marginInline: "0.3rem" }}
            color="primary"
            onClick={saveChangeHandler}
          >
            {t("save")} {t("changes")}
          </Button>
          <CloseIcon
            onClick={props.closeModal}
            style={{ height: "1.25rem", width: "1.25rem" }}
          />
        </div>
      </div>
      <div style={{ width: "100%", height: "85%" }} id="usergroupDiv">
        {" "}
        {/* <MicroFrontendContainer
          styles={{
            width: "100%",
            height: "50vh",
            paddingInline: "10px",
            // background: "red",
          }}
          containerId="rdDIv"
          microAppsJSON={microAppsJSON}
          domainUrl=""
          //ProcessDefId={localLoadedProcessData.ProcessDefId}
        /> */}
      </div>
      {/* <div
        style={{
          width: "100%",
          height: "3rem",
          display: "flex",
          flexDirection: "row-reverse",
          padding: "0.5rem",
          background: "red",
        }}
      >
        <Button variant="contained" style={{ marginInline: "0.6rem" }}>
          Discard
        </Button>
        <Button variant="contained" color="primary">
          Save Changes
        </Button>
      </div> */}
    </div>
  );
}

export default AddUserGroup;
