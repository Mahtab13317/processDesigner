import { style  } from "../../Constants/bpmnView";

// const mxgraphobj = require("mxgraph")({
//     mxImageBasePath: "mxgraph/javascript/src/images",
//     mxBasePath: "mxgraph/javascript/src"
// });

//return true if that activity/tool is allowed to drop outside milestone
export const isAllowedOutsideMilestone = (activityStyleName) => {
    return false;
    
    // switch(activityStyleName){
    //     case style.textAnnotations : 
    //         return true;
    //     case style.message : 
    //         return true;
    //     case style.dataObject : 
    //         return true;
    //     default : 
    //         return false;
    // }

}

export const dropDirectltyToGraphGlobally = (activityStyleName) => {
    return false;

    // switch(activityStyleName){
    //     case style.textAnnotations : 
    //         return true;
    //     case style.message : 
    //         return true;
    //     case style.dataObject : 
    //         return true;
    //     case style.groupBox : 
    //         return true;
    //     default : 
    //         return false;
    // }
}

