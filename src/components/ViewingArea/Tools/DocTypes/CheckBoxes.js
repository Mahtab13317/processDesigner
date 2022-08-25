import React, { useState, useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import "../Interfaces.css";
import { useTranslation } from "react-i18next";
import AddCircleOutline from "@material-ui/icons/AddCircleOutlineOutlined";
import AddCircleFilled from "@material-ui/icons/AddCircleOutlined";
import { DisableCheckBox } from "../../../../utility/Tools/DisableFunc";
import { PROCESSTYPE_LOCAL } from "../../../../Constants/appConstants";

function CheckBoxes(props) {
  let { t } = useTranslation();
  const { processType } = props;
  const [checks, setChecks] = useState({
    Add: false,
    View: false,
    Modify: false,
    Delete: false,
    Download: false,
    Print: false,
  });

  const TempAdd = [
    { activityType: 2, subActivity: 1 },
    { activityType: 3, subActivity: 1 },
    { activityType: 2, subActivity: 2 },
    { activityType: 32, subActivity: 1 },
  ];

  const TempModify = [
    { activityType: 2, subActivity: 1 },
    { activityType: 3, subActivity: 1 },
    { activityType: 2, subActivity: 2 },
    { activityType: 32, subActivity: 1 },
  ];

  const TempDelete = [
    { activityType: 2, subActivity: 1 },
    { activityType: 3, subActivity: 1 },
    { activityType: 2, subActivity: 2 },
    { activityType: 32, subActivity: 1 },
  ];
  const TempDownload = [
    { activityType: 2, subActivity: 1 },
    { activityType: 3, subActivity: 1 },
    { activityType: 2, subActivity: 2 },
    { activityType: 32, subActivity: 1 },
  ];
  const TempPrint = [
    { activityType: 2, subActivity: 1 },
    { activityType: 3, subActivity: 1 },
    { activityType: 2, subActivity: 2 },
    { activityType: 32, subActivity: 1 },
  ];
  const [isProcessReadOnly, setIsProcessReadOnly] = useState(false);
  // Function that runs when the component mounts.
  useEffect(() => {
    if (processType !== PROCESSTYPE_LOCAL) {
      setIsProcessReadOnly(true);
    } else {
      setIsProcessReadOnly(false);
    }
  }, [processType]);

  const changeChecks = (check_type) => {
    if (props.type === "set-all") {
      props.updateSetAllChecks(check_type, props.docIdx, checks[check_type]);
    } else {
      props.toggleSingleChecks(
        check_type,
        props.activityIndex,
        props.activityId,
        checks[check_type]
      );
    }
  };

  useEffect(() => {
    // For each activity checkboxes
    let activityInDocType = false;
    if (props.docTypeList && props.activityIndex != undefined) {
      let activities = props.docTypeList.DocumentTypeList[props.activityIndex];
      activities.Activities.map((activity) => {
        if (activity.ActivityId == props.activityId) {
          activityInDocType = true;
          setChecks(() => {
            return {
              Add: activity.Add,
              View: activity.View,
              Modify: activity.Modify,
              Delete: activity.Delete,
              Download: activity.Download,
              Print: activity.Print,
            };
          });
        }
      });
      if (!activityInDocType) {
        setChecks(() => {
          return {
            Add: false,
            View: false,
            Modify: false,
            Delete: false,
            Download: false,
            Print: false,
          };
        });
      }
    }

    //For setAll checkBoxes
    if (props.type === "set-all" && props.docData) {
      let doc =
        props.docData &&
        props.docData.DocumentTypeList[props.docIdx].SetAllChecks;
      setChecks(() => {
        return {
          Add: doc.Add,
          View: doc.View,
          Modify: doc.Modify,
          Delete: doc.Delete,
          Download: doc.Download,
          Print: doc.Print,
        };
      });
    }
  }, [props.docTypeList, props.docData, props.compact]);

  if (props.compact) {
    return (
      <div>
        <FormControlLabel
          control={
            <Checkbox
              name="checkedF"
              icon={<AddCircleOutline />}
              checkedIcon={<AddCircleFilled />}
              id="addCompact_docTypes"
            />
          }
          disabled={
            DisableCheckBox(TempAdd, props) || isProcessReadOnly ? true : false
          }
          checked={DisableCheckBox(TempAdd, props) ? false : checks.Add}
          onChange={() => changeChecks("Add")}
        />
        <FormControlLabel
          checked={checks.View}
          disabled={isProcessReadOnly ? true : false}
          onChange={() => changeChecks("View")}
          control={
            <Checkbox
              icon={<AddCircleOutline />}
              checkedIcon={<AddCircleFilled />}
              name="checkedF"
              id="viewCompact_docTypes"
            />
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              icon={<AddCircleOutline />}
              checkedIcon={<AddCircleFilled />}
              name="checkedF"
              id="modifyCompact_docTypes"
            />
          }
          onChange={() => changeChecks("Modify")}
          disabled={
            DisableCheckBox(TempModify, props) || isProcessReadOnly
              ? true
              : false
          }
          checked={DisableCheckBox(TempModify, props) ? false : checks.Modify}
        />
        <FormControlLabel
          control={
            <Checkbox
              icon={<AddCircleOutline />}
              checkedIcon={<AddCircleFilled />}
              name="checkedF"
              id="deleteCompact_docTypes"
            />
          }
          onChange={() => changeChecks("Delete")}
          disabled={
            DisableCheckBox(TempDelete, props) || isProcessReadOnly
              ? true
              : false
          }
          checked={DisableCheckBox(TempDelete, props) ? false : checks.Delete}
        />
        <FormControlLabel
          control={
            <Checkbox
              icon={<AddCircleOutline />}
              checkedIcon={<AddCircleFilled />}
              name="checkedF"
              id="downloadCompact_docTypes"
            />
          }
          onChange={() => changeChecks("Download")}
          disabled={
            DisableCheckBox(TempDownload, props) || isProcessReadOnly
              ? true
              : false
          }
          checked={
            DisableCheckBox(TempDownload, props) ? false : checks.Download
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              icon={<AddCircleOutline />}
              checkedIcon={<AddCircleFilled />}
              name="checkedF"
              id="printCompact_docTypes"
            />
          }
          onChange={() => changeChecks("Print")}
          disabled={
            DisableCheckBox(TempPrint, props) || isProcessReadOnly
              ? true
              : false
          }
          checked={DisableCheckBox(TempPrint, props) ? false : checks.Print}
        />
      </div>
    );
  }
  return (
    <div className="checkBoxes" style={{ display: "flex", marginTop: "-1px" }}>
      <div className="checkBoxesThree" style={{ marginRight: "15px" }}>
        <FormControlLabel
          control={<Checkbox name="checkedF" id="addRight_docTypes" />}
          label={t("add")}
          disabled={
            DisableCheckBox(TempAdd, props) || isProcessReadOnly ? true : false
          }
          checked={DisableCheckBox(TempAdd, props) ? false : checks.Add}
          onChange={() => changeChecks("Add")}
        />
        <FormControlLabel
          checked={checks.View}
          disabled={isProcessReadOnly ? true : false}
          onChange={() => changeChecks("View")}
          control={<Checkbox name="checkedF" id="viewRight_docTypes" />}
          label={t("view")}
        />
        <FormControlLabel
          control={<Checkbox name="checkedF" id="modifyRight_docTypes" />}
          onChange={() => changeChecks("Modify")}
          label={t("modify")}
          disabled={
            DisableCheckBox(TempModify, props) || isProcessReadOnly
              ? true
              : false
          }
          checked={DisableCheckBox(TempModify, props) ? false : checks.Modify}
        />
      </div>
      <div className="checkBoxesThree">
        <FormControlLabel
          control={<Checkbox name="checkedF" id="deleteRight_docTypes" />}
          label={t("delete")}
          onChange={() => changeChecks("Delete")}
          disabled={
            DisableCheckBox(TempDelete, props) || isProcessReadOnly
              ? true
              : false
          }
          checked={DisableCheckBox(TempDelete, props) ? false : checks.Delete}
        />
        <FormControlLabel
          control={<Checkbox name="checkedF" id="downloadRight_docTypes" />}
          label={t("download")}
          onChange={() => changeChecks("Download")}
          disabled={
            DisableCheckBox(TempDownload, props) || isProcessReadOnly
              ? true
              : false
          }
          checked={
            DisableCheckBox(TempDownload, props) ? false : checks.Download
          }
        />
        <FormControlLabel
          control={<Checkbox name="checkedF" id="printRight_docTypes" />}
          label={t("print")}
          onChange={() => changeChecks("Print")}
          disabled={
            DisableCheckBox(TempPrint, props) || isProcessReadOnly
              ? true
              : false
          }
          checked={DisableCheckBox(TempPrint, props) ? false : checks.Print}
        />
      </div>
    </div>
  );
}

export default CheckBoxes;
