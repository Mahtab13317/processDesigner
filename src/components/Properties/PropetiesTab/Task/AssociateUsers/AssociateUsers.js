import React, { useState, useEffect } from "react";
import classes from "../Task.module.css";
import { Checkbox } from "@material-ui/core";
import Modal from "../../../../../UI/Modal/Modal";
import AddUserGroup from "./AddUserGroup";
import { connect } from "react-redux";
import RedDelete from "../../../../../assets/abstractView/RedDelete.svg";
import Search from "../../../../../UI/Search Component/index";
import { store, useGlobalState } from "state-pool";
import { useTranslation } from "react-i18next";

function AssociateUsers(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [openAddUserModal, setopenAddUserModal] = useState(false);
  const [userListing, setuserListing] = useState([]);
  const [groupListing, setgroupListing] = useState([]);
  const actProperty = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(actProperty);
  const [allCheckedBool, setallCheckedBool] = useState(false);
  const userGroupListHandler = (val) => {
    //let users,groups;
    val.selectedUsers.forEach((user) => {
      user["isChecked"] = false;
    });

    val.selectedGroups.forEach((group) => {
      group["isChecked"] = false;
    });
    setuserListing(val.selectedUsers);
    setgroupListing(val.selectedGroups);
  };
  const deleteUser = (data) => {
    let temp = JSON.parse(JSON.stringify(userListing));
    temp.splice(
      temp.findIndex(function (i) {
        return i.id === data.id;
      }),
      1
    );

    setuserListing(temp);
  };
  const deleteGroup = (data) => {
    let temp = JSON.parse(JSON.stringify(groupListing));
    temp.splice(
      temp.findIndex(function (i) {
        return i.id === data.id;
      }),
      1
    );
    setgroupListing(temp);
  };

  React.useEffect(() => {
    let newUser = {};
    localLoadedActivityPropertyData.ActivityProperty?.Interfaces?.TaskTypes?.forEach(
      (task) => {
        if (task.TaskId === props.taskInfo.TaskId) {
          task.Users.forEach((user) => {
            newUser = {
              id: user.UserId,
              name: user.UserName,
              username: "",
              isChecked: false,
            };
            if (user.AssociationType === "G") {
              let temp = JSON.parse(JSON.stringify(groupListing));
              temp.push({ AssociationType: "G", ...newUser });
              setgroupListing(temp);
            } else {
              let temp = JSON.parse(JSON.stringify(userListing));
              temp.push({ AssociationType: "U", ...newUser });
              setuserListing(temp);
            }
          });
        }
      }
    );
  }, [props.taskInfo.TaskId]);

  useEffect(() => {
    let allUser = true,
      allGroup = true;
    let temp = JSON.parse(JSON.stringify(groupListing));
    let temp2 = JSON.parse(JSON.stringify(userListing));
    temp2.forEach((user) => {
      if (user.isChecked === false) allUser = false;
    });
    temp.forEach((group) => {
      if (group.isChecked === false) allGroup = false;
    });

    if (allUser && allGroup) setallCheckedBool(true);
    else setallCheckedBool(false);
  }, [groupListing, userListing]);

  useEffect(() => {
    let temp = JSON.parse(JSON.stringify(groupListing));
    let temp2 = JSON.parse(JSON.stringify(userListing));
    if (allCheckedBool === true) {
      temp2.forEach((user) => {
        user.isChecked = true;
      });
      temp.forEach((group) => {
        group.isChecked = true;
      });
      setuserListing(temp2);
      setgroupListing(temp);
    }
  }, [allCheckedBool]);

  const handleUserCheckInList = (data) => {
    if (data.AssociationType === "G") {
      let temp = JSON.parse(JSON.stringify(groupListing));
      temp.forEach((group) => {
        if (group.id === data.id) {
          group.isChecked = !group.isChecked;
        }
      });
      setgroupListing(temp);
    } else {
      let temp = JSON.parse(JSON.stringify(userListing));
      temp.forEach((user) => {
        if (user.id === data.id) {
          user.isChecked = !user.isChecked;
        }
      });
      setuserListing(temp);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontFamily: "Open Sans",
        padding: "0.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        direction: direction,
      }}
    >
      {userListing.length === 0 && groupListing.length === 0 ? (
        <button onClick={() => setopenAddUserModal(true)}>
          {t("addUserHere")}
        </button>
      ) : null}

      <Modal
        show={openAddUserModal}
        backDropStyle={{ backgroundColor: "transparent" }}
        style={{
          width: "70%",
          height: "55%",
          // left: props.isDrawerExpanded ? "23%" : "53%",
          top: "19%",
          left: "18%",
          padding: "0",
          boxShadow: "none",
        }}
        modalClosed={() => setopenAddUserModal(false)}
        children={
          <AddUserGroup
            getUserGroupList={(val) => userGroupListHandler(val)}
            closeModal={() => setopenAddUserModal(false)}
          />
        }
      />
      {userListing.length > 0 || groupListing.length > 0 ? (
        <div
          style={{ width: "100%", display: "flex", flexDirection: "column" }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Search placeholder={t("Search Users or Groups")} />
            <button
              style={{
                width: "10.625rem",
                height: "1.75rem",
                border: "1px solid #0072C6",
                color: "#0072C6",
                background: "white",
                marginLeft: "0.8rem",
              }}
              onClick={() => setopenAddUserModal(true)}
            >
              <p
                style={{
                  fontWeight: "600",

                  fontSize: "0.8rem",
                  marginInline: "0.2rem",
                }}
              >
                {t("AssociateUsers/Groups")}
              </p>
            </button>
          </div>
          <p
            style={{
              fontWeight: "600",

              fontSize: "0.85rem",
              marginBlock: "0.5rem",
            }}
          >
            {userListing.length} {t("user(s)and")} {groupListing.length}{" "}
            {t("group(s)associated")}
          </p>
          <div
            style={{
              width: "80%",
              display: "flex",
              flexDirection: "row",
              height: "2rem",
              padding: "0.1rem",
            }}
          >
            <Checkbox
              checked={allCheckedBool}
              onChange={() => setallCheckedBool((prev) => !prev)}
              style={{ marginRight: "0.3rem" }}
            />
            <p
              className={classes.tableCellText}
              style={{
                fontWeight: "600",
                paddingTop: "0.25rem",
                fontSize: "0.8rem",
              }}
            >
              {t("selectAll")}
            </p>
          </div>
          {userListing.map((user) => {
            return (
              <div
                style={{
                  width: "80%",
                  display: "flex",
                  flexDirection: "row",
                  background: "#FFFFFF",
                  border: "1px solid #F0F0F0",
                  height: "2rem",
                  padding: "0.1rem",
                  marginBlock: "0.2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "17rem",
                  }}
                >
                  <Checkbox
                    checked={user.isChecked}
                    onChange={() => handleUserCheckInList(user)}
                    style={{ marginRight: "0.3rem" }}
                  />
                  <p
                    className={classes.tableCellText}
                    style={{
                      fontWeight: "600",
                      paddingTop: "0.25rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    {user.name} {user.username}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ width: "100px", textAlign: "left" }}>
                    <p
                      className={classes.tableCellText}
                      style={{
                        fontWeight: "600",
                        paddingTop: "0.25rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      {t("user")}
                    </p>
                  </div>
                </div>
                {/* <p className={classes.tableCellText} style={{fontWeight: "600"}}>-</p> */}
                <img
                  src={RedDelete}
                  alt="del"
                  onClick={() => deleteUser(user)}
                />
              </div>
            );
          })}
          {groupListing.map((group) => {
            return (
              <div
                style={{
                  width: "80%",
                  display: "flex",
                  flexDirection: "row",
                  background: "#FFFFFF",
                  border: "1px solid #F0F0F0",
                  height: "2rem",
                  padding: "0.1rem",
                  marginBlock: "0.2rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "17rem",
                  }}
                >
                  <Checkbox
                    checked={group.isChecked}
                    onChange={() => handleUserCheckInList(group)}
                    style={{ marginRight: "0.3rem" }}
                  />
                  <p
                    className={classes.tableCellText}
                    style={{
                      fontWeight: "600",
                      paddingTop: "0.25rem",
                      fontSize: "0.8rem",
                    }}
                  >
                    {group.name}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ width: "100px", textAlign: "left" }}>
                    <p
                      className={classes.tableCellText}
                      style={{
                        fontWeight: "600",
                        paddingTop: "0.25rem",
                        fontSize: "0.8rem",
                      }}
                    >
                      {t("group")}
                    </p>
                  </div>
                </div>
                <img
                  src={RedDelete}
                  alt="del"
                  onClick={() => deleteGroup(group)}
                />
              </div>
            );
          })}
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
