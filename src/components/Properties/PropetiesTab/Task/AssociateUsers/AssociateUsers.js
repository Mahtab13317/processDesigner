import React, { useState } from "react";
import classes from "../Task.module.css";
import Modal from "../../../../../UI/Modal/Modal";
import AddUserGroup from "./AddUserGroup";
import { connect, useDispatch } from "react-redux";
import RedDelete from "../../../../../assets/abstractView/RedDelete.svg";
import Search from "../../../../../UI/Search Component/index";
import { store, useGlobalState } from "state-pool";
import { useTranslation } from "react-i18next";
import { setActivityPropertyChange } from "../../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { propertiesLabel } from "../../../../../Constants/appConstants";
import Users from "../../../../../assets/users.svg";
import { containsText } from "../../../../../utility/CommonFunctionCall/CommonFunctionCall";

function AssociateUsers({ taskInfo, ...props }) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const dispatch = useDispatch();
  const [openAddUserModal, setopenAddUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const actProperty = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(actProperty);

  const userGroupListHandler = (val) => {
    let temp = global.structuredClone(localLoadedActivityPropertyData);
    temp.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
      taskInfo.taskTypeInfo.taskName
    ] = {
      ...temp.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
        taskInfo.taskTypeInfo.taskName
      ],
      m_arrUGInfoList: [...val],
    };
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.task]: { isModified: true, hasError: false },
      })
    );
  };

  const closeHandler = () => {
    setopenAddUserModal(false);
    var elem = document.getElementById("oapweb_assetManifest");
    elem.parentNode.removeChild(elem);
  };

  const deleteUserGroup = (id, type) => {
    let temp = global.structuredClone(localLoadedActivityPropertyData);
    Object.values(
      temp.ActivityProperty?.wdeskInfo?.objPMWdeskTasks?.taskMap
    ).forEach((task) => {
      if (task.taskTypeInfo.taskId == taskInfo.taskTypeInfo.taskId) {
        temp.ActivityProperty.wdeskInfo.objPMWdeskTasks.taskMap[
          taskInfo.taskTypeInfo.taskName
        ].m_arrUGInfoList = task.m_arrUGInfoList.filter(
          (usergroup) =>
            !(usergroup.m_strID === id && usergroup.m_strType === type)
        );
      }
    });
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.task]: { isModified: true, hasError: false },
      })
    );
  };

  const filteredRows = taskInfo?.m_arrUGInfoList?.filter((arr) =>
    containsText(arr.m_strName, searchTerm)
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontFamily: "var(--font_family)",
        padding: "1rem 1vw",
        direction: direction,
      }}
    >
      {!taskInfo?.m_arrUGInfoList || taskInfo?.m_arrUGInfoList?.length === 0 ? (
        <div className={classes.emptyStateMainDiv}>
          <img
            className={classes.emptyStateImage}
            src={Users}
            alt=""
            style={{
              marginTop: "6rem",
              marginBottom: "0",
            }}
          />
          <p
            className={classes.emptyStateText}
            style={{ marginBottom: "0.5rem", marginTop: "0" }}
          >
            {t("noUserAssociated")}
          </p>
          <button
            style={{
              border: "1px solid var(--button_color)",
              color: "var(--button_color)",
              background: "white",
              fontFamily: "var(--font_family)",
              cursor: "pointer",
            }}
            onClick={() => setopenAddUserModal(true)}
          >
            <p
              style={{
                fontWeight: "600",
                fontSize: "var(--base_text_font_size)",
              }}
            >
              {t("AssociateUsers/Groups")}
            </p>
          </button>
        </div>
      ) : null}
      {openAddUserModal ? (
        <Modal
          show={openAddUserModal}
          backDropStyle={{ backgroundColor: "transparent" }}
          style={{
            width: "70%",
            top: "28%",
            left: "18%",
            padding: "0",
            boxShadow: "none",
          }}
          children={
            <AddUserGroup
              taskInfo={taskInfo.taskTypeInfo}
              getUserGroupList={(val) => userGroupListHandler(val)}
              closeModal={() => closeHandler()}
            />
          }
        />
      ) : null}

      {taskInfo?.m_arrUGInfoList?.length > 0 ? (
        <div
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "2vw",
            }}
          >
            <Search
              placeholder={t("Search Users or Groups")}
              width="21vw"
              onSearchChange={(val) => setSearchTerm(val)}
              clearSearchResult={() => setSearchTerm("")}
            />
            <button
              style={{
                border: "1px solid var(--button_color)",
                color: "var(--button_color)",
                background: "white",
                fontFamily: "var(--font_family)",
                cursor: "pointer",
              }}
              onClick={() => setopenAddUserModal(true)}
            >
              <p
                style={{
                  fontWeight: "600",
                  fontSize: "var(--base_text_font_size)",
                }}
              >
                {t("AssociateUsers/Groups")}
              </p>
            </button>
          </div>
          <p
            style={{
              fontWeight: "600",
              fontSize: "var(--base_text_font_size)",
              marginBlock: "1rem",
            }}
          >
            {
              taskInfo.m_arrUGInfoList.filter((arr) => arr.m_strType === "U")
                .length
            }{" "}
            {t("user(s)and")}{" "}
            {
              taskInfo.m_arrUGInfoList.filter((arr) => arr.m_strType === "G")
                .length
            }{" "}
            {t("group(s)associated")}
          </p>
          <div style={{ height: "42vh", overflow: "auto" }}>
            {filteredRows
              ?.filter((arr) => arr.m_strType === "U")
              ?.map((user) => {
                return (
                  <div
                    style={{
                      width: "60%",
                      display: "flex",
                      flexDirection: "row",
                      background: "#FFFFFF",
                      border: "1px solid #F0F0F0",
                      height: "var(--line_height)",
                      padding: "0.25rem 1vw",
                      marginBlock: "0.25rem",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "32rem",
                      }}
                    >
                      <p
                        className={classes.tableCellText}
                        style={{
                          fontWeight: "500",
                          fontSize: "var(--base_text_font_size)",
                        }}
                      >
                        {user.m_strName}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "50%",
                        justifyContent: "left",
                        marginLeft: "1vw",
                      }}
                    >
                      <div style={{ minWidth: "100px", textAlign: "left" }}>
                        <p
                          className={classes.tableCellText}
                          style={{
                            fontWeight: "500",
                            fontSize: "var(--base_text_font_size)",
                          }}
                        >
                          {t("User")}
                        </p>
                      </div>
                    </div>
                    {/* <p className={classes.tableCellText} style={{fontWeight: "600"}}>-</p> */}
                    <img
                      src={RedDelete}
                      style={{ cursor: "pointer" }}
                      alt="del"
                      onClick={() =>
                        deleteUserGroup(user.m_strID, user.m_strType)
                      }
                    />
                  </div>
                );
              })}
            {filteredRows
              ?.filter((arr) => arr.m_strType === "G")
              ?.map((group) => {
                return (
                  <div
                    style={{
                      width: "60%",
                      display: "flex",
                      flexDirection: "row",
                      background: "#FFFFFF",
                      border: "1px solid #F0F0F0",
                      height: "var(--line_height)",
                      padding: "0.25rem 1vw",
                      marginBlock: "0.25rem",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "32rem",
                      }}
                    >
                      <p
                        className={classes.tableCellText}
                        style={{
                          fontWeight: "500",
                          fontSize: "var(--base_text_font_size)",
                        }}
                      >
                        {group.m_strName}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "50%",
                        justifyContent: "left",
                        marginLeft: "1vw",
                      }}
                    >
                      <div style={{ minWidth: "100px", textAlign: "left" }}>
                        <p
                          className={classes.tableCellText}
                          style={{
                            fontWeight: "500",
                            fontSize: "var(--base_text_font_size)",
                          }}
                        >
                          {t("group")}
                        </p>
                      </div>
                    </div>
                    <img
                      src={RedDelete}
                      style={{ cursor: "pointer" }}
                      alt="del"
                      onClick={() =>
                        deleteUserGroup(group.m_strID, group.m_strType)
                      }
                    />
                  </div>
                );
              })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    showDrawer: state.showDrawerReducer.showDrawer,
    cellID: state.selectedCellReducer.selectedId,
    cellName: state.selectedCellReducer.selectedName,
    cellType: state.selectedCellReducer.selectedType,
    cellActivityType: state.selectedCellReducer.selectedActivityType,
    cellActivitySubType: state.selectedCellReducer.selectedActivitySubType,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(mapStateToProps, null)(AssociateUsers);
