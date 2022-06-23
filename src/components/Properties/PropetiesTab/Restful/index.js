import React, { useEffect, useState } from "react";
import axios from "axios";
import CommonHeader from "../../PropetiesTab/commonTabHeader";
import { connect } from "react-redux";
import { getActivityProps } from "../../../../utility/abstarctView/getActivityProps";
import { Select, MenuItem, List } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Methods from "./methods.js";
import {
  SERVER_URL,
  ENDPOINT_GET_WEBSERVICE,
  ENDPOINT_GET_EXTERNAL_METHODS,
} from "../../../../Constants/appConstants";
import { store, useGlobalState } from "state-pool";
import Mapping from "./mapping.js";
import "../Webservice/index.css";

function Restful(props) {
  const [selectedActivityIcon, setSelectedActivityIcon] = useState();
  const [methodsList, setMethodsList] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [associations, setAssociations] = useState([]);
  const [showMapping, setShowMapping] = useState(false);
  const [methodClicked, setMethodClicked] = useState(null);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);

  useEffect(() => {
    let activityProps = getActivityProps(
      props.cellActivityType,
      props.cellActivitySubType
    );
    setSelectedActivityIcon(activityProps[0]);
  }, [props.cellActivityType, props.cellActivitySubType, props.cellID]);

  useEffect(() => {
    axios
      .get(SERVER_URL + ENDPOINT_GET_WEBSERVICE + props.openProcessID)
      .then((res) => {
        let tempMethods = [];
        res?.data?.Methods?.RESTMethods.map((method) => {
          tempMethods.push(method);
        });
        setMethodsList(tempMethods);
      });
  }, []);

  useEffect(() => {
    methodsList?.map((method) => {
      localLoadedActivityPropertyData?.ActivityProperty?.restFullInfo?.assocMethodList.map(
        (el) => {
          if (el.methodIndex == method.MethodIndex) {
            setAssociations((prev) => [
              ...prev,
              {
                method: method.MethodName,
                id: method.MethodIndex,
              },
            ]);
          }
        }
      );
    });
  }, [methodsList]);

  const associateMethod = () => {
    console.log("SELECTEDMETHOD", selectedMethod);
    setAssociations((prev) => {
      let tempOne = [...prev];
      let maxId = 0;
      tempOne.forEach((t) => {
        if (t.id > maxId) {
          maxId = t.id;
        }
      });
      return [
        ...tempOne,
        {
          method: selectedMethod,
          id: maxId + 1,
        },
      ];
    });
  };

  return (
    <div>
      <CommonHeader
        activityType={props.cellActivityType}
        activitySubType={props.cellActivitySubType}
        activityName={props.cellName}
        selectedActivityIcon={selectedActivityIcon}
        showButtons={false}
        style={{ width: "98vw" }}
      />
      <hr />
      <div
        style={{
          display: "flex",
          borderRight:
            props.isDrawerExpanded && showMapping
              ? "1px solid #CECECE"
              : "none",
        }}
      >
        <div
          style={{
            borderRight: "1px solid #F4F4F4",
            width: props.isDrawerExpanded && showMapping ? "60%" : "100%",
          }}
        >
          <div style={{ padding: "5px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "15px",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#000000",
                  fontWeight: "700",
                }}
              >
                Webservice
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#0072C6",
                  fontWeight: "700",
                }}
              >
                Go To Catelog
              </p>
            </div>
            <div
              style={{
                display: props.isDrawerExpanded ? "flex" : "block",
                alignItems: props.isDrawerExpanded ? "center" : "normal",
              }}
            >
              <div style={{ marginBottom: "15px" }}>
                <p style={{ fontSize: "12px", color: "#886F6F" }}>Method</p>
                <Select
                  className="select_webService"
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  style={{
                    fontSize: "12px",
                  }}
                  value={selectedMethod}
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
                  {methodsList &&
                    methodsList.map((method) => {
                      return (
                        <MenuItem
                          key={method.MethodName}
                          value={method.MethodName}
                          style={{
                            fontSize: "12px",
                            padding: "4px",
                          }}
                        >
                          {method.MethodName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </div>
              <Button
                variant="outlined"
                style={{
                  position: "absolute",
                  right: props.isDrawerExpanded ? "45%" : "66%",
                }}
                className="associateButton_webService"
                onClick={() => associateMethod()}
              >
                Associate
              </Button>
            </div>
          </div>
          {/* ---------------------------- */}
          <div style={{ padding: "5px", marginTop: "35px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: "#000000",
                  fontWeight: "700",
                }}
              >
                Associated Webservices and Methods
              </p>
            </div>
          </div>
          <Methods
            methodsList={methodsList}
            showMapping={showMapping}
            setShowMapping={setShowMapping}
            associations={associations}
            setMethodClicked={setMethodClicked}
            isDrawerExpanded={props.isDrawerExpanded}
          />
          {/* ----------------------------------- */}
        </div>
        {props.isDrawerExpanded && showMapping ? (
          <Mapping
            completeList={methodsList}
            methodClicked={methodClicked}
            combinations={
              localLoadedActivityPropertyData?.ActivityProperty?.restFullInfo
                ?.assocMethodList
            }
          />
        ) : null}
      </div>
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
    openProcessID: state.openProcessClick.selectedId,
  };
};

export default connect(mapStateToProps, null)(Restful);
