import React, { useState, useEffect } from "react";
import StarRateIcon from "@material-ui/icons/StarRate";
import Button from "@material-ui/core/Button";
import "../Interfaces.css";
import { useTranslation } from "react-i18next";

function AddGroup(props) {
  let { t } = useTranslation();
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

  return (
    <div className="addDocs">
      <p className="addDocsHeading">{t("addGroup")}</p>
      <div>
        <label className="nameInputlabel">
          {t("groupName")}
          <StarRateIcon
            style={{ height: "15px", width: "15px", color: "red" }}
          />
        </label>
          <input
            id="todo_groupNameId"
            value={nameInput}
            onChange={(e) => setNameFunc(e)}
            className="nameInput"
          />
      </div>
      <div className="buttons_add">
        <Button
          variant="outlined"
          onClick={() => props.handleClose()}
          id="close_AddTodoGroup_Modal"
        >
          {t("cancel")}
        </Button>
        <Button
          id="addAnother_AddTodoGroup_Modal"
          onClick={(e) => props.addGroupToList(nameInput, "addAnother")}
          variant="contained"
          color="primary"
        >
          {t("addAnother")}
        </Button>
        <Button
          id="addNclose_AddTodoGroup_Modal"
          variant="contained"
          onClick={(e) => props.addGroupToList(nameInput, "add")}
          color="primary"
        >
          {t("add&Close")}
        </Button>
      </div>
    </div>
  );
}

export default AddGroup;
