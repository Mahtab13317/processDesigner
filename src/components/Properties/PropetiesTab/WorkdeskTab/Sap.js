import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./sap.module.css";
import { Select, MenuItem, Checkbox, TextField, Button } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { store, useGlobalState } from "state-pool";
import AddToDo from "../../../ViewingArea/Tools/ToDo/AddToDo";
import Modal from "@material-ui/core/Modal";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { setActivityPropertyChange } from "../../../../redux-store/slices/ActivityPropertyChangeSlice";
import {
  ActivityPropertySaveCancelValue,
  setSave,
} from "../../../../redux-store/slices/ActivityPropertySaveCancelClicked.js";
import axios from "axios";
import { SERVER_URL, RTL_DIRECTION, STATE_CREATED, STATE_ADDED } from "../../../../Constants/appConstants";
import arabicStyles from "./ArabicStyles.module.css";
import CustomizedDropdown from "../../../../UI/Components_With_ErrrorHandling/Dropdown";
import "./index.css";
import CommonListItem from "../../../MainView/ProcessesView/Settings/ServiceCatalog/Common Components/CommonListItem";
import TextInput from "../../../../UI/Components_With_ErrrorHandling/InputField";


function Sap(props) {

  const menuProps = {
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "left",
    },
    transformOrigin: {
      vertical: "top",
      horizontal: "left",
    },
    style: {
      maxHeight: 400,
    },
    getContentAnchorEl: null,
  };


  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const loadedActivityPropertyData = store.getState("activityPropertyData");
  const [localLoadedActivityPropertyData, setlocalLoadedActivityPropertyData] =
    useGlobalState(loadedActivityPropertyData);

  

  const [associatedDefList, setAssociatedDefList] = useState(
    [
      {
        DefinitionID:1,
        DefinitionName:"New",
        status: STATE_ADDED
      },
      {
        DefinitionID:3,
        DefinitionName:"Testing",
        status: STATE_ADDED
      },
      {
        DefinitionID:4,
        DefinitionName:"Testing2",
        status: STATE_ADDED
      }
    ]
  )


  const [sapAdapter,setSapAdapter]=useState(true);
  
  const [configList, setConfigList] = useState([]);

  const [defList, setDefList] = useState([]);

  const [selectedConfig, setSelectedConfig] = useState(null)
  
  const [selectedDef, setSelectedDef] = useState(null);

  const [tCode, setTCode] = useState(null)

  const [tCodeList, setTCodeList] = useState([]);

  const [selectedTcode, setSelectedTcode] = useState(null)

  const [defName, setDefName] = useState(null);

  const [mappingList, setMappingList] = useState([])


useEffect(() => {

const tempconfig=[...configList,
  {configID:1,configName:"sapConfig"},
  {configID:2,configName:"testConfig"},
  {configID:3,configName:"newConfig"}
]
  setConfigList(tempconfig);


  const tempDef=[...defList,
    {
      DefinitionID:1,
      DefinitionName:"New",
      status: STATE_ADDED
    },
    {
      DefinitionID:3,
      DefinitionName:"Testing",
      status: STATE_ADDED
    },
    {
      DefinitionID:4,
      DefinitionName:"Testing2",
      status: STATE_ADDED
    }
  ]
setDefList(tempDef)


setSelectedConfig(tempconfig[1].configID);
setSelectedDef(tempDef[1].DefinitionID);
setTCode("TCode");

const temptcodeList=[...tCodeList,
  {id:1,tcodeName:"tcode1"},
  {id:2,tcodeName:"tcode2"},
  {id:3,tcodeName:"tcode3"}
];

setTCodeList(temptcodeList)

setSelectedTcode(temptcodeList[0].tcodeName);



 
}, [])

  

  


  //function to create a new element of definition
  const addNewHandler = () => {
    
   
   let temp = [...associatedDefList];
   let indexVal;
  
   let maxId = parseInt(temp[temp.length-1].DefinitionID) + 1;
   //to remove existing temporary SAP from list, before adding new temporary SAP
   temp?.forEach((webS, index) => {
    if (webS.status && webS.status === STATE_CREATED) {
      indexVal = index;
    }
  });
  if (indexVal >= 0) {
    temp.splice(indexVal, 1);
  }

   temp.splice(0, 0, {
     DefinitionName: t("toolbox.workdeskSap.newDef"),
     DefinitionID: maxId,
     status: STATE_CREATED
   });
   setSelectedDef(temp[0]);
   //setfunctionList(temp);
   setAssociatedDefList(temp[0])
   
  };

  const changeDefName=(e)=>{
      setDefName(e.target.value)
  }

  return (
    <React.Fragment>
      <div className="row sapContainer">
        <div className={styles.leftPannel}>
          <div className="row">
            <h5>{t("associateDefi")}</h5>
            <button
              className={styles.addButton}
              id="AddAssociate"
              onClick={addNewHandler}
            >
              {t("addNew")}
            </button>
          </div>
          {associatedDefList.map((data) => {
           // return <div className={styles.definationList}>{e}</div>;
           return <CommonListItem
              itemName={data.DefinitionName}
             
              isSelected={selectedDef?.DefinitionID === data.DefinitionID}
              
            />;
          })}
        </div>
       
        <div className={styles.rightPannel}>
          <h5>{t("newDefinition")}</h5>
          <div className={styles.checklist}>
            <Checkbox
                 checked={sapAdapter}
              // onChange={() => CheckExceptionHandler()}
              className={styles.checkBoxCommon}
            />
            {t("sapAdapter")}
          </div>
          <div className="row">
            <div>
              <p className={styles.labelTittle}>{t("sapConfig")}</p>
              <p>
              <CustomizedDropdown
                id="SAP_Config"
               
                //   onChange={(event) => setselectedInputFormat(event.target.value)}
                className={styles.dropdown}
                MenuProps={menuProps}
                isNotMandatory={true}
                value={selectedConfig}
              >
                {
                  configList?.map((data,i)=>(
                    <MenuItem value={data.configID}>{data.configName}</MenuItem>
                  ))
                }
              </CustomizedDropdown>
              </p>
             
            </div>

            <div>
              <p className={styles.labelTittle}>{t("definedDefination")}</p>
              <p style={{display:"flex"}}>
              <CustomizedDropdown
                id="SAP_Adapter_Dropdown"
               
                //   onChange={(event) => setselectedInputFormat(event.target.value)}
                className={styles.dropdown}
                MenuProps={menuProps}
                isNotMandatory={true}
                value={selectedDef}
              >
                {
                  defList?.map((data,i)=>(
                    <MenuItem value={data.DefinitionID}>{data.DefinitionName}</MenuItem>
                  ))
                }
              </CustomizedDropdown>
              <Button variant="contained" className={styles.addBtn} id="addDef">+</Button>
              </p>
              
            </div>

            <div>
              <p className={styles.labelTittle}>{t("saptCode")}</p>
              <p>
              <TextInput
           
           classTag={styles.outlinedBasic}
           inputValue={tCode}
           name="tcode"
           idTag="tcode"
           readOnlyCondition={true}
         />
              </p>
              
            </div>
          </div>
          <div className="row defSection">
          <div>
            <p className={styles.labelTittle}>{t("toolbox.workdeskSap.defName")}</p>
            <p>
            <TextInput
           
           classTag={styles.outlinedSapDef}
           inputValue={defName}
           name="defName"
           idTag="defName"
           onChangeEvent={changeDefName}
         />
            </p>
          </div>
          <div>
            <p className={styles.labelTittle}>{t("toolbox.workdeskSap.sapTcode")}</p>
            <p>
            <CustomizedDropdown
                id="SAP_Tcode_Dropdown"
               
                //   onChange={(event) => setselectedInputFormat(event.target.value)}
                className={styles.dropdown}
                MenuProps={menuProps}
                isNotMandatory={true}
                value={selectedTcode}
              >
                {
                  tCodeList?.map((data,i)=>(
                    <MenuItem value={data.tcodeName}>{data.tcodeName}</MenuItem>
                  ))
                }
              </CustomizedDropdown>
            </p>
          </div>
          <div>
            <p></p>
            <p style={{position:"relative",top:"15px"}}>
            <Button
                  id="mapData"
                  className={styles.btnSap}
                  variant="outlined"
                  size="small"
                 
                >
                  {t("toolbox.workdeskSap.mapping")}
                </Button>
            </p>
          </div>
          <div style={{display:"flex",gap:"20px",position:"relative",top:"15px"}}>
            <p>
            <Button
                  id="discard"
                  className={styles.discard}
                  variant="outlined"
                  size="small"
                 
                >
                  {t("toolbox.workdeskSap.discard")}
                </Button>
            </p>
            <p><Button variant="contained" className={styles.addBtn} id="save" size="small">{t("toolbox.workdeskSap.save")}</Button></p>
          </div>

          </div>

          <h5 style={{ marginTop: "1rem" }}>{t("definedMapping")}</h5>
          <div className={styles.mappingListSection}>
          <table className={styles.mappingTable}>
                <thead>
                  <tr>
                    <th>{t("toolbox.workdeskSap.sapFieldName")}</th>
                    <th>{t("toolbox.workdeskSap.name")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Sap;
