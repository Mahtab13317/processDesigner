import React, { useState, useEffect } from "react";
import { Select, MenuItem, List } from "@material-ui/core";
import "./index.css";
import { Tab, Tabs } from "@material-ui/core";
import { TabPanel } from "../../../ProcessSettings";
import ReusableOneMap from "./reusableOneMap.js";
import { store, useGlobalState } from "state-pool";

function Mapping(props) {
  // const [invocationType, setInvocationType] = useState(null);
  const [value, setValue] = useState(0); // Function to handle tab change.
  const [forwardMappingList, setForwardMappingList] = useState([]);
  const [reverseMappingList, setReverseMappingList] = useState([]);
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);

  useEffect(() => {
    // props.completeList.map((list) => {
    //   if (list.MethodIndex == props.methodClicked.id) {
    //     let temp = list?.RequestBodyParameters?.NestedReqComplexType;
    //     setForwardMappingList(temp);
    //   }
    // });
    console.log(
      "RASGULLA",
      localLoadedActivityPropertyData?.ActivityProperty?.restFullInfo
        ?.assocMethodList,
      props.methodClicked,
      props.completeList
    );
  }, [props.methodClicked, props.completeList]);

  const handleForwardFieldMapping = (selectedValue, list, indexInput) => {
    console.log("BAKWAS_FORWARD", selectedValue, list, indexInput);
  };

  const handleReverseFieldMapping = (selectedValue, list, indexInput) => {
    console.log("BAKWAS_REVERSE", selectedValue, list, indexInput);
  };

  // useEffect(() => {
  //   props.combinations.map((one) => {
  //     if (one.methodIndex == props.methodClicked.id) {
  //       setForwardMappingList(
  //         one.mappingInfoList.filter((info) => {
  //           return info.mappingType == "F";
  //         })
  //       );
  //       setReverseMappingList(
  //         one.mappingInfoList.filter((info) => {
  //           return info.mappingType == "R";
  //         })
  //       );
  //     }
  //   });
  // }, [props.methodClicked]);


  useEffect(() => {
    setForwardMappingList(props.completeList.filter(el=> {return el.MethodIndex == props.methodClicked.id} )[0]?.RequestBodyParameters?.NestedReqComplexType);
    console.log('HELL', props.completeList.filter(el=> {return el.MethodIndex == props.methodClicked.id} )[0]?.RequestBodyParameters?.NestedReqComplexType);
  }, [props.methodClicked])
  
  return (
    <div style={{ padding: "20px", width: "55%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ fontSize: "12px", color: "#886F6F" }}>Time Out</p>
          <Select
            className="select_webService_mapping"
            // onChange={(e) => setInvocationType(e.target.value)}
            value="10(s)"
            style={{
              fontSize: "12px",
              width: "76px",
              height: "28px",
              border: "1px solid #C4C4C4",
              borderRadius: "2px",
            }}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },
              getContentAnchorEl: null,
            }}
          >
            <MenuItem
              style={{
                fontSize: "12px",
                padding: "4px",
              }}
              value="Fire And Forget"
            >
              10(s)
            </MenuItem>
          </Select>
        </div>
      </div>

      <div className="tabStyles ">
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ style: { background: "#0072C5" } }}
        >
          <Tab className={value === 0 && "tabLabel"} label="Forward Mapping" />
          <Tab className={value === 1 && "tabLabel"} label="Reverse Mapping" />
        </Tabs>
      </div>
      <div className="tabPanelStyles">
        <TabPanel value={value} index={0}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                marginTop: "20px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  height: "30px",
                  width: "220px",
                  backgroundColor: "#F4F4F4",
                  marginRight: "30px",
                  fontSize: "12px",
                  padding: "7px",
                }}
              >
                REST Input Parameters
              </div>
              <div
                style={{
                  height: "30px",
                  width: "220px",
                  backgroundColor: "#F4F4F4",
                  fontSize: "12px",
                  padding: "7px",
                }}
              >
                Current Process Variable(s)
              </div>
            </div>
            {forwardMappingList?.map((list) => {
              return (
                <ReusableOneMap
                  mapField={list.ParamName}
                  dropDownOptions={localLoadedProcessData?.Variable}
                  dropDownKey="VariableName"
                  methodClicked={props.methodClicked}
                  methodIndex = {props.completeList.filter(el=> {return el.MethodIndex == props.methodClicked.id} )[0].MethodIndex}
                  // varField={list.varName}
                  // handleFieldMapping={(val) =>
                  //   handleForwardFieldMapping(val, list, index)
                  // }
                />
              );
            })}
          </div>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                marginTop: "20px",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  height: "30px",
                  width: "220px",
                  backgroundColor: "#F4F4F4",
                  marginRight: "30px",
                  fontSize: "12px",
                  padding: "7px",
                }}
              >
                SOAP Input Parameters
              </div>
              <div
                style={{
                  height: "30px",
                  width: "220px",
                  backgroundColor: "#F4F4F4",
                  fontSize: "12px",
                  padding: "7px",
                }}
              >
                Current Process Variable(s)
              </div>
            </div>
            {/* {reverseMappingList.map((list) => {
              return (
                <ReusableOneMap
                  mapField={list.parameterName}
                  dropDownKey="fieldName"
                  varField={list.varName}
                  handleFieldMapping={(val) =>
                    handleReverseFieldMapping(val, list, index)
                  }
                  dropDownOptions={list?.mappingInfoList?.filter((el) => {
                    return el.mappingType == "R";
                  })}
                />
              );
            })} */}
          </div>
        </TabPanel>
      </div>
    </div>
  );
}

export default Mapping;
