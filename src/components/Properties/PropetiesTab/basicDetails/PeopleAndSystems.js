import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import SearchComponent from "../../../../UI/Search Component";
import { store, useGlobalState } from "state-pool";

const PeopleAndSystems = (props) => {
  const [open, setopen] = useState(false);
  const loadedActivityPropertyData = store.getState("activityPropertyData"); //current processdata clicked
  const localProcessData = store.getState("loadedProcessData");

  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(localProcessData);
  const [peopleName, setpeopleName] = useState("");

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

  useEffect(() => {
    let temp = [
      {
        type: "Owner",
        names:
          localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo
            .genPropInfo.ownerList.length !== 0
            ? localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo.genPropInfo.ownerList.map(
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
          localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo
            .genPropInfo.consumerList.length !== 0
            ? localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo.genPropInfo.consultantList.map(
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
          localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo
            .genPropInfo.systemList.length !== 0
            ? localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo.genPropInfo.systemList.map(
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
          localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo
            .genPropInfo.providerList.length !== 0
            ? localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo.genPropInfo.providerList.map(
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
          localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo
            .genPropInfo.consumerList.length !== 0
            ? localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo.genPropInfo.consumerList.map(
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
  }, [localLoadedActivityPropertyData.ActivityProperty]);

  const [usersArray, setusersArray] = useState([
    { id: "1", userName: "Sunny", peopleName: "Sun" },
    { id: "2", userName: "Sovan", peopleName: "Sov" },
    { id: "2", userName: "Sovan", peopleName: "Sov" },
    { id: "2", userName: "Sovan", peopleName: "Sov" },
    { id: "2", userName: "Sovan", peopleName: "Sov" },
    { id: "2", userName: "Sovan", peopleName: "Sov" },
    { id: "2", userName: "Sovan", peopleName: "Sov" },
    { id: "2", userName: "Sovan", peopleName: "Sov" },
    { id: "2", userName: "Sovan", peopleName: "Sov" },
    { id: "2", userName: "Sovan", peopleName: "Sov" },
  ]);

  let { t } = useTranslation();

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
  const [typeToOpen, settypeToOpen] = useState(); //which type of field to open picklist in
  const [fieldToOpen, setfieldToOpen] = useState(); //which field to open a picklist in a type of people and systems

  const ref = React.useRef(null);
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

  const pickListHandler = (event, data, itemName) => {
    setfieldToOpen(itemName.id);
    settypeToOpen(data.type);
    setopen(true);
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

    let isAdd = true,
      payload;
    let c = 0;

    temp.forEach((item) => {
      if (item.type === data.type) {
        if (item.names[index].name !== "") {
          isAdd = false;
        }
        item.names[index].name = e.target.value;
      }
    });
    setpeopleAndSystemsArray(temp);

    let id = setTimeout(function () {
      FetchData();
    }, 5000);
    const FetchData = () => {
      if (c === 0) {
        payload = {
          processDefId: localLoadedProcessData.ProcessDefId,
          regMode: localLoadedProcessData.ProcessType,
          orderId: getOrderId(data.type),
          name: e.target.value,
          elementType: "A",
          elementId:
            localLoadedActivityPropertyData.ActivityProperty.ActivityId + "",
        };
      }
      c++;
    };

    let endpointName = isAdd
      ? `/peopleAssociation/add${data.type}`
      : `/peopleAssociation/modify${data.type}`;
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

  const detectLastKeyPress = (e) => {
    var typingTimer; //timer identifier
    var doneTypingInterval = 5000; //time in ms (5 seconds)
    let counter = 0;
    let callApi = false;
    // if (e._reactName === "onKeyUp") {
    //   clearTimeout(typingTimer);

    //   typingTimer = setTimeout(doneTyping, doneTypingInterval);

    //   //user is "finished typing," do something
    //   function doneTyping() {
    //     if (counter === 0) callApi = true;
    //   }
    //   counter++;
    // }
    return callApi;
  };

  return (
    <div style={{ marginBlock: "1rem", paddingBottom: "1rem" }}>
      <p
        style={{
          color: "#727272",
          fontSize: "0.875rem",
          fontWeight: "bolder",
          marginBottom: "0.5rem",
        }}
      >
        {props.disabled ? t("disabledPeopleAndSystems") : t("peopleAndSystems")}
      </p>

      {peopleAndSystemsArray.map((item) => {
        return (
          <div>
            <p
              style={{
                color: "#727272",
                fontSize: "0.875rem",
                fontWeight: "500",
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
                    marginBottom: "0.6rem",
                  }}
                >
                  {item.type === "Owner" || item.type === "Consultant" ? (
                    <div
                      style={{
                        height: "2.0625rem",
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
                        <p style={{ color: "#000000", fontSize: "0.9rem" }}>
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
                        <div style={{ position: "relative" }}>
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
                                  {/* <Select
                                    disableUnderline
                                    classes={{
                                      root: outlineSelectClasses.select,
                                    }}
                                    IconComponent={iconComponent}
                                    value={0}
                                  >
                                    <MenuItem value={0}>
                                      <ListItemIcon
                                        classes={{
                                          root: outlineSelectClasses.listIcon,
                                        }}
                                      >
                                        <FilterListIcon />
                                      </ListItemIcon>
                                      <span
                                        style={{
                                          marginTop: 3,
                                          marginLeft: "-0.4375rem",
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        Group By
                                      </span>
                                    </MenuItem>
                                  </Select>
                                  <Select
                                    disableUnderline
                                    classes={{
                                      root: outlineSelectClasses.select,
                                    }}
                                    IconComponent={iconComponent}
                                    value={0}
                                  >
                                    <MenuItem value={0}>
                                      <ListItemIcon
                                        classes={{
                                          root: outlineSelectClasses.listIcon,
                                        }}
                                      >
                                        <FilterListIcon />
                                      </ListItemIcon>
                                      <span
                                        style={{
                                          marginTop: 3,
                                          marginLeft: "-0.4375rem",
                                          fontSize: "0.75rem",
                                        }}
                                      >
                                        Expertise: All
                                      </span>
                                    </MenuItem>
                                  </Select> */}
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
                                            fontSize: "0.875rem",
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
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {item.type === "System" ||
                  item.type === "Consumer" ||
                  item.type === "Provider" ? (
                    <div
                      style={{
                        height: "2.0625rem",
                        display: "flex",
                        flexDirection: "row",
                        width: item.names.length > 1 ? "76%" : "87%",
                        cursor: "pointer",
                        border: "1px solid #CECECE",
                        justifyContent: "space-between",
                      }}
                    >
                      <TextField
                        InputProps={{
                          readOnly: props.disabled,
                        }}
                        key={name.id}
                        value={name.name}
                        onChange={(e) => {
                          setpeopleName(e.target.value);
                          setOtherFields(e, item, index);
                        }}
                        onKeyUp={(e) => detectLastKeyPress(e)}
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
                    <AddIcon
                      style={{
                        color: "white",
                        backgroundColor: "#0072C6",
                        height: "1.8rem",
                        width: "1.8rem",
                        marginTop: "0.125rem",
                        display: props.disabled ? "none" : "",
                      }}
                      onClick={() => (props.disabled ? null : addField(item))}
                    />
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
