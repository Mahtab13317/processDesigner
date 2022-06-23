import React, { useEffect, useState } from "react";
import StarRateIcon from "@material-ui/icons/StarRate";
import Button from "@material-ui/core/Button";
import "../Interfaces.css";
import { useTranslation } from "react-i18next";

function AddGroup(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [nameInput, setNameInput] = useState("");
  const setNameFunc = (e) => {
    setNameInput(e.target.value);
  };

  useEffect(() => {
    if (props.groupName == "") {
      setNameInput(props.groupName);
      props.setGroupName(null);
    }
  }, [props.groupName]);

  useEffect(() => {
    let groupExists = false;
    props.groupsList &&
      props.groupsList.map((group) => {
        if (group.GroupName == nameInput) {
          groupExists = true;
        }
      });
    console.log("BGROUP", nameInput, groupExists);
    if (props.bGroupExists) {
      props.setbGroupExists(groupExists);
    }
  }, [props.groupName, props.groupsList, nameInput]);

  console.log("BGROUP_outer", props.bGroupExists);
  return (
    <div
      className="addDocs"
      style={{ height: "auto", width: "310px", direction: direction }}
    >
      <p className="addDocsHeading">{t("addGroup")}</p>
      <div>
        <label className="nameInputlabel">
          {t("groupName")}
          <StarRateIcon
            style={{ height: "15px", width: "15px", color: "red" }}
          />
        </label>
        <input
          id="groupNameInput_exception"
          value={nameInput}
          onChange={(e) => setNameFunc(e)}
          className="nameInput"
        />
        {props.bGroupExists ? (
          <p style={{ color: "red", fontSize: "10px" }}>
            This Group Name already exits!
          </p>
        ) : null}
      </div>
      <div
        className="buttons_add"
        style={{ marginTop: "20px", marginLeft: "15px" }}
      >
        <Button
          id="close_AddExpGroup_Modal"
          variant="outlined"
          onClick={() => props.handleClose()}
        >
          {t("cancel")}
        </Button>
        <Button
          id="addAnother_AddExpGroup_Modal"
          onClick={(e) =>
            props.addGroupToList(nameInput, "addAnother", props.newGroupToMove)
          }
          variant="contained"
          color="primary"
        >
          {t("addAnother")}
        </Button>
        <Button
          id="addNclose_AddExpGroup_Modal"
          variant="contained"
          onClick={() =>
            props.addGroupToList(nameInput, "add", props.newGroupToMove)
          }
          color="primary"
        >
          {t("add&Close")}
        </Button>
      </div>
    </div>
  );
}

export default AddGroup;
