import {
  TRIGGER_CONSTANT,
  TRIGGER_TYPE_CHILDWORKITEM,
  TRIGGER_TYPE_DATAENTRY,
  TRIGGER_TYPE_EXCEPTION,
  TRIGGER_TYPE_EXECUTE,
  TRIGGER_TYPE_GENERATERESPONSE,
  TRIGGER_TYPE_LAUNCHAPP,
  TRIGGER_TYPE_MAIL,
  TRIGGER_TYPE_SET,
} from "../../../Constants/triggerConstants";

export function getTriggerPropObj(trigger, values) {
  let jsonPropertiesObject;
  let localProps;

  if (trigger === TRIGGER_TYPE_MAIL) {
    let newObj = {};
    if (!values.isFromConst) {
      newObj = {
        ...newObj,
        fromUser: values.from.VariableName,
        variableIdFrom: values.from.VariableId,
        varFieldIdFrom: values.from.VarFieldId,
        varFieldTypeFrom: values.from.VariableScope,
        extObjIDFrom: values.from.ExtObjectId,
      };
    } else {
      newObj = {
        ...newObj,
        fromUser: values.from,
        variableIdFrom: "0",
        varFieldIdFrom: "0",
        varFieldTypeFrom: TRIGGER_CONSTANT,
        extObjIDFrom: "0",
      };
    }
    if (!values.isToConst) {
      newObj = {
        ...newObj,
        toUser: values.to.VariableName,
        variableIdTo: values.to.VariableId,
        varFieldIdTo: values.to.VarFieldId,
        varFieldTypeTo: values.to.VariableScope,
        extObjIDTo: values.to.ExtObjectId,
      };
    } else {
      newObj = {
        ...newObj,
        toUser: values.to,
        variableIdTo: "0",
        varFieldIdTo: "0",
        varFieldTypeTo: TRIGGER_CONSTANT,
        extObjIDTo: "0",
      };
    }
    if (!values.isCConst) {
      newObj = {
        ...newObj,
        ccUser: values.cc ? values.cc.VariableName : "",
        variableIdCC: values.cc ? values.cc.VariableId : "0",
        varFieldIdCC: values.cc ? values.cc.VarFieldId : "0",
        varFieldTypeCC: values.cc ? values.cc.VariableScope : TRIGGER_CONSTANT,
        extObjIDCC: values.cc ? values.cc.ExtObjectId : "0",
      };
    } else {
      newObj = {
        ...newObj,
        ccUser: values.cc,
        variableIdCC: "0",
        varFieldIdCC: "0",
        varFieldTypeCC: TRIGGER_CONSTANT,
        extObjIDCC: "0",
      };
    }
    if (!values.isBccConst) {
      newObj = {
        ...newObj,
        bccUser: values.bcc ? values.bcc.VariableName : "",
        variableIdBCC: values.bcc ? values.bcc.VariableId : "0",
        varFieldIdBCC: values.bcc ? values.bcc.VarFieldId : "0",
        varFieldTypeBCC: values.bcc
          ? values.bcc.VariableScope
          : TRIGGER_CONSTANT,
        extObjIDBCC: values.bcc ? values.bcc.ExtObjectId : "0",
      };
    } else {
      newObj = {
        ...newObj,
        bccUser: values.bcc,
        variableIdBCC: "0",
        varFieldIdBCC: "0",
        varFieldTypeBCC: TRIGGER_CONSTANT,
        extObjIDBCC: "0",
      };
    }
    newObj = {
      ...newObj,
      priority: values.priority ? values.priority : "",
      variableIdPriority: "0",
      varFieldIdPriority: "0",
      varFieldTypePriority: TRIGGER_CONSTANT,
      extObjIDPriority: "0",
      subject: values.subjectValue,
      message: values.mailBodyValue,
    };
    jsonPropertiesObject = {
      mailTrigProp: {
        mailInfo: newObj,
      },
    };
    localProps = [
      {
        BCCType: values.isBccConst
          ? TRIGGER_CONSTANT
          : values.bcc
          ? values.bcc.VariableScope
          : TRIGGER_CONSTANT,
        BCCUser: values.isBccConst
          ? values.bcc
          : values.bcc
          ? values.bcc.VariableName
          : "",
        CCUser: values.isCConst
          ? values.cc
          : values.cc
          ? values.cc.VariableName
          : "",
        CCUserType: values.isCConst
          ? TRIGGER_CONSTANT
          : values.cc
          ? values.cc.VariableScope
          : TRIGGER_CONSTANT,
        ExtObjIDBCC: values.isBccConst
          ? "0"
          : values.bcc
          ? values.bcc.ExtObjectId
          : "0",
        ExtObjIDCCUser: values.isCConst
          ? "0"
          : values.cc
          ? values.cc.ExtObjectId
          : "0",
        ExtObjIDFromUser: values.isFromConst ? "0" : values.from.ExtObjectId,
        ExtObjIDToUser: values.isToConst ? "0" : values.to.ExtObjectId,
        ExtObjIdMailPriority: "0",
        FromUser: values.isFromConst ? values.from : values.from.VariableName,
        FromUserType: values.isFromConst
          ? TRIGGER_CONSTANT
          : values.from.VariableScope,
        MailPriority: values.priority ? values.priority : "",
        MailPriorityType: TRIGGER_CONSTANT,
        Message: values.mailBodyValue,
        Subject: values.subjectValue,
        ToUser: values.isToConst ? values.to : values.to.VariableName,
        ToUserType: values.isToConst
          ? TRIGGER_CONSTANT
          : values.to.VariableScope,
        VarFieldIdBCC: values.isBccConst
          ? "0"
          : values.bcc
          ? values.bcc.VarFieldId
          : "0",
        VarFieldIdCC: values.isCConst
          ? "0"
          : values.cc
          ? values.cc.VarFieldId
          : "0",
        VarFieldIdFrom: values.isFromConst ? "0" : values.from.VarFieldId,
        VarFieldIdMailPriority: "0",
        VarFieldIdTo: values.isToConst ? "0" : values.to.VarFieldId,
        VariableIdBCC: values.isBccConst
          ? "0"
          : values.bcc
          ? values.bcc.VariableId
          : "0",
        VariableIdCC: values.isCConst
          ? "0"
          : values.cc
          ? values.cc.VariableId
          : "0",
        VariableIdFrom: values.isFromConst ? "0" : values.from.VariableId,
        VariableIdMailPriority: "0",
        VariableIdTo: values.isToConst ? "0" : values.to.VariableId,
      },
    ];
  } else if (trigger === TRIGGER_TYPE_EXECUTE) {
    jsonPropertiesObject = {
      execTrigProp: {
        functionName: values.funcName,
        srvExecutable: values.serverExecutable,
        argString: values.argString,
      },
    };
    localProps = [
      {
        ArgList: values.argString,
        FunctionName: values.funcName,
        ServerExecutable: values.serverExecutable,
      },
    ];
  } else if (trigger === TRIGGER_TYPE_LAUNCHAPP) {
    jsonPropertiesObject = {
      laTrigProp: {
        appName: values.appName,
        argString: values.argumentStrValue,
      },
    };
    localProps = [{ name: values.appName, ArgList: values.argumentStrValue }];
  } else if (trigger === TRIGGER_TYPE_DATAENTRY) {
    let newObj = {};
    values &&
      values.forEach((eachVal, index) => {
        newObj = {
          ...newObj,
          [`${index + 1}`]: {
            varName: eachVal.VariableName,
            varScope: eachVal.VariableScope,
            extObjId: eachVal.ExtObjectId,
            variableId: eachVal.VariableId,
            varFieldId: eachVal.VarFieldId,
          },
        };
      });
    jsonPropertiesObject = {
      deTrigProp: {
        deTrigVarMap: newObj,
      },
    };
    localProps =
      values &&
      values.map((eachVal) => {
        return {
          VariableName: eachVal.VariableName,
        };
      });
  } else if (trigger === TRIGGER_TYPE_SET) {
    let arr =
      values &&
      values.map((eachVal) => {
        return {
          param1: eachVal.field.VariableName,
          extObjID1: eachVal.field.ExtObjectId,
          variableId_1: eachVal.field.VariableId,
          varFieldId_1: eachVal.field.VarFieldId,
          varScope1: eachVal.field.VariableScope,
          param2: eachVal.value.VariableName,
          extObjID2: eachVal.value.ExtObjectId,
          variableId_2: eachVal.value.VariableId,
          varFieldId_2: eachVal.value.VarFieldId,
          varScope2: eachVal.value.VariableScope,
        };
      });
    jsonPropertiesObject = {
      setTrigProp: {
        setVarList: arr,
      },
    };
    let arr1 =
      values &&
      values.map((eachVal) => {
        return {
          Param1: eachVal.field.VariableName,
          Param2: eachVal.value.VariableName,
        };
      });
    localProps = arr1;
  } else if (trigger === TRIGGER_TYPE_GENERATERESPONSE) {
    jsonPropertiesObject = {
      grTrigProp: {
        fileName: values.fileName,
        docInfo: {
          docTypeName: values.docTypeName,
          docTypeId: values.docTypeId,
        },
      },
    };
    localProps = [{ DocType: values.docTypeName, FileName: values.fileName }];
  } else if (trigger === TRIGGER_TYPE_EXCEPTION) {
    jsonPropertiesObject = {
      expTrigProp: {
        expTypeName: values.exceptionName,
        expTypeId: values.exceptionId,
        attribute: values.attribute,
        comment: values.comment,
      },
    };

    localProps = [
      {
        Attribute: values.attribute,
        Comment: values.comment,
        ExceptionId: values.exceptionId,
        ExceptionName: values.exceptionName,
      },
    ];
  } else if (trigger === TRIGGER_TYPE_CHILDWORKITEM) {
    let arr =
      values.list &&
      values.list.map((eachVal) => {
        return {
          param1: eachVal.field.VariableName,
          extObjID1: eachVal.field.ExtObjectId,
          variableId_1: eachVal.field.VariableId,
          varFieldId_1: eachVal.field.VarFieldId,
          varScope1: eachVal.field.VariableScope,
          param2: eachVal.value.VariableName,
          extObjID2: eachVal.value.ExtObjectId,
          variableId_2: eachVal.value.VariableId,
          varFieldId_2: eachVal.value.VarFieldId,
          varScope2: eachVal.value.VariableScope,
        };
      });
    jsonPropertiesObject = {
      ccwTrigProp: {
        m_strAssociatedWS: values.m_strAssociatedWS,
        type: values.type,
        generateSameParent: values.generateSameParent,
        variableId: values.variableId,
        varFieldId: values.varFieldId,
        ccwVarList: arr,
      },
    };

    localProps = [
      {
        Param1: values.list[0].field.VariableName,
        ExtObjID1: values.list[0].field.ExtObjectId,
        VariableId_1: values.list[0].field.VariableId,
        VarFieldId_1: values.list[0].field.VarFieldId,
        Type1: values.list[0].field.VariableScope,
        Param2: values.list[0].value.VariableName,
        ExtObjID2: values.list[0].value.ExtObjectId,
        VariableId_2: values.list[0].value.VariableId,
        VarFieldId_2: values.list[0].value.VarFieldId,
        Type2: values.list[0].value.VariableScope,
      },
      {
        GenerateSameParent: values.generateSameParent,
        Type: values.type,
        VarFieldId: values.variableId,
        VariableId: values.varFieldId,
        WorkstepName: values.m_strAssociatedWS,
      },
    ];
  }

  return [jsonPropertiesObject, localProps];
}
