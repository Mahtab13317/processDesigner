import { Button } from '@material-ui/core'
import axios from 'axios'
import React, { useState } from 'react'
import { store, useGlobalState } from 'state-pool';
import { ENDPOINT_SAVE_ATTACHMENT, SERVER_URL } from '../../../Constants/appConstants';
import Toast from '../../../UI/ErrorToast';
import AttachmentReq from '../../Properties/PropetiesTab/Attachment/AttachmentReq';




function AttachmentRequirement() {

  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setLocalLoadedProcessData] =
    useGlobalState(loadedProcessData);

  const [attachList, setAttachList] = useState(null);
  const [isError, setIsError] = useState({
    valid: false,
    msg: "",
    severity: "",
  });

  const saveData=()=>{
      

      const postData = {
        processDefId:localLoadedProcessData?.ProcessDefId,
        processState:localLoadedProcessData?.ProcessType,
        attachmentList:attachList
        
      };

      
      axios
        .post(
        
         SERVER_URL +
         ENDPOINT_SAVE_ATTACHMENT ,
          postData
        )
        .then((res) => {
        console.log("mahtab resonse",res)
        if(res.data.Status==0 && res.data.Message=="Attachment saved")
        {
          setIsError({
            valid: true,
            msg: res.data.Message,
            severity: "warning",
          });
        }
        })
        .catch((err) => {
          console.log("AXIOS ERROR: ", err);
        });
 
    
  }


  const getPayload=(data)=>{
   //console.log("payload",data)
   //const tempAttachList=[...attachList,data];
   const newArr=data.map((item)=>{
return {
  
            docId: item.docId,
            docName: item.docName,
            requirementId: item.reqId,
            sAttachName: item.sAttachName,
            sAttachType: item.sAttachType,
            status: item.status
}
   })
   setAttachList(data)
  }
  return (
    <>
       {isError.valid === true ? (
      
          <Toast
            open={isError.valid != false}
            closeToast={() => setIsError({ ...isError, valid: false })}
            message={isError.msg}
            severity={isError.severity}
          />
        ) : null}

     
      <AttachmentReq ignoreSpinner={true} RAPayload={getPayload} />
      <div style={{float:"right",margin:"1rem"}}><Button style={{background:"var(--button_color)",color:"#ffffff"}} variant="contained" onClick={saveData}>Save Attachment</Button></div>
    </>
  )
}

export default AttachmentRequirement