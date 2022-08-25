import React, { useEffect } from "react";
import { store, useGlobalState } from "state-pool";

function DataObject() {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  useEffect(() => {
    let microProps = {
      source: "P", //PD_EXT

      object_type: "P", //AP/P/C
      object_id: localLoadedProcessData.ProcessDefId,
      object_name: localLoadedProcessData.ProcessName,
      auto_generate_table: true,
      parent_do: [
        {
          name: "WFINSTRUMENTTABLE",
          rel_do_id: "-1",
          relation_type: "P",
          relations: [
            {
              mapped_do_field: "ProcessInstanceID",
              base_do_field: "mapid",
              base_do_field_id: 0,
            },
          ],
          status: 4,
        },
      ],
      default_data_fields: [
        {
          name: "mapid",
          alias: "mapid",
          type: "1",
          key_field: true,
          id: 0,
        },
      ],

      //"1" = String, "2" = Integer, "3" = Long, "4" = Float,"5" =Date and Time,"6" = Binary Data, "7" = Currency, "8" = Boolean,"9" = ShortDate, "10" = Ntext, "11" = Text, "12" = Nvarchar,"13" = Phone Number,"14" =Email.Binary,

      ContainerId: "data_object_mf_conatiner",
      Module: "MDM",

      Component: "DataModelListViewer",

      InFrame: false,

      Renderer: "renderDataModelListViewer",

      Callback: null,

      data_types: [1, 2, 3, 4, 5, 8, 9, 10],
    };

    window.MdmDataModel(microProps);
  }, []);
  return (
    <div style={{ width: "100%", height: "79vh" }}>
      <div id="data_object_mf_conatiner"></div>
    </div>
  );
}

export default DataObject;
