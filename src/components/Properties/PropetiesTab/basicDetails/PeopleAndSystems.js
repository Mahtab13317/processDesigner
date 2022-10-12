import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { store, useGlobalState } from "state-pool";
import Modal from "../../../../UI/Modal/Modal";
import { useDispatch } from "react-redux";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import { propertiesLabel } from "../../../../Constants/appConstants";

const PeopleAndSystems = (props) => {
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const ref = React.useRef(null);
  const [open, setopen] = useState(false);
  const loadedActivityPropertyData = store.getState("activityPropertyData"); //current processdata clicked
  const localProcessData = store.getState("loadedProcessData");
  const [userGroupListData, setuserGroupListData] = useState({});
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [localLoadedProcessData] = useGlobalState(localProcessData);
  const [peopleAndSystemsArray, setpeopleAndSystemsArray] = useState([
    {
      type: "Owner",
      names: [{ id: "", name: "" }],
    },
    {
      type: "Consultant",
      names: [{ id: "", name: "" }],
    },
    {
      type: "System",
      names: [{ id: "", name: "" }],
    },
    {
      type: "Provider",
      names: [{ id: "", name: "" }],
    },
    {
      type: "Consumer",
      names: [{ id: "", name: "" }],
    },
  ]);
  const [typeToOpen, settypeToOpen] = useState(); //which type of field to open picklist in
  const [openUserGroupMF, setopenUserGroupMF] = useState(false);

  useEffect(() => {
    updatePeopleAndSystems(localLoadedActivityPropertyData);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setopen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const updatePeopleAndSystems = (actData) => {
    let temp = [
      {
        type: "Owner",
        names:
          actData.ActivityProperty.actGenPropInfo.genPropInfo.ownerList
            .length !== 0
            ? actData.ActivityProperty.actGenPropInfo.genPropInfo.ownerList.map(
                (item) => {
                  return {
                    id: item.orderID,
                    name: item.ownerName,
                  };
                }
              )
            : [{ id: "", name: "" }],
      },
      {
        type: "Consultant",
        names:
          actData.ActivityProperty.actGenPropInfo.genPropInfo.consultantList
            .length !== 0
            ? actData.ActivityProperty.actGenPropInfo.genPropInfo.consultantList.map(
                (item) => {
                  return {
                    id: item.orderID,
                    name: item.consultantName,
                  };
                }
              )
            : [{ id: "", name: "" }],
      },
      {
        type: "System",
        names:
          actData.ActivityProperty.actGenPropInfo.genPropInfo.systemList
            .length !== 0
            ? actData.ActivityProperty.actGenPropInfo.genPropInfo.systemList.map(
                (item) => {
                  return {
                    id: item.orderID,
                    name: item.sysName,
                  };
                }
              )
            : [{ id: "", name: "" }],
      },
      {
        type: "Provider",
        names:
          actData.ActivityProperty.actGenPropInfo.genPropInfo.providerList
            .length !== 0
            ? actData.ActivityProperty.actGenPropInfo.genPropInfo.providerList.map(
                (item) => {
                  return {
                    id: item.orderID,
                    name: item.providerName,
                  };
                }
              )
            : [{ id: "", name: "" }],
      },
      {
        type: "Consumer",
        names:
          actData.ActivityProperty.actGenPropInfo.genPropInfo.consumerList
            .length !== 0
            ? actData.ActivityProperty.actGenPropInfo.genPropInfo.consumerList.map(
                (item) => {
                  return {
                    id: item.orderID,
                    name: item.consumerName,
                  };
                }
              )
            : [{ id: "", name: "" }],
      },
    ];

    setpeopleAndSystemsArray(temp);
  };

  const addField = (data) => {
    let temp = [...peopleAndSystemsArray];
    temp.forEach((item) => {
      if (item.type === data.type) {
        item.names.push({ id: "", name: "" });
      }
    });
    setpeopleAndSystemsArray(temp);
  };

  const deleteField = (data, deleteId, index) => {
    let temp = [...peopleAndSystemsArray];
    temp.forEach((item) => {
      if (item.type === data.type) {
        item.names.splice(index, 1);
      }
    });
    setpeopleAndSystemsArray(temp);
  };

  const clearField = (data, index) => {
    let temp = [...peopleAndSystemsArray];
    temp.forEach((item) => {
      if (item.type === data.type) {
        item.names[index].name = "";
      }
    });
    setpeopleAndSystemsArray(temp);
  };

  const getUserGroupList = (data, type) => {
    setuserGroupListData(data);
    let temp = global.structuredClone(localLoadedActivityPropertyData);
    if (type === "Owner" || type === "Consultant") {
      temp.ActivityProperty.actGenPropInfo.genPropInfo[
        `${type.charAt(0).toLowerCase() + type.slice(1) + "List"}`
      ] = [];
      data.selectedUsers.forEach((user) => {
        temp.ActivityProperty.actGenPropInfo.genPropInfo[
          `${type.charAt(0).toLowerCase() + type.slice(1) + "List"}`
        ].push({
          [`${type.charAt(0).toLowerCase() + type.slice(1) + "Name"}`]:
            user.name,
          [`${type.charAt(0).toLowerCase() + type.slice(1) + "Id"}`]: user.id,
          bRenderPlus: false,
        });
        const unique = [
          ...new Map(
            temp.ActivityProperty.actGenPropInfo.genPropInfo[
              `${type.charAt(0).toLowerCase() + type.slice(1) + "List"}`
            ].map((item) => [
              item[`${type.charAt(0).toLowerCase() + type.slice(1) + "Id"}`],
              item,
            ])
          ).values(),
        ];
        temp.ActivityProperty.actGenPropInfo.genPropInfo[
          `${type.charAt(0).toLowerCase() + type.slice(1) + "List"}`
        ].names = unique;
      });
    } else if (type === "System") {
      data.selectedUsers.forEach((user) => {
        temp.ActivityProperty.actGenPropInfo.genPropInfo.systemList.push({
          sysName: user.name,
          orderId: user.id,
          bRenderPlus: false,
        });
      });
    } else {
      data.selectedUsers.forEach((user) => {
        temp.ActivityProperty.actGenPropInfo.genPropInfo[
          `${type.charAt(0).toLowerCase() + type.slice(1) + "List"}`
        ].push({
          [`${type.charAt(0).toLowerCase() + type.slice(1) + "Name"}`]:
            user.name,
          orderId: user.id,
          bRenderPlus: false,
        });
      });
    }
    let temp2 = global.structuredClone(peopleAndSystemsArray);

    temp2.forEach((_var) => {
      if (_var.type === type) {
        _var.names = [];
        temp.ActivityProperty.actGenPropInfo.genPropInfo[
          `${type.charAt(0).toLowerCase() + type.slice(1) + "List"}`
        ].forEach((people) => {
          _var.names = _var.names.filter((name) => name.id !== "");
          _var.names.push({
            id: people[
              `${type.charAt(0).toLowerCase() + type.slice(1) + "Id"}`
            ],
            name: people[
              `${type.charAt(0).toLowerCase() + type.slice(1) + "Name"}`
            ],
          });
          const unique = [
            ...new Map(_var.names.map((item) => [item.id, item])).values(),
          ];
          _var.names = unique;
        });
      }
    });

    setpeopleAndSystemsArray(temp2);
    setlocalLoadedActivityPropertyData(temp);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.basicDetails]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };

  const getSelectedUsers = (type) => {
    let selectedUsers = [];
    let temp = global.structuredClone(localLoadedActivityPropertyData);
    temp.ActivityProperty.actGenPropInfo.genPropInfo[
      `${type.charAt(0).toLowerCase() + type.slice(1) + "List"}`
    ].forEach((people) => {
      selectedUsers.push({
        id: people[`${type.charAt(0).toLowerCase() + type.slice(1) + "Id"}`],
        name: people[
          `${type.charAt(0).toLowerCase() + type.slice(1) + "Name"}`
        ],
      });
    });
    return { selectedUsers: selectedUsers };
  };

  const pickListHandler = (event, data, itemName) => {
    settypeToOpen(data.type);
    setopenUserGroupMF(true);

    let microProps = {
      data: {
        initialSelected: getSelectedUsers(data.type),
        onSelection: (list) => getUserGroupList(list, data.type),
        token: JSON.parse(localStorage.getItem("launchpadKey"))?.token,
        ext: true,
        customStyle: {
          selectedTableMinWidth: "50%", // selected user and group listing width

          listTableMinWidth: "50%", // user/ group listing width

          listHeight: "16rem", // custom height common for selected listing and user/group listing

          showUserFilter: true, // true for showing user filter, false for hiding

          showExpertiseDropDown: true, // true for showing expertise dropdown, false for hiding

          showGroupFilter: false, // true for showing group filter, false for hiding
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
    console.log("picklisttttttttttt,", microProps);
  };

  const setOwnerConsultantField = (obj, index, data) => {
    let temp = [...peopleAndSystemsArray];
    let payload = {
      processDefId: localLoadedProcessData.ProcessDefId,
      regMode: localLoadedProcessData.ProcessType,
      orderId: getOrderId(obj.type),
      name: data.userName,
      elementType: "A",
      elementId:
        localLoadedActivityPropertyData.ActivityProperty.ActivityId + "",
    };
    let isAdd = true;

    temp.forEach((item) => {
      if (item.type === obj.type) {
        if (item.names[index].name !== "") {
          isAdd = false;
        }
        item.names[index].id = data.id;
        item.names[index].name = data.userName;
      }
    });
    setpeopleAndSystemsArray(temp);
    setopen(false);
    let endpointName = isAdd
      ? `/peopleAssociation/add${obj.type}`
      : `/peopleAssociation/modify${obj.type}`;
  };

  const setOtherFields = (e, data, index) => {
    let temp = [...peopleAndSystemsArray];
    let tempActData = global.structuredClone(localLoadedActivityPropertyData);

    temp.forEach((item) => {
      if (item.type === data.type) {
        item.names[index].name = e.target.value;
        item.names[index].id = index + 1;
      }
    });

    temp.forEach((item) => {
      if (item.type === data.type) {
        tempActData.ActivityProperty.actGenPropInfo.genPropInfo[
          `${data.type.charAt(0).toLowerCase() + data.type.slice(1) + "List"}`
        ] = [];
        tempActData.ActivityProperty.actGenPropInfo.genPropInfo[
          `${data.type.charAt(0).toLowerCase() + data.type.slice(1) + "List"}`
        ] = item.names.map((people, index) => {
          return {
            orderId: people.id,
            bRenderPlus: false,
            [`${
              data.type.charAt(0).toLowerCase() + data.type.slice(1) ===
              "system"
                ? "sysName"
                : data.type.charAt(0).toLowerCase() +
                  data.type.slice(1) +
                  "Name"
            }`]: item.names[index].name,
          };
        });
      }
    });

    setpeopleAndSystemsArray(temp);

    setlocalLoadedActivityPropertyData(tempActData);
    dispatch(
      setActivityPropertyChange({
        [propertiesLabel.basicDetails]: {
          isModified: true,
          hasError: false,
        },
      })
    );
  };

  const getOrderId = (type) => {
    let id;
    peopleAndSystemsArray.forEach((people) => {
      if (people.type === type) {
        id = people.names[people.names.length - 1].id;
      }
    });
    if (id === "") return 1 + "";
    else return ++id + "";
  };

  const closeModalUserGroup = () => {
    setopenUserGroupMF(false);
    var elem = document.getElementById("oapweb_assetManifest");

    elem.parentNode.removeChild(elem);
  };

  return (
    <div style={{ paddingBottom: "1rem" }}>
      <p
        style={{
          fontSize: "var(--subtitle_text_font_size)",
          fontWeight: "600",
          marginBottom: "0.5rem",
        }}
      >
        {props.disabled ? t("disabledPeopleAndSystems") : t("peopleAndSystems")}
      </p>
      {openUserGroupMF ? (
        <Modal
          show={openUserGroupMF}
          backDropStyle={{ backgroundColor: "transparent" }}
          style={{
            width: "70vw",
            height: "60vh",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            background: "white",
          }}
          modalClosed={() => {
            closeModalUserGroup();
          }}
          children={<div id="usergroupDiv"></div>}
        ></Modal>
      ) : null}

      {peopleAndSystemsArray.map((item) => {
        return (
          <div>
            <p
              style={{
                fontSize: "var(--base_text_font_size)",
                marginBottom: "0.25rem",
              }}
            >
              {item.type}
            </p>
            {item.names.map((name, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.type === "Owner" || item.type === "Consultant" ? (
                    <div
                      style={{
                        height: "var(--line_height)",
                        display: "flex",
                        flexDirection: "row",
                        width: item.names.length > 1 ? "76%" : "87%",
                        cursor: "pointer",
                        border: "1px solid #CECECE",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        onClick={(e) =>
                          props.disabled ? null : pickListHandler(e, item, name)
                        }
                        style={{
                          padding: "0.3rem",
                          width: item.names.length > 1 ? "76%" : "78%",
                          height: "100%",
                        }}
                      >
                        <p
                          style={{
                            color: "#000000",
                            fontSize: "var(--base_text_font_size)",
                          }}
                        >
                          {name.name}
                        </p>
                      </div>
                      <div style={{ height: "100%" }}>
                        <CloseIcon
                          style={{
                            fontSize: "medium",
                            cursor: props.disabled ? "not-allowed" : "pointer",
                            height: "100%",
                            width: "1.2rem",
                            color: "#707070",
                            marginRight: "2px",
                            // display: props.disabled ? "none": ""
                          }}
                          onClick={() =>
                            props.disabled ? null : clearField(item, index)
                          }
                        />
                        <MoreHorizIcon
                          style={{
                            height: "100%",
                            width: "1.8rem",
                            color: "#707070",
                            borderLeft: "1px solid #CECECE",
                            cursor: props.disabled ? "not-allowed" : "pointer",
                            // display: props.disabled ? "none": ""
                          }}
                          onClick={(e) =>
                            props.disabled
                              ? null
                              : pickListHandler(e, item, name)
                          }
                        />
                        {/* <div style={{ position: "relative" }}>
                          {open &&
                          typeToOpen === item.type &&
                          fieldToOpen === name.id ? (
                            <div
                              ref={ref}
                              style={{
                                position: "absolute",
                                // left: "10%",
                                right: "0%",
                                zIndex: "10000",
                                height: "12.5rem",
                                width: "260px",
                                overflow: "hidden",
                                // bottom: "70%",
                                background: "white 0% 0% no-repeat padding-box",
                                boxShadow: "0px 3px 6px #00000029",
                                border: "1px solid #c4c4c4",
                                borderRadius: "1px",
                                opacity: "1",
                              }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  display: "flex",
                                  overflowY: "auto",
                                  overflowX: "hidden",
                                  // padding: "10px",
                                  marginBottom: "10px",

                                  flexDirection: "column",
                                }}
                              >
                                <div
                                  style={{
                                    padding: "0.625rem 0.3125rem",
                                    width: "100%",
                                    height: "18%",

                                    background: "#F0F0F0",
                                  }}
                                >
                                  <p
                                    style={{
                                      fontSize: "0.8rem",
                                      fontWeight: "bolder",
                                    }}
                                  >
                                    Select {item.type}
                                  </p>
                                </div>
                                <hr style={{ marginBottom: "0.3rem" }} />
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    width: "100%",
                                    // padding: "0.3125rem",
                                    justifyContent: "space-evenly",
                                    //alignItems: "flex-start"
                                  }}
                                >
                                  <SearchComponent
                                    width="30%"
                                    style={{ marginBottom: "0.7rem" }}
                                  />
                                  
                                </div>
                                <div
                                  style={{
                                    overflowY: "auto",
                                    paddingInline: "0.625rem",
                                  }}
                                >
                                  {usersArray.map((data) => {
                                    return (
                                      <div
                                        style={{
                                          marginBottom: "0.4rem",
                                          background: "#F0F0F0",
                                        }}
                                        onClick={() =>
                                          setOwnerConsultantField(
                                            item,
                                            index,
                                            data
                                          )
                                        }
                                      >
                                        <p
                                          style={{
                                            textAlign: "left",
                                            color: "black",
                                            fontSize: "1rem",
                                            fontWeight: "500",
                                          }}
                                        >
                                          {data.userName} ({data.peopleName})
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div> */}
                      </div>
                    </div>
                  ) : null}
                  {item.type === "System" ||
                  item.type === "Consumer" ||
                  item.type === "Provider" ? (
                    <div
                      style={{
                        height: "var(--line_height)",
                        display: "flex",
                        flexDirection: "row",
                        width: item.names.length > 1 ? "76%" : "87%",
                        cursor: "pointer",
                        border: "1px solid #CECECE",
                        justifyContent: "space-between",
                      }}
                      // onClick={(e) => pickListHandler(e, item)}
                    >
                      <TextField
                        InputProps={{
                          readOnly: props.disabled,
                        }}
                        key={name.id}
                        value={name.name}
                        onChange={(e) => {
                          setOtherFields(e, item, index);
                        }}
                        // disabled={true}
                        // onKeyUp={(e) => detectLastKeyPress(e)}
                      />
                      <div style={{ height: "100%" }}></div>
                    </div>
                  ) : null}
                  {item.names.length > 1 ? (
                    <DeleteOutlinedIcon
                      style={{
                        border: "1px solid #CECECE",
                        color: "#606060",
                        marginTop: "0px",
                        marginRight: "5px",
                        height: "2rem",
                        width: "2rem",
                        display: props.disabled ? "none" : "",
                      }}
                      onClick={() => deleteField(item, name.id, index)}
                    />
                  ) : null}
                  {item.names.length === index + 1 ? (
                    <div
                      className="basicDetails-addIcon"
                      style={{
                        display: props.disabled ? "none" : "",
                      }}
                    >
                      <AddIcon
                        onClick={() => (props.disabled ? null : addField(item))}
                        className="basicDetails-addIconSvg"
                      />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default PeopleAndSystems;
