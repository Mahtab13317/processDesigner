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
import { getVariableById, getVariableByName } from "./triggerCommonFunctions";

export function getSelectedTriggerProperties(trigger, values, variables) {
  let propertiesObject;

  if (trigger === TRIGGER_TYPE_MAIL) {
    let from =
      values[0].FromUserType === TRIGGER_CONSTANT
        ? values[0].FromUser
        : getVariableById(values[0].VariableIdFrom, variables);
    let isFromConst = values[0].FromUserType === TRIGGER_CONSTANT;
    let to =
      values[0].ToUserType === TRIGGER_CONSTANT
        ? values[0].ToUser
        : getVariableById(values[0].VariableIdTo, variables);
    let isToConst = values[0].ToUserType === TRIGGER_CONSTANT;
    let cc =
      values[0].CCUserType === TRIGGER_CONSTANT
        ? values[0].CCUser
        : getVariableById(values[0].VariableIdCC, variables);
    let isCConst = values[0].CCUserType === TRIGGER_CONSTANT;
    let bcc =
      values[0].BCCUserType === TRIGGER_CONSTANT
        ? values[0].BCCUser
        : getVariableById(values[0].VariableIdBCC, variables);
    let isBccConst = values[0].BCCUserType === TRIGGER_CONSTANT;
    let priority = values[0].MailPriority;
    let subjectValue = values[0].Subject;
    let mailBodyValue = values[0].Message;

    propertiesObject = {
      from,
      isFromConst,
      to,
      isToConst,
      cc,
      isCConst,
      bcc,
      isBccConst,
      priority,
      subjectValue,
      mailBodyValue,
    };
  } else if (trigger === TRIGGER_TYPE_EXECUTE) {
    let funcName = values[0].FunctionName;
    let serverExecutable = values[0].ServerExecutable;
    let argString = values[0].ArgList;
    propertiesObject = { funcName, serverExecutable, argString };
  } else if (trigger === TRIGGER_TYPE_LAUNCHAPP) {
    let appName = values[0].name;
    let argumentStrValue = values[0].ArgList;
    propertiesObject = { appName, argumentStrValue };
  } else if (trigger === TRIGGER_TYPE_DATAENTRY) {
    propertiesObject =
      values &&
      values.map((data) => {
        return getVariableByName(data.VariableName, variables);
      });
  } else if (trigger === TRIGGER_TYPE_SET) {
    propertiesObject =
      values &&
      values.map((data, index) => {
        let field = getVariableByName(data.Param1, variables);
        let value =
          data.Type2 !== TRIGGER_CONSTANT
            ? getVariableByName(data.Param2, variables)
            : {
                VariableName: data.Param2,
                constant: true,
              };
        return { id: index + 1, field: field, value: value };
      });
  } else if (trigger === TRIGGER_TYPE_GENERATERESPONSE) {
    let fileId = "";
    let fileName = values[0].FileName;
    let docTypeName = values[0].DocType;
    let docTypeId = "";
    propertiesObject = { fileId, fileName, docTypeName, docTypeId };
  } else if (trigger === TRIGGER_TYPE_EXCEPTION) {
    let exceptionName = values[0].ExceptionName;
    let exceptionId = values[0].ExceptionId;
    let attribute = values[0].Attribute;
    let comment = values[0].Comment;
    propertiesObject = { exceptionId, exceptionName, attribute, comment };
  } else if (trigger === TRIGGER_TYPE_CHILDWORKITEM) {
    let m_strAssociatedWS = values[1].WorkstepName;
    let type = values[1].Type;
    let generateSameParent = values[1].GenerateSameParent;
    let variableId = values[1].VariableId;
    let varFieldId = values[1].VarFieldId;
    let list = [
      {
        id: 1,
        field: getVariableByName(values[0].Param1, variables),
        value:
          values[0].Type2 !== TRIGGER_CONSTANT
            ? getVariableByName(values[0].Param2, variables)
            : {
                VariableName: values[0].Param2,
                constant: true,
              },
      },
    ];
    propertiesObject = {
      m_strAssociatedWS,
      type,
      generateSameParent,
      variableId,
      varFieldId,
      list,
    };
  }

  return propertiesObject;
}
