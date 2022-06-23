import { Checkbox } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { store, useGlobalState } from "state-pool";

function soapParams(props) {
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);
  const [Params, setParams] = useState([
    {
      bParamSelected: false,
      dataStructId: "2",
      mapField: "DBExErrDesc1",
      mapFieldType: "M",
      mapVarFieldId: "0",
      mapVariableId: "10026",
      paramIndex: "1",
      selectedVar: "DBExErrDesc",
    },
    {
      bParamSelected: false,
      dataStructId: "2",
      mapField: "DBExErrDesc2",
      mapFieldType: "M",
      mapVarFieldId: "0",
      mapVariableId: "10026",
      paramIndex: "1",
      selectedVar: "DBExErrDesc",
    },
    {
      bParamSelected: false,
      dataStructId: "2",
      mapField: "DBExErrDesc3",
      mapFieldType: "M",
      mapVarFieldId: "0",
      mapVariableId: "10026",
      paramIndex: "1",
      selectedVar: "DBExErrDesc",
    },
  ]);

  const handleCheckChange = (para, checkValue) => {
    console.log("CHOTU", para, checkValue);
    let temp = Params;
    temp.map((t) => {
      if (t.mapField == para.mapField) {
        t.bParamSelected = !checkValue;
      }
    });
    setParams(temp);
  };

  const addParamsToList = () => {
    console.log(
      "DOOSRA",
      localLoadedActivityPropertyData?.ActivityProperty?.webserviceInfo
        ?.objWebServiceDataInfo
    );
    let tempInfo = localLoadedActivityPropertyData;
    let temp =
    tempInfo?.ActivityProperty?.webserviceInfo
        ?.objWebServiceDataInfo;

    let selectedParams = [];
    Params.map((para) => {
      if (para.bParamSelected) {
        selectedParams.push(para);
      }
    });

    temp.map((t) => {
      if (t.webserviceName == props.serviceNameClicked) {
        t.fwdParamMapList.push(...selectedParams);
      }
    });

    setlocalLoadedActivityPropertyData(tempInfo);
    props.setShowSOAPParamsModal(false);
  };

  //   <button onClick={()=> addParamsToList()}>Add Param</button>

  return (
    <div>
      {Params.map((para) => {
        return (
          <div style={{ display: "flex" }}>
            <Checkbox
              checked={para.bParamSelected}
              onChange={(e) => handleCheckChange(para, para.bParamSelected)}
            />
            <p>{para.mapField}</p>
          </div>
        );
      })}
      <button onClick={() => addParamsToList()}>Add Param</button>
    </div>
  );
}

export default soapParams;
