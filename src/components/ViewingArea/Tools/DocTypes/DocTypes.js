// Bug solved for: No validation when documents with same name is added - 109986
// Changes made to solve Todo Screen distorts when the count increases  ID 112558
// Changes made to solve Bug = 114551 =>Add Document not working once you add document, log out , login and again create document is not working
// #BugID - 109986
// #BugDescription - validation for Doctype duplicate name length has been added.
// #BugID - 114022
// #BugDescription - Document Type is being added now when lengthy name is entered and text validate also.
import React, { useEffect, useState } from "react";
import "../Interfaces.css";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import SearchProject from "../../../../UI/Search Component/index";
import CheckBoxes from "./CheckBoxes";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddDocType from "./AddDoc";
import Modal from "@material-ui/core/Modal";
import { store, useGlobalState } from "state-pool";
import {
  SERVER_URL,
  ENDPOINT_EDIT_DOC,
  RTL_DIRECTION,
  BATCH_COUNT,
} from "../../../../Constants/appConstants";
import axios from "axios";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ActivityModal from "./ActivityModal.js";
import Backdrop from "../../../../UI/Backdrop/Backdrop";
import {
  syncViewWithModify,
  syncViewWithModifySetAll,
  syncViewWithModifyForActivity,
} from "../../../../utility/Tools/alignModifyView_DocTypes";
import { giveCompleteRights } from "../../../../utility/Tools/giveCompleteRights_docType";
import { connect, useDispatch } from "react-redux";
import DeleteDocModal from "../../../../UI/ActivityModal/Modal";
import CircularProgress from "@material-ui/core/CircularProgress";
import Rules from "../Rules/Rules";
import DeletePopup from "../DeletePopup";
import DefaultModal from "../../../../UI/Modal/Modal";
import ObjectDependencies from "../../../../UI/ObjectDependencyModal";
import { setToastDataFunc } from "../../../../redux-store/slices/ToastDataHandlerSlice";

function DocType(props) {
  const loadedProcessData = store.getState("loadedProcessData");
  const [localLoadedProcessData, setlocalLoadedProcessData] =
    useGlobalState(loadedProcessData);
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const [isLoading, setIsLoading] = useState(true);
  let [docSearchTerm, setDocSearchTerm] = useState("");
  let [activitySearchTerm, setActivitySearchTerm] = useState("");
  const [addDocModal, setAddDocModal] = React.useState(false);
  const [compact, setCompact] = useState(false);
  const [fullRightCheckOneDocArr, setFullRightCheckOneDocArr] = useState([]);
  const [bDocExists, setbDocExists] = useState(false);
  const [openActivityModal, setOpenActivityModal] = useState(null);
  const [fullRightCheckOneActivityArr, setFullRightCheckOneActivityArr] =
    useState([]);
  const [docData, setDocData] = useState({});
  const [docNameToModify, setDocNameToModify] = useState(null);
  const [docDescToModify, setDocDescToModify] = useState();
  const [docIdToModify, setDocIdToModify] = useState();
  //code added on 8 June 2022 for BugId 110212
  const [docArray, setDocArray] = useState([]);
  const [docAllRules, setDocAllRules] = useState([]);
  const [selectedTab, setSelectedTab] = useState("screenHeading");
  const [rulesLength, setRulesLength] = useState(false);
  const [subColumns, setSubColumns] = useState([]);
  const [splicedColumns, setSplicedColumns] = useState([]);
  const [showDocNameError, setShowDocNameError] = useState(false);
  const [processType, setProcessType] = useState(null);
  const [addAnotherDoc, setAddAnotherDoc] = useState(false);
  //code added on 8 June 2022 for BugId 110212

  //added by mahtab

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showDependencyModal, setShowDependencyModal] = useState(false);
  const [taskAssociation, setTaskAssociation] = useState([]);
  const dispatch = useDispatch();

  const handleScreen = (screenType) => {
    setSelectedTab(screenType);
    setRulesLength(true);
  };

  const tabChangeHandler = (e, tabName) => {
    setSelectedTab(tabName);
  };

  useEffect(() => {
    setIsLoading(true);
  }, [localLoadedProcessData?.ProcessDefId]);

  useEffect(() => {
    let activityIdString = "";
    localLoadedProcessData.MileStones.map((mileStone) => {
      mileStone.Activities.map((activity, index) => {
        activityIdString = activityIdString + activity.ActivityId + ",";
      });
    });
    axios
      .get(
        SERVER_URL +
          `/doctypes/${localLoadedProcessData.ProcessDefId}/${localLoadedProcessData.ProcessType}/${localLoadedProcessData.ProcessName}/${activityIdString}`
      )
      .then((res) => {
        if (res.status === 200) {
          setDocAllRules(res.data.Rules);
          setDocData(res.data);
          //code added on 8 June 2022 for BugId 110212
          let docTypeList = res.data.DocumentTypeList;
          let array = [];
          {
            docTypeList.map((grp) => {
              let obj = {
                Name: grp.DocName,
                NameId: grp.DocTypeId,
              };
              array.push(obj);
              setDocArray(array);
            });
          }
          res.data &&
            res.data.DocumentTypeList.map((docType, doc_idx) => {
              let allChecked = true;
              for (let prop in docType.SetAllChecks) {
                if (docType.SetAllChecks[prop] === false) {
                  allChecked = false;
                  setFullRightCheckOneDocArr((prevData) => {
                    let newData = prevData.length > 0 ? [...prevData] : [];
                    newData[doc_idx] = false;
                    return newData;
                  });
                  break;
                }
              }
              if (allChecked) {
                setFullRightCheckOneDocArr((prevData) => {
                  let newData = prevData.length > 0 ? [...prevData] : [];
                  newData[doc_idx] = true;
                  return newData;
                });
              }
            });

          let localActivityArr = [];
          let localActivityIdArr = [];
          res.data &&
            res.data.DocumentTypeList.map((docType, index) => {
              docType.Activities.map((activity, act_idx) => {
                if (Object.values(activity).includes(false)) {
                  localActivityArr[act_idx] = false;
                } else {
                  if (localActivityArr[act_idx] != false) {
                    localActivityArr[act_idx] = true;
                  }
                }
                localActivityIdArr[act_idx] = activity.ActivityId;
              });
            });
          localActivityArr.forEach((activity, activityIndex) => {
            if (activity === false) {
              setFullRightCheckOneActivityArr((prevArr) => {
                let temp = [...prevArr];
                temp[localActivityIdArr[activityIndex]] = false;
                return temp;
              });
            } else {
              setFullRightCheckOneActivityArr((prevArr) => {
                let temp = [...prevArr];
                temp[localActivityIdArr[activityIndex]] = true;
                return temp;
              });
            }
          });

          setIsLoading(false);
        }
      })
      .catch(() => setIsLoading(false));
  }, [localLoadedProcessData]);

  useEffect(() => {
    let arr = [];
    localLoadedProcessData.MileStones.map((mileStone) => {
      mileStone.Activities.map((activity, index) => {
        if (
          !(activity.ActivityType === 18 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 1 && activity.ActivitySubType === 2) &&
          !(activity.ActivityType === 26 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 10 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 20 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 22 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 31 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 29 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 10 && activity.ActivitySubType === 4) &&
          !(activity.ActivityType === 33 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 27 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 19 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 21 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 5 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 6 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 5 && activity.ActivitySubType === 2) &&
          !(activity.ActivityType === 6 && activity.ActivitySubType === 2) &&
          !(activity.ActivityType === 7 && activity.ActivitySubType === 1) &&
          !(activity.ActivityType === 34 && activity.ActivitySubType === 1) &&
          // code added on 11 Oct 2022 for BugId 116576
          !(activity.ActivityType === 30 && activity.ActivitySubType === 1)
        ) {
          arr.push(activity);
        }
      });
    });
    setSubColumns(arr);
    setSplicedColumns(arr.slice(0, BATCH_COUNT));
    setProcessType(localLoadedProcessData?.ProcessType);
  }, [localLoadedProcessData]);

  useEffect(() => {
    if (document.getElementById("oneBoxMatrix")) {
      document.getElementById("oneBoxMatrix").onscroll = function (event) {
        if (this.scrollLeft >= this.scrollWidth - this.clientWidth) {
          const timeout = setTimeout(() => {
            setSplicedColumns((prev) =>
              subColumns.slice(0, prev.length + BATCH_COUNT)
            );
          }, 500);
          return () => clearTimeout(timeout);
        }
      };
    }
  });
  {
    /*code updated on 10 October 2022 for BugId 114022	*/
  }
  const addDocToList = (DocToAdd, DocDesc, button_type, mandatorydoc) => {
    let exist = false;
    docData &&
      docData.DocumentTypeList.forEach((type) => {
        if (
          type.DocName.trim().toLowerCase() == DocToAdd.trim().toLowerCase()
        ) {
          setbDocExists(true);
          exist = true;
        }
      });
    if (exist) {
      return;
    }

    if (DocToAdd?.trim() !== "") {
      if (DocToAdd.length <= 50) {
        let maxToDoId = 0;
        docData.DocumentTypeList?.map((doc) => {
          if (+doc.DocTypeId > +maxToDoId) {
            maxToDoId = doc.DocTypeId;
          }
        });
        axios
          .post(SERVER_URL + "/addDocType", {
            processDefId: props.openProcessID,
            docTypeName: DocToAdd,
            docTypeId: `${+maxToDoId + 1}`,
            docTypeDesc: DocDesc,
            sDocType: "D",
            mandatorydoc: mandatorydoc ? "Y" : "N",
          })
          .then((res) => {
            if (res.data.Status == 0) {
              let temp = JSON.parse(JSON.stringify(localLoadedProcessData));
              temp.DocumentTypeList.push({
                DocName: DocToAdd,
                DocTypeId: `${+maxToDoId + 1}`,
                Description: DocDesc,
              });
              setlocalLoadedProcessData(temp);
              let addedActivity = [];
              let tempData = { ...docData };
              if (subColumns.length > 0) {
                subColumns?.forEach((activity) => {
                  addedActivity.push({
                    ActivityId: activity.ActivityId,
                    Add: false,
                    View: false,
                    Modify: false,
                    Delete: false,
                    Download: false,
                    Print: false,
                  });
                });
              }
              tempData &&
                tempData.DocumentTypeList.push({
                  DocName: DocToAdd,
                  DocTypeId: `${+maxToDoId + 1}`,
                  SetAllChecks: {
                    Add: false,
                    View: false,
                    Modify: false,
                    Delete: false,
                    Download: false,
                    Print: false,
                  },

                  Activities: [...addedActivity],
                });
              setDocData(tempData);
              // code added on 2 August 2022 for BugId 112251
              if (button_type !== "addAnother") {
                handleClose();
                setAddAnotherDoc(false);
              } else if (button_type === "addAnother") {
                setAddAnotherDoc(true);
                document.getElementById("DocNameInput").focus();
              }
            }
          });
      } else {
        dispatch(
          setToastDataFunc({
            message: "Doc Type length should not exceed 50 characters",
            severity: "error",
            open: true,
          })
        );
        return false;
      }
    } else {
      setShowDocNameError(true);
      document.getElementById("DocNameInput").focus();
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const deleteDocType = (docName, docId) => {
    axios
      .post(SERVER_URL + "/removeDocType", {
        processDefId: props.openProcessID,
        docTypeName: docName,
        docTypeId: docId,
        sDocType: "D",
      })
      .then((res) => {
        if (res.data.Status == 0) {
          setTaskAssociation(res?.data?.Validations);
          if (res?.data?.Validations?.length > 0) {
            //setIsDeleteModalOpen(true);
            setShowDependencyModal(true);
          } else {
            let tempData = { ...docData };
            tempData.DocumentTypeList.map((docType, docIndex) => {
              if (docType.DocTypeId == docId) {
                let docToDeleteIndex = docIndex;
                tempData.DocumentTypeList.splice(docToDeleteIndex, 1);
              }
            });
            setDocData(tempData);
            handleClose();
          }
        }
      });
  };

  const handleOpen = () => {
    setAddDocModal(true);
  };

  const handleClose = () => {
    setAddDocModal(false);
    setbDocExists(false);
    setShowDocNameError(false);
  };

  const handleActivityModalOpen = (activity_id) => {
    setOpenActivityModal(activity_id);
  };

  const handleActivityModalClose = () => {
    setOpenActivityModal(null);
  };

  const editDescription = (docId, docName, docDesc) => {
    setDocNameToModify(docName);
    setDocDescToModify(docDesc);
    setDocIdToModify(docId);
    handleOpen();
  };

  const modifyDescription = (docName, docDesc, docId) => {
    axios
      .post(SERVER_URL + ENDPOINT_EDIT_DOC, {
        processDefId: props.openProcessID,
        docTypeName: docName,
        docTypeId: docId,
        docTypeDesc: docDesc,
        sDocType: "D",
      })
      .then((res) => {
        let tempData = { ...docData };
        tempData.DocumentTypeList.map((doc) => {
          doc.Description = docDesc;
        });
        setDocData(tempData);
        handleClose();
      });
  };

  //Reusable function with common code to keep check on fullRightCheckOneActivityArr changing values
  const fullRights_oneActivity_allDocs = (activity_id, newState) => {
    let demo = true;
    newState.DocumentTypeList.map((docType) => {
      docType.Activities.map((activity) => {
        if (activity.ActivityId == activity_id) {
          if (Object.values(activity).includes(false) && demo) {
            demo = false;
            setFullRightCheckOneActivityArr((prevArr) => {
              let temp = [...prevArr];
              temp[activity_id] = false;
              return temp;
            });
          }
        }
      });
    });
    if (demo) {
      setFullRightCheckOneActivityArr((prevArr) => {
        let temp = [...prevArr];
        temp[activity_id] = true;
        return temp;
      });
    }
  };

  const toggleSingleChecks = (
    check_type,
    doc_idx,
    activity_id,
    checkTypeValue
  ) => {
    // CASE:1 - Single checkBox of any Activity in Any Doc
    let localActivity;
    docData.DocumentTypeList[doc_idx].Activities.map((activity) => {
      if (activity.ActivityId == +activity_id) {
        localActivity = {
          Add: activity.Add ? "Y" : "N",
          Print: activity.Print ? "Y" : "N",
          Delete: activity.Delete ? "Y" : "N",
          Modify: activity.Modify ? "Y" : "N",
          View: activity.View ? "Y" : "N",
          Download: activity.Download ? "Y" : "N",
        };
      }
    });

    let postBody = !checkTypeValue
      ? {
          processDefId: props.openProcessID,
          check: true,
          pMDocRightsInfoList: [
            {
              docTypeName: docData.DocumentTypeList[doc_idx].DocName,
              docTypeId: docData.DocumentTypeList[doc_idx].DocTypeId,
              pMActRightsList: [
                {
                  actId: activity_id,
                  add: check_type == "Add" ? "Y" : localActivity.Add,
                  delete: check_type == "Delete" ? "Y" : localActivity.Delete,
                  view: check_type == "View" ? "Y" : localActivity.View,
                  modify: check_type == "Modify" ? "Y" : localActivity.Modify,
                  download:
                    check_type == "Download" ? "Y" : localActivity.Download,
                  print: check_type == "Print" ? "Y" : localActivity.Print,
                },
              ],
            },
          ],
        }
      : {
          processDefId: props.openProcessID,
          check: false,
          pMDocRightsInfoList: [
            {
              docTypeName: docData.DocumentTypeList[doc_idx].DocName,
              docTypeId: docData.DocumentTypeList[doc_idx].DocTypeId,
              pMActRightsList: [
                {
                  actId: activity_id,
                  add: check_type == "Add" ? "N" : localActivity.Add,
                  delete: check_type == "Delete" ? "N" : localActivity.Delete,
                  view: check_type == "View" ? "N" : localActivity.View,
                  modify: check_type == "Modify" ? "N" : localActivity.Modify,
                  download:
                    check_type == "Download" ? "N" : localActivity.Download,
                  print: check_type == "Print" ? "N" : localActivity.Print,
                },
              ],
              add: check_type == "Add" ? "Y" : "N",
              delete: check_type == "Delete" ? "Y" : "N",
              view: check_type == "View" ? "Y" : "N",
              modify: check_type == "Modify" ? "Y" : "N",
              download: check_type == "Download" ? "Y" : "N",
              print: check_type == "Print" ? "Y" : "N",
            },
          ],
        };
    axios.post(SERVER_URL + `/saveRight`, postBody).then((res) => {
      if (res.data.Status == 0) {
        let newState = { ...docData };
        syncViewWithModify(newState, check_type, doc_idx, activity_id);
        fullRights_oneActivity_allDocs(activity_id, newState);
        newState.DocumentTypeList[doc_idx].Activities.map((activity) => {
          if (activity.ActivityId === +activity_id) {
            activity[check_type] = !activity[check_type];
          }
        });
        let demoOne = true;
        newState.DocumentTypeList[doc_idx].Activities.map(
          (activity, activityIndex) => {
            if (!activity[check_type] && demoOne) {
              demoOne = false;
              newState.DocumentTypeList[doc_idx].SetAllChecks[
                check_type
              ] = false;
            }
          }
        );
        if (demoOne) {
          newState.DocumentTypeList[doc_idx].SetAllChecks[check_type] = true;
        }
        syncViewWithModifySetAll(newState, check_type, doc_idx);
        let allChecked = true;
        for (let prop in newState.DocumentTypeList[doc_idx].SetAllChecks) {
          if (!newState.DocumentTypeList[doc_idx].SetAllChecks[prop]) {
            allChecked = false;
            break;
          }
        }
        let arr = [...fullRightCheckOneDocArr];
        arr[doc_idx] = allChecked;
        setFullRightCheckOneDocArr(arr);
        setDocData(newState);
      }
    });
  };

  const updateActivitySetAllChecks = (
    check_type,
    activity_id,
    checkTypeValue,
    checks,
    setChecks
  ) => {
    // CASE:5 - Giving a particular right (eg:Modify) for one Activity, in all Docs
    let postBody = checkTypeValue
      ? {
          processDefId: props.openProcessID,
          check: true,
          pMDocRightsInfoList: [
            {
              docTypeName: "",
              docTypeId: 0,
              pMActRightsList: [
                {
                  actId: activity_id,
                  add: checks["Add"] ? "Y" : "N",
                  delete: checks["Delete"] ? "Y" : "N",
                  view: checks["View"] ? "Y" : "N",
                  modify: checks["Modify"] ? "Y" : "N",
                  download: checks["Download"] ? "Y" : "N",
                  print: checks["Print"] ? "Y" : "N",
                },
              ],
            },
          ],
        }
      : {
          processDefId: props.openProcessID,
          check: false,
          pMDocRightsInfoList: [
            {
              docTypeName: "",
              docTypeId: 0,
              pMActRightsList: [
                {
                  actId: activity_id,
                  add: checks["Add"] ? "Y" : "N",
                  delete: checks["Delete"] ? "Y" : "N",
                  view: checks["View"] ? "Y" : "N",
                  modify: checks["Modify"] ? "Y" : "N",
                  download: checks["Download"] ? "Y" : "N",
                  print: checks["Print"] ? "Y" : "N",
                },
              ],
              add: check_type == "Add" ? "Y" : "N",
              delete: check_type == "Delete" ? "Y" : "N",
              view: check_type == "View" ? "Y" : "N",
              modify: check_type == "Modify" ? "Y" : "N",
              download: check_type == "Download" ? "Y" : "N",
              print: check_type == "Print" ? "Y" : "N",
            },
          ],
        };
    axios.post(SERVER_URL + `/saveRight`, postBody).then((res) => {
      if (res.status === 200) {
      }
    });
    let newState = { ...docData };
    newState.DocumentTypeList.map((docType) => {
      docType.Activities.map((activity) => {
        if (+activity.ActivityId === +activity_id) {
          activity[check_type] = checkTypeValue;
        }
      });
    });

    syncViewWithModifyForActivity(
      newState,
      check_type,
      checkTypeValue,
      activity_id,
      setChecks
    );
    fullRights_oneActivity_allDocs(activity_id, newState);
    setDocData(newState);
  };

  const updateSetAllChecks = (check_type, doc_idx, checkvalue) => {
    // CASE:3 - Giving a particular right (eg: Modify) for a Single Doc, for all Activities
    let localActivity;

    localActivity = {
      Add: docData.DocumentTypeList[doc_idx].SetAllChecks["Add"] ? "Y" : "N",
      Print: docData.DocumentTypeList[doc_idx].SetAllChecks["Print"]
        ? "Y"
        : "N",
      Delete: docData.DocumentTypeList[doc_idx].SetAllChecks["Delete"]
        ? "Y"
        : "N",
      Modify: docData.DocumentTypeList[doc_idx].SetAllChecks["Modify"]
        ? "Y"
        : "N",
      View: docData.DocumentTypeList[doc_idx].SetAllChecks["View"] ? "Y" : "N",
      Download: docData.DocumentTypeList[doc_idx].SetAllChecks["Download"]
        ? "Y"
        : "N",
    };

    let postBody = !checkvalue
      ? {
          processDefId: props.openProcessID,
          check: true,
          pMDocRightsInfoList: [
            {
              docTypeName: docData.DocumentTypeList[doc_idx].DocName,
              docTypeId: docData.DocumentTypeList[doc_idx].DocTypeId,
              pMActRightsList: [
                {
                  actId: 0,
                  add: check_type == "Add" ? "Y" : localActivity.Add,
                  delete: check_type == "Delete" ? "Y" : localActivity.Delete,
                  view:
                    check_type == "View"
                      ? "Y"
                      : check_type == "Modify"
                      ? "Y"
                      : localActivity.View,
                  modify: check_type == "Modify" ? "Y" : localActivity.Modify,
                  download:
                    check_type == "Download" ? "Y" : localActivity.Download,
                  print: check_type == "Print" ? "Y" : localActivity.Print,
                },
              ],
            },
          ],
        }
      : {
          processDefId: props.openProcessID,
          check: false,
          pMDocRightsInfoList: [
            {
              docTypeName: docData.DocumentTypeList[doc_idx].DocName,
              docTypeId: docData.DocumentTypeList[doc_idx].DocTypeId,
              pMActRightsList: [
                {
                  actId: 0,
                  add: check_type == "Add" ? "N" : localActivity.Add,
                  delete: check_type == "Delete" ? "N" : localActivity.Delete,
                  view: check_type == "View" ? "N" : localActivity.View,
                  modify:
                    check_type == "Modify"
                      ? "N"
                      : check_type == "View"
                      ? "N"
                      : localActivity.Modify,
                  download:
                    check_type == "Download" ? "N" : localActivity.Download,
                  print: check_type == "Print" ? "N" : localActivity.Print,
                },
              ],
              add: check_type == "Add" ? "Y" : "N",
              delete: check_type == "Delete" ? "Y" : "N",
              view: check_type == "View" ? "Y" : "N",
              modify: check_type == "Modify" ? "Y" : "N",
              download: check_type == "Download" ? "Y" : "N",
              print: check_type == "Print" ? "Y" : "N",
            },
          ],
        };
    axios.post(SERVER_URL + `/saveRight`, postBody).then((res) => {
      if (res.data.Status === 0) {
        let newState = { ...docData };
        let newCheck =
          !newState.DocumentTypeList[doc_idx].SetAllChecks[check_type];
        newState.DocumentTypeList[doc_idx].SetAllChecks[check_type] = newCheck;
        syncViewWithModifySetAll(newState, check_type, doc_idx);
        newState.DocumentTypeList.map((docType, index) => {
          docType.Activities.map((activity) => {
            if (doc_idx == index) {
              activity[check_type] = newCheck;
            }
            if (Object.values(activity).includes(false)) {
              setFullRightCheckOneActivityArr((prevArr) => {
                let temp = [...prevArr];
                temp[activity.ActivityId] = false;
                return temp;
              });
            } else {
              setFullRightCheckOneActivityArr((prevArr) => {
                let temp = [...prevArr];
                temp[activity.ActivityId] = true;
                return temp;
              });
            }
          });
        });
        syncViewWithModify(newState, check_type, doc_idx, null);

        setDocData(newState);

        let allChecked = true;
        for (let prop in newState.DocumentTypeList[doc_idx].SetAllChecks) {
          if (!newState.DocumentTypeList[doc_idx].SetAllChecks[prop]) {
            allChecked = false;
            break;
          }
        }

        let arr = [...fullRightCheckOneDocArr];
        arr[doc_idx] = allChecked;
        setFullRightCheckOneDocArr(arr);
      }
    });
  };

  const GiveCompleteRights = (index) => {
    // CASE:2 - Giving all rights to one Doc for all Activities
    let postBody = fullRightCheckOneDocArr[index]
      ? {
          processDefId: props.openProcessID,
          check: false,
          pMDocRightsInfoList: [
            {
              docTypeName: docData.DocumentTypeList[index].DocName,
              docTypeId: docData.DocumentTypeList[index].DocTypeId,
              pMActRightsList: [
                {
                  actId: 0,
                  add: "N",
                  delete: "N",
                  view: "N",
                  modify: "N",
                  download: "N",
                  print: "N",
                },
              ],
            },
          ],
        }
      : {
          processDefId: props.openProcessID,
          check: true,
          pMDocRightsInfoList: [
            {
              docTypeName: docData.DocumentTypeList[index].DocName,
              docTypeId: docData.DocumentTypeList[index].DocTypeId,
              pMActRightsList: [
                {
                  actId: 0,
                  add: "Y",
                  delete: "Y",
                  view: "Y",
                  modify: "Y",
                  download: "Y",
                  print: "Y",
                },
              ],
            },
          ],
        };
    axios.post(SERVER_URL + `/saveRight`, postBody).then((res) => {
      if (res.data.Status === 0) {
        let fullRightCheck = !fullRightCheckOneDocArr[index];
        let newState = { ...docData };
        newState.DocumentTypeList[index].SetAllChecks = {
          Add: fullRightCheck,
          View: fullRightCheck,
          Modify: fullRightCheck,
          Delete: fullRightCheck,
          Download: fullRightCheck,
          Print: fullRightCheck,
        };
        newState.DocumentTypeList[index].Activities.map((activity) => {
          giveCompleteRights(fullRightCheck, activity);
        });

        let arr = [...fullRightCheckOneDocArr];
        arr[index] = fullRightCheck;
        setFullRightCheckOneDocArr(arr);

        if (arr.includes(false)) {
          newState.DocumentTypeList.map((docType) => {
            docType.Activities.map((activity) => {
              setFullRightCheckOneActivityArr((prevArr) => {
                let temp = [...prevArr];
                temp[activity.ActivityId] = false;
                return temp;
              });
            });
          });
        } else {
          newState.DocumentTypeList.map((docType) => {
            docType.Activities.map((activity) => {
              setFullRightCheckOneActivityArr((prevArr) => {
                let temp = [...prevArr];
                temp[activity.ActivityId] = true;
                return temp;
              });
            });
          });
        }
        setDocData(newState);
      }
    });
  };

  let filteredDocTypes =
    docData.DocumentTypeList &&
    docData.DocumentTypeList.filter((docType) => {
      if (docSearchTerm.trim() == "") {
        return docData.DocumentTypeList;
      } else if (
        docType.DocName.toLowerCase().includes(docSearchTerm.toLowerCase())
      ) {
        return docData.DocumentTypeList;
      }
    });

  const handleSwitchChange = () => {
    setCompact(!compact);
  };
  const GiveCompleteRightsToOneActivity = (activityId) => {
    // CASE:4 - Giving full Rights to one Activity in all Docs
    let postBody = !fullRightCheckOneActivityArr[activityId]
      ? {
          processDefId: props.openProcessID,
          check: true,
          pMDocRightsInfoList: [
            {
              docTypeName: "",
              docTypeId: "0",
              pMActRightsList: [
                {
                  actId: activityId,
                  add: "Y",
                  delete: "Y",
                  view: "Y",
                  modify: "Y",
                  download: "Y",
                  print: "Y",
                },
              ],
            },
          ],
        }
      : {
          processDefId: props.openProcessID,
          check: false,
          pMDocRightsInfoList: [
            {
              docTypeName: "",
              docTypeId: "0",
              pMActRightsList: [
                {
                  actId: activityId,
                  add: "N",
                  delete: "N",
                  view: "N",
                  modify: "N",
                  download: "N",
                  print: "N",
                },
              ],
            },
          ],
        };
    axios.post(SERVER_URL + `/saveRight`, postBody).then((res) => {
      if (res.status === 0) {
      }
    });
    let fullRightCheck = !fullRightCheckOneActivityArr[activityId];
    let newState = { ...docData };
    newState.DocumentTypeList.map((type) => {
      type.Activities.map((activity) => {
        if (activity.ActivityId == activityId) {
          giveCompleteRights(fullRightCheck, activity);
        }
      });
      setDocData(newState);
    });

    let arr = [...fullRightCheckOneActivityArr];
    arr[activityId] = fullRightCheck;
    setFullRightCheckOneActivityArr(arr);
  };

  const GetActivities = () => {
    let display = [];
    splicedColumns.map((activity, index) => {
      display.push(
        <div
          className="activities"
          // style={{ width: compact ? "14rem" : "14.5rem" }}
        >
          <div
            style={{
              backgroundColor: "white",
              height: "3.56rem",
              width: "100%",
              borderBottom: "1px solid rgb(218, 208, 194)",
              display: "flex",
              fontSize: "var(--base_text_font_size)",
              padding: "0px 10px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {activity.ActivityName}
            <Checkbox
              id="masterCheck_oneActivity_docTypes"
              checked={
                fullRightCheckOneActivityArr[activity.ActivityId] ? true : false
              }
              disabled={processType !== "L" ? true : false}
              onChange={() =>
                GiveCompleteRightsToOneActivity(activity.ActivityId)
              }
            />
            {processType !== "L" ? null : (
              <React.Fragment>
                <ArrowUpwardIcon
                  id="oneActivity_particularRight_docTypes"
                  style={{ cursor: "pointer" }}
                  type="button"
                  onClick={() => handleActivityModalOpen(activity.ActivityId)}
                />
                {openActivityModal === activity.ActivityId && (
                  <div className="relative">
                    <Backdrop
                      show={openActivityModal === activity.ActivityId}
                      clicked={handleActivityModalClose}
                    />
                    <ActivityModal
                      compact={compact}
                      fullRightCheckOneActivity={
                        fullRightCheckOneActivityArr[activity.ActivityId]
                      }
                      activityType={activity.ActivityType}
                      activityIndex={index}
                      activityId={activity.ActivityId}
                      updateActivitySetAllChecks={updateActivitySetAllChecks}
                      type={"set-all"}
                      docTypeList={docData}
                    />
                  </div>
                )}
              </React.Fragment>
            )}
          </div>

          {filteredDocTypes &&
            filteredDocTypes.map((type, index) => {
              return (
                <div
                  className="oneActivityColumn"
                  style={{
                    backgroundColor: index % 2 == 0 ? "#F2F2F2" : "white",
                    padding:
                      "1.3rem 0.5vw" /*code changes on 3 August 2022 for BugId 112560*/,
                    borderBottom: "1px solid #C2B8A3",
                    // width: compact ? "12rem" : "12.51875rem",
                  }}
                >
                  <CheckBoxes //activity CheckBoxes
                    processType={processType}
                    compact={compact}
                    activityIndex={index}
                    activityId={activity.ActivityId}
                    docTypeList={docData}
                    activityType={activity.ActivityType}
                    subActivity={activity.ActivitySubType}
                    toggleSingleChecks={toggleSingleChecks}
                  />
                </div>
              );
            })}
        </div>
      );
    });
    return display;
  };

  //mahtab code addedd
  /* function checkDocRight(docData) {
    let tempArr = [];

    docData?.DocumentTypeList?.forEach((item, j) => {
      item?.Activities?.forEach((data, x) => {
        if (
          data.Add == true ||
          data.View == true ||
          data.Download == true ||
          data.Modify == true ||
          data.Print == true ||
          data.Delete == true
        ) {
          tempArr.push(data);
        }
      });
    });

    return tempArr;
  }

  const showRight = checkDocRight(docData);
 */

  if (isLoading) {
    return <CircularProgress className="circular-progress" />;
  } else
    return docData.DocumentTypeList && docData.DocumentTypeList.length > 0 ? (
      <>
        <div className="DocTypes" style={{ overflow: "scroll" }}>
          <div className="oneDocDiv">
            <div className="docNameDiv">
              <p
                className={
                  selectedTab === "screenHeading"
                    ? "selectedBottomBorder screenHeading"
                    : "screenHeading"
                }
                style={{
                  margin:
                    direction !== RTL_DIRECTION ? "0 0.5vw 0 0" : "0 0 0 0.5vw",
                  padding: "1px 0.5vw",
                }}
                onClick={(e) => tabChangeHandler(e, "screenHeading")}
              >
                {t("docTypes")}
              </p>
              <p
                className={
                  selectedTab === "rules"
                    ? "selectedBottomBorder Rules"
                    : "Rules"
                }
                style={{
                  padding: "1px 1vw",
                }}
                onClick={(e) => tabChangeHandler(e, "rules")}
              >
                {t("rules")}
              </p>
            </div>
            {selectedTab == "screenHeading" ? (
              <React.Fragment>
                <div
                  className="docSearchDiv"
                  style={{
                    margin: "0.45rem 0rem",
                  }}
                >
                  <div className="searchBarNFilterInterface">
                    <div className="docSearchBar">
                      <SearchProject
                        setSearchTerm={setDocSearchTerm}
                        placeholder={t("search")}
                        width="240px"
                      />
                    </div>
                    {processType !== "L" ? null : (
                      <p
                        id="addDocButton"
                        onClick={() => {
                          setDocNameToModify(null);
                          setDocDescToModify(null);
                          setDocIdToModify(null);
                          handleOpen();
                        }}
                      >
                        {t("addDataObject")}
                      </p>
                    )}
                    <Modal
                      open={addDocModal}
                      onClose={handleClose}
                      aria-labelledby="simple-modal-title"
                      aria-describedby="simple-modal-description"
                    >
                      <AddDocType
                        addDocToList={addDocToList}
                        handleClose={handleClose}
                        bDocExists={bDocExists}
                        setbDocExists={setbDocExists}
                        showDocNameError={showDocNameError}
                        setShowDocNameError={setShowDocNameError}
                        docData={docData}
                        modifyDescription={modifyDescription}
                        docDescToModify={docDescToModify}
                        docNameToModify={docNameToModify}
                        docIdToModify={docIdToModify}
                        addAnotherDoc={addAnotherDoc}
                        setAddAnotherDoc={setAddAnotherDoc}
                      />
                    </Modal>
                  </div>
                </div>
                {filteredDocTypes &&
                  filteredDocTypes.map((type, index) => {
                    return (
                      <div
                        style={{
                          backgroundColor: index % 2 == 0 ? "#F2F2F2" : "white",
                          padding: "0.6rem 0.5vw",
                          borderBottom: "1px solid #C2B8A3",
                        }}
                      >
                        <div
                          className="activityNameDivDocs"
                          style={{
                            justifyContent: "space-between",
                            display: "flex",
                          }}
                        >
                          <div className="docName">
                            <span
                              style={{
                                flex: "0.9",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {type.DocName}
                            </span>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  id="masterCheck_oneDoc_docTypes"
                                  name="checkedF"
                                  style={{
                                    marginTop: "-0.125rem",
                                    marginLeft: "0.4rem",
                                  }}
                                  checked={
                                    fullRightCheckOneDocArr[index]
                                      ? true
                                      : false
                                  }
                                  disabled={processType !== "L" ? true : false}
                                  onChange={() => GiveCompleteRights(index)}
                                />
                              }
                              style={{ flex: "1" }}
                            />
                          </div>
                          {compact && processType === "L" ? (
                            <div className="relative">
                              <ArrowUpwardIcon
                                style={{ cursor: "pointer", flex: "1" }}
                                type="button"
                                onClick={() =>
                                  handleActivityModalOpen(type.DocTypeId)
                                }
                              />
                              {openActivityModal === type.DocTypeId && (
                                <React.Fragment>
                                  <Backdrop
                                    show={openActivityModal === type.DocTypeId}
                                    clicked={handleActivityModalClose}
                                  />
                                  <div
                                    style={{
                                      position: "absolute",
                                      backgroundColor: "white",
                                      top: "0px",
                                      left: "50%",
                                      zIndex: "700",
                                      padding: "5px",
                                      height: "36px",
                                      width: "256px",
                                    }}
                                  >
                                    <CheckBoxes //setAll CheckBoxes
                                      processType={processType}
                                      docIdx={index}
                                      docData={docData}
                                      id={type.ActivityId}
                                      type={"set-all"}
                                      compact={compact}
                                      updateSetAllChecks={updateSetAllChecks}
                                    />
                                  </div>
                                </React.Fragment>
                              )}
                            </div>
                          ) : null}
                          {/*code edited on 29 July 2022 for BugId 112401 and BugId 112404*/}
                          {processType === "L" ? (
                            <DeleteDocModal
                              backDrop={false}
                              modalPaper="modalPaperActivity"
                              sortByDiv="sortByDivActivity"
                              oneSortOption="oneSortOptionActivity"
                              docIndex={index}
                              buttonToOpenModal={
                                <button
                                  className="threeDotsButton"
                                  type="button"
                                  style={{ marginTop: "0.25rem" }}
                                >
                                  <MoreVertIcon
                                    style={{
                                      color: "#606060",
                                      height: "16px",
                                      width: "16px",
                                    }}
                                  />
                                </button>
                              }
                              modalWidth="180"
                              sortSectionOne={[
                                <p
                                  id="deleteDocOption"
                                  onClick={() =>
                                    deleteDocType(type.DocName, type.DocTypeId)
                                  }
                                >
                                  {t("delete")}
                                </p>,
                                <p
                                  id="modifyDocOption"
                                  onClick={() =>
                                    editDescription(
                                      type.DocTypeId,
                                      type.DocName,
                                      type.Description
                                    )
                                  }
                                >
                                  {t("view")}
                                </p>,
                              ]}
                            />
                          ) : null}
                        </div>
                        <div style={{ display: "flex" }}>
                          <div className="docDescription">
                            {type.Description}
                          </div>
                          {compact ? null : (
                            <CheckBoxes //setAll CheckBoxes
                              processType={processType}
                              compact={compact}
                              docIdx={index}
                              docData={docData}
                              id={type.ActivityId}
                              type={"set-all"}
                              updateSetAllChecks={updateSetAllChecks}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </React.Fragment>
            ) : null}
          </div>
          {/*code added on 8 June 2022 for BugId 110212*/}
          {selectedTab == "screenHeading" ? (
            <div className="activitySideDiv">
              <div className="activityHeadingDiv">
                <p className="activitySideHeading">{t("rightsOnActivities")}</p>
                <div className="actvitySearchDiv">
                  <SearchProject
                    setSearchTerm={setActivitySearchTerm}
                    placeholder={t("search")}
                    width="240px"
                  />
                </div>
              </div>
              {/* ----------------------------------------------------------- */}
              <div>
                <div className="oneBox" id="oneBoxMatrix">
                  <div style={{ display: "flex" }}>{GetActivities()}</div>
                </div>
              </div>
              {/* ------------------------------------------------------------------- */}
            </div>
          ) : (
            <Rules
              ruleDataType={docArray}
              interfaceRules={docAllRules}
              ruleType="D"
              ruleDataTableStatement={t("doctypeRemoveRecords")}
              addRuleDataTableStatement={t("doctypeAddRecords")}
              ruleDataTableHeading={t("docList")}
              addRuleDataTableHeading={t("availableDoc")}
              bShowRuleData={true}
              hideGroup={true}
              listName={t("docList")}
              availableList={t("availableDoc")}
              openProcessType={processType}
            />
          )}
        </div>
        {showDependencyModal ? (
          <DefaultModal
            show={showDependencyModal}
            style={{
              width: "45vw",
              left: "28%",
              top: "21.5%",
              padding: "0",
            }}
            modalClosed={() => setShowDependencyModal(false)}
            children={
              <ObjectDependencies
                {...props}
                processAssociation={taskAssociation}
                cancelFunc={() => setShowDependencyModal(false)}
              />
            }
          />
        ) : null}
      </>
    ) : (
      <>
        <div className="noDocTypesScreen">
          <p style={{ fontSize: "12px", marginBottom: "5px" }}>
            {t("noDocMessage")}
          </p>
          <Button
            style={{ padding: "4px", minWidth: "39px", textTransform: "none" }}
            variant="contained"
            onClick={handleOpen}
            color="primary"
          >
            {t("createDocTypes")}
          </Button>
          <Modal
            open={addDocModal}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <AddDocType
              addDocToList={addDocToList}
              handleClose={handleClose}
              bDocExists={bDocExists}
            />
          </Modal>
        </div>

        {showDependencyModal ? (
          <DefaultModal
            show={showDependencyModal}
            style={{
              width: "45vw",
              left: "28%",
              top: "21.5%",
              padding: "0",
            }}
            modalClosed={() => setShowDependencyModal(false)}
            children={
              <ObjectDependencies
                {...props}
                processAssociation={taskAssociation}
                cancelFunc={() => setShowDependencyModal(false)}
              />
            }
          />
        ) : null}
      </>
    );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps, null)(DocType);
