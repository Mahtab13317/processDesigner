import { Button } from '@material-ui/core'
import React from 'react'
import Attachment from '../../Properties/PropetiesTab/Attachment/Attachment'

function AttachmentRequirement() {

  const saveData=()=>{

  }


  const getPayload=(data)=>{
console.log("payload",data)
  }
  return (
    <>
      <Attachment ignoreSpinner={true} RAPayload={getPayload} />
      <div style={{float:"right",margin:"1rem"}}><Button style={{background:"#0072c5",color:"#ffffff"}} variant="contained" onClick={saveData}>Save Attachment</Button></div>
    </>
  )
}

export default AttachmentRequirement