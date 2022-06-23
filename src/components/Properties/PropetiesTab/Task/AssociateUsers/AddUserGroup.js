import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import { Button } from "@material-ui/core";

import MicroFrontendContainer from "../../../../MicroFrontendContainer";
import { useTranslation } from "react-i18next";

function AddUserGroup(props) {
  let { t } = useTranslation();
  const saveChangeHandler = () => {
    props.getUserGroupList(window.userGroupPickerRef.current.getSelection());
    props.closeModal();
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "white",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Open Sans",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "15%",
          borderBottom: "1px solid #D3D3D3",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingInline: "1.25rem",
        }}
      >
        <p style={{ fontSize: "1rem", fontWeight: "600" }}>
          {t("Associate User(s)/Group(s)")}
        </p>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Button
            variant="contained"
            onClick={props.closeModal}
            style={{ marginInline: "0.3rem" }}
          >
            {t("discard")}
          </Button>
          <Button
            variant="contained"
            style={{ marginInline: "0.3rem" }}
            color="primary"
            onClick={saveChangeHandler}
          >
            {t("save")} {t("changes")}
          </Button>
          <CloseIcon onClick={props.closeModal} fontSize="medium" />
        </div>
      </div>
      <div style={{ width: "100%", height: "85%" }}>
        {" "}
        <MicroFrontendContainer
          data={{ ext: true }}
          moduleName="ORM"
          containerId="rdDIv"
          styles={{
            width: "calc(100% - 2px)",
            height: "calc(100% - 2px)",
            position: "absolute",
            overflow: "auto",
          }}
          componentName="UserGroupPicklistMF"
          domainUrl="http://192.168.153.130:8080"
        />
      </div>
      {/* <div
        style={{
          width: "100%",
          height: "3rem",
          display: "flex",
          flexDirection: "row-reverse",
          padding: "0.5rem",
          background: "red",
        }}
      >
        <Button variant="contained" style={{ marginInline: "0.6rem" }}>
          Discard
        </Button>
        <Button variant="contained" color="primary">
          Save Changes
        </Button>
      </div> */}
    </div>
  );
}

export default AddUserGroup;
