import React, { useEffect, useState } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useTranslation } from "react-i18next";
import "../Interfaces.css";
import AddCircleOutline from "@material-ui/icons/AddCircleOutlineOutlined";
import AddCircleFilled from "@material-ui/icons/AddCircleOutlined";

function ActivityModal(props) {
  let { t } = useTranslation();
  const [checks, setChecks] = useState({
    Add: false,
    View: false,
    Modify: false,
    Delete: false,
    Download: false,
    Print: false,
  });

  const changeChecks = (check_type) => {
    checks[check_type] = !checks[check_type];
    props.updateActivitySetAllChecks(
      check_type,
      props.activityId,
      checks[check_type],
      checks,
      setChecks,
      props.activityIndex
    );
  };

  useEffect(() => {
    const temp = ["Add", "View", "Modify", "Delete", "Download", "Print"];
    if (props.fullRightCheckOneActivity) {
      setChecks({
        Add: true,
        View: true,
        Modify: true,
        Delete: true,
        Download: true,
        Print: true,
      });
    } else if (!props.fullRightCheckOneActivity) {
      temp.forEach((value) => {
        let defaultArray = [];
        props.docTypeList &&
          props.docTypeList.DocumentTypeList.map((type) => {
            type.Activities.map((activity) => {
              if (activity.ActivityId == props.activityId) {
                defaultArray.push(activity[value]);
              }
            });
          });
        if (defaultArray.includes(false)) {
          setChecks((prevData) => {
            let newData = { ...prevData };
            newData[value] = false;
            return newData;
          });
        } else {
          setChecks((prevData) => {
            let newData = { ...prevData };
            newData[value] = true;
            return newData;
          });
        }
      });
    }
  }, []);

  if (props.compact) {
    return (
      <div
        style={{
          width: "220px",
          border: "1px solid green",
          zIndex: "1000",
          position: "absolute",
          backgroundColor: "white",
          padding: "0px 3px",
          height: "36px",
        }}
      >
        <div style={{ display: "flex" }}>
          <FormControlLabel
            control={
              <Checkbox
                name="checkedF"
                id="oneActivity_modalAdd_docTypes"
                icon={<AddCircleOutline />}
                checkedIcon={<AddCircleFilled />}
              />
            }
            checked={checks["Add"]}
            onChange={() => changeChecks("Add")}
          />
          <FormControlLabel
            checked={checks["View"]}
            onChange={() => changeChecks("View")}
            control={
              <Checkbox
                id="oneActivity_modalView_docTypes"
                name="checkedF"
                icon={<AddCircleOutline />}
                checkedIcon={<AddCircleFilled />}
              />
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                name="checkedF"
                id="oneActivity_modalModify_docTypes"
                icon={<AddCircleOutline />}
                checkedIcon={<AddCircleFilled />}
              />
            }
            onChange={() => changeChecks("Modify")}
            checked={checks["Modify"]}
          />
          <FormControlLabel
            control={
              <Checkbox
                id="oneActivity_modalDelete_docTypes"
                name="checkedF"
                icon={<AddCircleOutline />}
                checkedIcon={<AddCircleFilled />}
              />
            }
            onChange={() => changeChecks("Delete")}
            checked={checks["Delete"]}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="checkedF"
                id="oneActivity_modalDownload_docTypes"
                icon={<AddCircleOutline />}
                checkedIcon={<AddCircleFilled />}
              />
            }
            onChange={() => changeChecks("Download")}
            checked={checks["Download"]}
          />
          <FormControlLabel
            control={
              <Checkbox
                id="oneActivity_modalPrint_docTypes"
                name="checkedF"
                icon={<AddCircleOutline />}
                checkedIcon={<AddCircleFilled />}
              />
            }
            onChange={() => changeChecks("Print")}
            checked={checks["Print"]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="modalPaperDocType" style={{width:'18rem'}}>
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "left" }}
      >
        <FormControlLabel
          control={<Checkbox name="checkedF" />}
          label={t("add")}
          checked={checks["Add"]}
          onChange={() => changeChecks("Add")}
        />
        <FormControlLabel
          checked={checks["View"]}
          onChange={() => changeChecks("View")}
          control={<Checkbox name="checkedF" />}
          label={t("view")}
        />
        <FormControlLabel
          control={<Checkbox name="checkedF" />}
          onChange={() => changeChecks("Modify")}
          label={t("modify")}
          checked={checks["Modify"]}
        />
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", alignItems: "left" }}
      >
        <FormControlLabel
          control={<Checkbox name="checkedF" />}
          label={t("delete")}
          onChange={() => changeChecks("Delete")}
          checked={checks["Delete"]}
        />
        <FormControlLabel
          control={<Checkbox name="checkedF" />}
          label={t("download")}
          onChange={() => changeChecks("Download")}
          checked={checks["Download"]}
        />
        <FormControlLabel
          control={<Checkbox name="checkedF" />}
          label={t("print")}
          onChange={() => changeChecks("Print")}
          checked={checks["Print"]}
        />
      </div>
    </div>
  );
}

export default ActivityModal;
