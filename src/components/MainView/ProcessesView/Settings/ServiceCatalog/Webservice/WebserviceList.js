import React from "react";
import styles from "./index.module.css";
import CommonListItem from "../Common Components/CommonListItem";
import {
  GLOBAL_SCOPE,
  WEBSERVICE_SOAP,
} from "../../../../../../Constants/appConstants";

function WebserviceList(props) {
  let { list, selected, selectionFunc, scope } = props;

  return (
    <div
      className={styles.webS_ListDiv}
      style={{
        height:
          scope === GLOBAL_SCOPE
            ? "26rem"
            : props.callLocation === "webServicePropTab"
            ? "19rem"
            : "24rem",
      }}
    >
      {list?.map((item) => {
        return (
          <React.Fragment>
            {item.webserviceType === WEBSERVICE_SOAP ? (
              <CommonListItem
                itemName={item.AliasName}
                itemDomain={item.Domain}
                itemScope={item.MethodType}
                itemAppName={item.AppName}
                itemMethodName={item.MethodName}
                id={`webS_listItem${item.AliasName}`}
                onClickFunc={() => selectionFunc(item)}
                isSelected={selected?.MethodIndex === item.MethodIndex}
              />
            ) : (
              <CommonListItem
                itemName={item.AliasName}
                itemDomain={item.Domain}
                itemScope={item.RestScopeType}
                itemAppName={item.OperationType}
                itemMethodName={item.MethodName}
                id={`webS_listItem${item.AliasName}`}
                onClickFunc={() => selectionFunc(item)}
                isSelected={selected?.MethodIndex === item.MethodIndex}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default WebserviceList;
