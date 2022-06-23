import React, { useState, useEffect } from "react";
import StarRateIcon from "@material-ui/icons/StarRate";
import Button from "@material-ui/core/Button";
import "../Interfaces.css";
import { useTranslation } from "react-i18next";

function AddDoc(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [nameInput, setNameInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [docModalHead, setDocModalHead] = useState("");
  const setNameFunc = (e) => {
    setNameInput(e.target.value);
  };
  const setDescFunc = (e) => {
    setDescInput(e.target.value);
  };
  useEffect(() => {
    if (props.docNameToModify) {
      document.getElementById("DocDescInput").focus();
      document.getElementById("DocNameInput").disabled = true;
      setDocModalHead(`Edit: ${props.docNameToModify}`);
    } else {
      setDocModalHead(t("addException"));
    }
  }, []);

  useEffect(() => {
    if (props.docDescToModify) {
      setDescInput(props.docDescToModify);
    }
    if (props.docNameToModify) {
      setNameInput(props.docNameToModify);
    }
  }, [props.docDescToModify, props.docNameToModify]);

  return (
    <div className="addDocs" style={{ height: "250px", width: "350px", direction:direction }}>
      <p className="addDocsHeading">
        {props.docNameToModify ? docModalHead : t("addDocuments")}
      </p>
      <div>
        <label className="nameInputlabel">
          {t("documentTypeName")}
          <StarRateIcon
            style={{ height: "15px", width: "15px", color: "red" }}
          />
        </label>
        <form>
          <input
            id="DocNameInput"
            value={nameInput}
            onChange={(e) => setNameFunc(e)}
            className="nameInput"
          />
        </form>
        <label className="descInputlabel">
          Doc Description
          <StarRateIcon
            style={{ height: "15px", width: "15px", color: "red" }}
          />
        </label>
        <textarea
          id="DocDescInput"
          value={descInput}
          onChange={(e) => setDescFunc(e)}
          className="descTextArea"
        ></textarea>
      </div>
      {/* {props.bDocExists ? <p>Name taken!!</p> : null} */}
      <div
        className="buttons_add"
        style={{ marginTop: "20px", textAlign: "right" }}
      >
        <Button
          variant="outlined"
          onClick={() => props.handleClose()}
          id="close_AddDocModal_Button"
        >
          {t("cancel")}
        </Button>
        {props.docNameToModify ? null : (
          <Button
            id="addAnotherDocTypes_Button"
            onClick={(e) =>
              props.addDocToList(nameInput, descInput, "addAnother")
            }
            variant="contained"
            color="primary"
          >
            {t("addAnother")}
          </Button>
        )}

        {props.docNameToModify ? null : (
          <Button
            id="addNclose_AddDocModal_Button"
            variant="contained"
            onClick={(e) => props.addDocToList(nameInput, descInput, "add")}
            color="primary"
          >
            {t("add&Close")}
          </Button>
        )}

        {props.docNameToModify ? (
          <Button
            variant="contained"
            onClick={(e) => {
              props.modifyDescription(
                nameInput,
                descInput,
                props.docIdToModify
              );
            }}
            color="primary"
          >
            {"SAVE"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default AddDoc;
