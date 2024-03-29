import axios from "axios";
import React, { useEffect, useState } from "react";
import { store, useGlobalState } from "state-pool";
import { BASE_URL } from "../../../Constants/appConstants";
import "./FormsListWithWorkstep.css";
import { VisibilityOutlined, VisibilityOffOutlined } from "@material-ui/icons";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
  Button,
  Checkbox,
  Popover,
  Radio,
  Tab,
  Tabs,
  TextField,
  withStyles,
} from "@material-ui/core";
import editIcon from "../../../assets/icons/edit.svg";
import deleteIcon from "../../../assets/icons/reddelete.svg";
import styles from "./FormsListWithWorkstep.module.css";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Templates from "../Templates/Templates";
import FormsOtherProcesses from "../FormsOtherProcesses/FormsOtherProcesses";
import { LaunchpadTokenSliceValue } from "../../../redux-store/slices/LaunchpadTokenSlice";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { CloseIcon } from "../../../utility/AllImages/AllImages";
import { setToastDataFunc } from "../../../redux-store/slices/ToastDataHandlerSlice";
import Modal from "../../../UI/Modal/Modal";
import ViewChangeModal from "../ViewChangeModal";

function FormsListWithWorkstep(props) {
  const dispatch = useDispatch();
  let { t } = useTranslation();
  const { formAssociationType, setformAssociationType } = props;
  const loadedProcessData = store.getState("loadedProcessData"); //current processdata clicked
  const [localLoadedProcessData] = useGlobalState(loadedProcessData);
  const formsList = store.getState("allFormsList");
  const [allFormsList, setallFormsList] = useGlobalState(formsList);
  const [selectedFormRadio, setselectedFormRadio] = useState(-1);
  const [tabValue, settabValue] = useState(0);
  const [showViewFormMF, setshowViewFormMF] = useState(false);
  const [mfFormId, setmfFormId] = useState();
  const [allActivities, setallActivities] = useState([]);
  const [hoverForm, sethoverForm] = useState();
  const [formAssociationData, setformAssociationData] = useGlobalState(
    "allFormAssociationData"
  );
  const selTemplateData = store.getState("selectedTemplateData");
  const [selectedTemplateData, setselectedTemplateData] =
    useGlobalState(selTemplateData);
  const [openCreateFormPopover, setopenCreateFormPopover] = useState(false);
  const tokenValue = useSelector(LaunchpadTokenSliceValue);

  useEffect(() => {
    let arr = [];
    formAssociationData.forEach((assocData) => {
      arr.push(+assocData.formId);
    });
    const result = arr.every((element) => {
      if (element === arr[0]) {
        return true;
      }
    });
    if (result) setselectedFormRadio(arr[0]);
  }, [formAssociationData.length]);

  const CustomRadio = withStyles({
    root: {
      "&$checked": {
        color: "var(--radio_color)",
      },
    },
    checked: {},
  })((props) => <Radio type="radio" color="default" {...props} />);
  const useStyles = makeStyles({
    input: {
      height: "2rem",
    },
  });
  const classes = useStyles();

  const AntTabs = withStyles({
    root: {
      borderBottom: "1px solid #e8e8e8",
      width: "70%",
      maxHeight: 40,
      minHeight: 10,
      fontSize: "var(--title_text_font_size)",
    },
    indicator: {
      backgroundColor: "var(--nav_primary_color)",
    },
  })(Tabs);

  const AntTab = withStyles((theme) => ({
    root: {
      minWidth: 50,
      minHeight: 10,
      maxHeight: 40,
      fontWeight: theme.typography.fontWeightRegular,
      //marginRight: theme.spacing(4),
      whiteSpace: "nowrap",
      fontSize: "var(--title_text_font_size)",

      "&$selected": {
        color: "var(--selected_tab_color)",
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: "var(--title_text_font_size)",
      },
    },
    selected: {},
  }))((props) => <Tab disableRipple {...props} />);
  const handleChange = (event, newValue) => {
    settabValue(newValue);
  };

  useEffect(() => {
    props.settemplateData(null);
    setshowViewFormMF(false);
    setmfFormId(undefined);
  }, [tabValue]);

  useEffect(() => {
    moment.locale("en");
  }, []);
  const handleViewForm = ({ formId }) => {
    setshowViewFormMF(true);
    setmfFormId(formId);
  };
  useEffect(() => {
    if (formAssociationData.length > 0) {
      let passedData = {
        // applicationId: activeId,

        component: "preview",

        containerId: "mf_forms_show",

        formDefId: +mfFormId,

        processId: +localLoadedProcessData.ProcessDefId,

        // formName: obj.value.formName,

        // formType: props.formType,

        formPageType: "Processes",

        statusType: localLoadedProcessData.ProcessType,
      };
      window.loadFormBuilderPreview(passedData, "mf_forms_show");
    }
  }, [mfFormId]);
  useEffect(() => {
    localLoadedProcessData.MileStones.forEach((mileStone) => {
      mileStone.Activities.forEach((activity, index) => {
        if (
          activity.ActivityType === 1 ||
          activity.ActivityType === 2 ||
          activity.ActivityType === 32 ||
          activity.ActivityType === 4 ||
          (activity.ActivityType === 10 &&
            (activity.ActivitySubType === 3 ||
              activity.ActivitySubType === 10 ||
              activity.ActivitySubType === 7 ||
              activity.ActivitySubType === 6))
        )
          setallActivities((prevState) => [...prevState, activity]);
      });
    });
  }, []);

  const handleNewFormCreate = () => {
    setopenCreateFormPopover(true);
  };

  const handleFile = async (event) => {
    const file = event.target.files[0];
    let formData = new FormData();
    formData.append("file", file);
    formData.append("formName", file?.name.split(".").slice(0, -1).join("."));
    formData.append("processDefId", +localLoadedProcessData.ProcessDefId);

    const res = await axios.post(BASE_URL + `/process/local/form`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: tokenValue,
      },
    });
    if (res.status === 200 && res?.data?.statusCodeValue === 200) {
      let temp = JSON.parse(JSON.stringify(allFormsList));
      temp.push(res?.data?.body);
      setallFormsList(temp);
      dispatch(
        setToastDataFunc({
          message: t("formImported"),
          severity: "error",
          open: true,
        })
      );
    }
  };

  const NewFormPopover = () => {
    const [newFormName, setnewFormName] = useState("");
    const handleCreateNewForm = async () => {
      let processType =
        localLoadedProcessData.ProcessType === "L" ? "local" : "registered";
      const res = await axios.post(
        BASE_URL + `/process/${processType}/form`,
        {
          formBuffer: "",
          formName: newFormName,
          processDefId: +localLoadedProcessData.ProcessDefId,
        }
        // {
        //   headers: {
        //     Authorization: tokenLp.token,
        //   },
        // }
      );
      let temp = JSON.parse(JSON.stringify(allFormsList));
      temp.push(res?.data);
      setallFormsList(temp);
      setopenCreateFormPopover(false);
    };
    return (
      <div
        style={{
          width: "32%",
          height: "30%",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: "9999",
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgb(0,0,0,0.4)",
          background: "white",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "30%",
            borderBottom: "1px solid rgb(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            paddingInline: "15px",
            fontSize: "var(--base_text_font_size)",
            fontWeight: "bold",
          }}
        >
          {t("newForm")}
        </div>
        <div
          style={{
            width: "100%",
            height: "45%",

            display: "flex",
            flexDirection: "column",

            paddingInline: "15px",

            fontWeight: "500",
            paddingTop: "3%",
            color: "#606060",
          }}
        >
          <p
            style={{
              marginBottom: "5px",
              fontSize: "var(--title_text_font_size)",
            }}
          >
            {t("formName")}
          </p>
          <TextField
            value={newFormName}
            onChange={(e) => setnewFormName(e.target.value)}
            InputProps={{
              className: classes.input,
            }}
            maxRows={3}
            fullWidth={true}
            size="small"
            autoFocus={true}
            variant="outlined"
            style={{ fontSize: "var(--base_text_font_size)" }}
          />
        </div>
        <div
          style={{
            width: "100%",
            height: "25%",

            display: "flex",
            flexDirection: "row-reverse",
            alignItems: "center",
            // paddingInline: "10px",
            fontSize: "var(--base_text_font_size)",
            fontWeight: "bold",
          }}
        >
          <button
            disabled={newFormName.trim() === "" ? true : false}
            style={{
              marginInline: "5px",
              width: "50px",
              height: "25px",
              background:
                newFormName.trim() === ""
                  ? "rgb(0, 114, 198, 0.5)"
                  : "var(--button_color)",
              border: "none",
              color: "white",
            }}
            onClick={() => handleCreateNewForm()}
          >
            {t("create")}
          </button>
          <button
            style={{
              width: "50px",
              height: "25px",
              background: "white",
              border: "1px solid #C4C4C4",
              color: "#606060",
            }}
            onClick={() => setopenCreateFormPopover(false)}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    );
  };
  const CustomiseFormPopover = ({ formId, setopenCustomiseForm }) => {
    useEffect(() => {
      if (formAssociationData.length > 0) {
        let passedData = {
          // applicationId: activeId,
          component: "app",
          // containerId: "mf_formPreview",
          formDefId: +formId,
          processId: +localLoadedProcessData.ProcessDefId,
          //formName: obj.value.formName,
          //formType: props.formType,
          //formPageType: formType,
          processName: localLoadedProcessData.ProcessName,
          statusType: localLoadedProcessData.ProcessType,
          token: JSON.parse(localStorage.getItem("launchpadKey"))?.token,
        };
        window.loadFormBuilder("mf_forms_customise", passedData);
      }
    }, [formId]);

    return (
      <div
        style={{
          width: "98vw",
          height: "98vh",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: "9999",
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgb(0,0,0,0.4)",
          background: "white",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "8%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: "1.5rem",
          }}
        >
          <p style={{ fontSize: "var(--title_text_font_size)" }}>
            Form Builder
          </p>
          <CloseIcon
            onClick={() => setopenCustomiseForm(false)}
            style={{
              width: "1.3rem",
              height: "1.3rem",
              cursor: "pointer",
            }}
          />
        </div>
        <div style={{ width: "100%", height: "92%", overflow: "hidden" }}>
          <div id="mf_forms_customise" style={{ height: "inherit" }}></div>
        </div>
      </div>
    );
  };
  const SingleFormView = ({ formAssociationData, settemplateData }) => {
    const [openCustomiseForm, setopenCustomiseForm] = useState(false);
    const getFormDetailsById = (id) => {
      let temp = {};
      allFormsList.some((form) => {
        if (form.formId + "" === id + "") {
          temp = form;
          return true;
        }
      });
      return temp;
    };
    const handleRadioClickForm = (e) => {
      let id = +e.target.value;

      const otherActData = [];
      setselectedFormRadio(id);
      let temp = JSON.parse(JSON.stringify(formAssociationData));
      temp?.forEach((assocData) => {
        assocData.formId = id + "";
      });
      allActivities.forEach((act) => {
        otherActData.push({
          activity: {
            actId: act.ActivityId + "",
            actName: act.ActivityName,
          },
          formId: id + "",
        });
      });
      let newArr = [...temp, ...otherActData];
      const unique = [
        ...new Map(newArr.map((item) => [item.activity.actId, item])).values(),
      ];

      setformAssociationData(unique);
    };
    const [open, setopen] = useState(false);
    const handleClose = () => {
      setAnchorElMF(null);
      setopen(false);
    };
    const [selectedPopoverForm, setselectedPopoverForm] = useState("");
    const [anchorElMF, setAnchorElMF] = React.useState(null);
    const handleTypeChangeMF = (event, form) => {
      setopen(true);
      setAnchorElMF(event?.currentTarget);
      setselectedPopoverForm(form);
    };

    const [viewChangeConfirmationBoolean, setviewChangeConfirmationBoolean] =
      useState(false);
    const viewChangeHandler = () => {
      setviewChangeConfirmationBoolean(true);
    };
    return (
      <>
        <div
          style={{
            width: "100%",

            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Popover
            open={open}
            anchorEl={anchorElMF}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <div
              style={{
                width: "10rem",
                height: "5rem",
                display: "flex",
                flexDirection: "column",
                padding: "0.5rem",
                fontSize: "var(--base_text_font_size)",
                border: "1px solid #70707075",
                cursor: "pointer",
              }}
            >
              <div
                style={{ marginBlock: "4px" }}
                onClick={() => handleViewForm(selectedPopoverForm)}
              >
                <img src={editIcon} alt={t("edit")} />
                <span style={{ marginInline: "10px" }}>{t("edit")}</span>
              </div>
              <div>
                <img src={deleteIcon} alt={t("delete")} />
                <span style={{ color: "red", marginInline: "10px" }}>
                  {t("delete")}
                </span>
              </div>
            </div>
          </Popover>
          {openCustomiseForm && (
            <CustomiseFormPopover
              formId={mfFormId}
              setopenCustomiseForm={setopenCustomiseForm}
            />
          )}
          {openCreateFormPopover && <NewFormPopover />}
          <AntTabs
            value={tabValue}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <AntTab label={t("Forms created for this process")} />
            <AntTab label={t("Forms in other processes")} />
            <AntTab label={t("templates")} />
          </AntTabs>
          <div>
            <p
              style={{
                fontSize: "var(--subtitle_text_font_size)",
                fontWeight: "600",
                color: "var(--link_color)",
                cursor: "pointer",
              }}
              onClick={() => viewChangeHandler()}
            >
              {t("Workstepwiseformassociation")}
            </p>
          </div>
        </div>
        {viewChangeConfirmationBoolean ? (
          <Modal
            show={viewChangeConfirmationBoolean}
            // backDropStyle={{ backgroundColor: "transparent" }}
            style={{
              top: "50%",
              left: "50%",
              width: "450px",
              padding: "0",
              zIndex: "1500",
              transform: "translate(-50%,-50%)",
              boxShadow: "0px 3px 6px #00000029",
              border: "1px solid #D6D6D6",
              borderRadius: "3px",
            }}
            modalClosed={() => setviewChangeConfirmationBoolean(false)}
            children={
              <ViewChangeModal
                setformAssociationType={setformAssociationType}
                setviewChangeConfirmationBoolean={
                  setviewChangeConfirmationBoolean
                }
                formAssociationData={formAssociationData}
                setformAssociationData={setformAssociationData}
              />
            }
          />
        ) : null}

        {tabValue === 0 ? (
          <div
            style={{
              width: "75%",
              height: "9%",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              paddingLeft: "6.25rem",
              marginTop: "0.6rem",
            }}
          >
            <p className={styles.heading}>Form Name</p>
            {!showViewFormMF ? (
              <p className={styles.heading}>Created by</p>
            ) : null}
            {!showViewFormMF ? (
              <p className={styles.heading}>Last Edited on</p>
            ) : null}
          </div>
        ) : null}
        <div
          style={{
            width: "100%",
            height: "90%",
            display: "flex",

            flexDirection: "row",
          }}
        >
          <div
            style={{
              width: !showViewFormMF ? "100%" : "50%",
              height: "100%",
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "column",
              paddingInline: "0.8rem",
              paddingBlock: "0",
            }}
          >
            {tabValue === 0 ? (
              <div style={{ height: "75%", overflowY: "scroll" }}>
                {allFormsList.map((form) => (
                  <div
                    style={{
                      width: "100%",
                      height: "40px",
                      border:
                        selectedFormRadio === form.formId
                          ? "1px solid #0172C6"
                          : "1px solid transparent",
                      marginBlock: "2px",
                      // color: "var(--button_color)",
                      fontWeight: "600",
                      background: "#FFFFFF 0% 0% no-repeat padding-box",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: showViewFormMF ? "space-between" : "",
                    }}
                  >
                    <div
                      style={{
                        width: "40%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        // fontSize: "0.8rem",
                        justifyContent: "flex-start",
                        paddingLeft: "18px",
                        fontWeight: "500",
                      }}
                    >
                      <CustomRadio
                        type="radio"
                        // size="small"
                        checked={selectedFormRadio === form.formId}
                        onChange={handleRadioClickForm}
                        value={form.formId}
                        name="radio-button-demo"
                      />
                      <p
                        style={{
                          fontSize: "var(--base_text_font_size)",
                          fontWeight: "bold",
                        }}
                      >
                        {form.deviceType}
                      </p>
                      <p
                        style={{
                          fontSize: "var(--base_text_font_size)",
                          fontWeight: "500",
                          marginInline: "0.6rem",
                        }}
                      >
                        {form.formName}
                      </p>
                    </div>
                    {!showViewFormMF ? (
                      <>
                        {form.formId !== -1 ? (
                          <div
                            style={{
                              width: "30%",
                              display: "flex",
                              alignItems: "flex-start",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            <p
                              style={{
                                fontSize: "var(--base_text_font_size)",
                                fontWeight: "500",
                              }}
                            >
                              {form.createdby}
                            </p>
                            <p
                              style={{
                                fontSize: "var(--base_text_font_size)",
                                fontWeight: "500",
                                opacity: "0.7",
                              }}
                            >
                              at {moment(form.createddatetime).format("h:mm A")}
                            </p>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                    {!showViewFormMF ? (
                      <>
                        {form.formId !== -1 ? (
                          <div
                            style={{
                              width: "30%",
                              display: "flex",
                              alignItems: "flex-start",
                              flexDirection: "column",
                              justifyContent: "center",
                            }}
                          >
                            <p
                              style={{
                                fontSize: "var(--base_text_font_size)",
                                fontWeight: "500",
                              }}
                            >
                              {moment(form.lastModifiedOn).format("MMM DD")}
                            </p>
                            <p
                              style={{
                                fontSize: "var(--base_text_font_size)",
                                fontWeight: "500",
                                opacity: "0.7",
                              }}
                            >
                              Edited by {form.lastModifiedby} at{" "}
                              {moment(form.lastModifiedOn).format("h:mm A")}
                            </p>
                          </div>
                        ) : null}
                      </>
                    ) : null}

                    {form.formId !== -1 ? (
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          padding: "5px",
                          justifyContent: "flex-end",
                        }}
                      >
                        {mfFormId === form.formId ? (
                          <VisibilityOffOutlined
                            onClick={() => {
                              setshowViewFormMF((prev) => !prev);
                              setmfFormId(null);
                            }}
                            fontSize="medium"
                            style={{
                              color: "black",
                              opacity: "0.5",
                              width: "1.6rem",
                              height: "1.6rem",
                            }}
                          />
                        ) : (
                          <>
                            <VisibilityOutlined
                              onClick={() => handleViewForm(form)}
                              fontSize="medium"
                              style={{
                                color: "black",
                                opacity: "0.5",
                                width: "1.6rem",
                                height: "1.6rem",
                              }}
                            />
                            <MoreVertIcon
                              onClick={(e) => handleTypeChangeMF(e, form)}
                              className={styles.moreVertIcon}
                            />
                          </>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
            {tabValue === 1 ? (
              <div
                style={{
                  width: "100%",
                  height: "80%",
                  display: "flex",

                  flexDirection: "row",
                }}
              >
                <FormsOtherProcesses
                  formAssociationData={formAssociationData}
                />
              </div>
            ) : null}
            {tabValue === 2 ? (
              <Templates
                formAssociationData={formAssociationData}
                settemplateData={settemplateData}
              />
            ) : null}

            <div
              style={{
                width: "100%",
                height: "25%",
                border: "1px dashed #606060",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingInline: "5%",
              }}
            >
              <p
                style={{
                  fontSize: "var(--title_text_font_size)",
                  color: "#606060",
                  fontWeight: "600",
                }}
              >
                Drop forms here
              </p>
              <p
                style={{
                  fontSize: " var(--title_text_font_size)",
                  color: "#606060",
                  fontWeight: "600",
                }}
              >
                OR
              </p>
              <div
                style={{
                  display: "flex",

                  flexDirection: !showViewFormMF ? "row" : "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "24rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "11rem",
                    whiteSpace: "nowrap",
                    height: "2.3rem",
                    fontSize: "var(--base_text_font_size)",
                    border: "1px solid var(--button_color)",
                    color: "var(--button_color)",
                  }}
                >
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e)}
                    accept="application/x-zip-compressed"
                  />
                  {t("Import From Pc")}
                </label>

                <Button
                  // style={{ marginInline: "0.8rem" }}
                  className={styles.button}
                  variant="outlined"
                  onClick={handleNewFormCreate}
                >
                  Create New Form
                </Button>
              </div>
            </div>
          </div>
          {showViewFormMF ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                height: "100%",
                fontSize: "var(--title_text_font_size)",
                background: "#0172C61A",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  height: "15%",
                  justifyContent: "space-between",
                  paddingInline: "2%",
                }}
              >
                <p style={{ fontWeight: "600" }}>
                  {getFormDetailsById(mfFormId).formName}
                </p>
                <div>
                  <button
                    style={{
                      width: "150px",
                      height: "1.75rem",
                      marginInline: "10px",
                      color: "var(--button_color)",
                      border: "1px solid var(--button_color)",
                      borderRadius: "0.125rem",
                    }}
                    onClick={() => setopenCustomiseForm(true)}
                  >
                    {t("customiseThisForm")}
                  </button>
                  <CloseIcon onClick={() => setshowViewFormMF(false)} />
                </div>
              </div>
              <div
                id="mf_forms_show"
                style={{
                  width: "96%",
                  height: "85%",
                  overflow: "hidden",
                  display: showViewFormMF ? "" : "none",
                }}
              ></div>
            </div>
          ) : null}
        </div>
      </>
    );
  };

  const MultipleFormsView = ({
    formAssociationData,
    setformAssociationData,
  }) => {
    function sameMembers(arr1, arr2) {
      const set1 = new Set(arr1);
      const set2 = new Set(arr2);
      return (
        arr1.every((item) => set2.has(item)) &&
        arr2.every((item) => set1.has(item))
      );
    }

    const checkAllFormEnabled = (formId) => {
      if (!formId) {
        let actArr = [];
        let assocArr = [];
        allActivities.forEach((act) => {
          actArr.push(+act.ActivityId);
        });
        formAssociationData.forEach((assocData) => {
          if (assocData.activity?.operationType !== "D")
            assocArr.push(+assocData.activity.actId);
        });

        return sameMembers(actArr, assocArr);
      } else {
        let flag = true;
        let temp = global.structuredClone(formAssociationData);
        temp.forEach((assocData) => {
          if (assocData.formId != formId) flag = false;
        });
        return flag;
      }
    };
    const getCheckBoolFormAssoc = (formId, actId) => {
      let temp = false;
      formAssociationData?.some((assocData) => {
        if (assocData.activity.actId == actId) {
          if (assocData.formId == formId) temp = true;
          return true;
        }
      });

      return temp;
    };

    const handleFormAssocChange = (e, actId, actName, formName) => {
      let temp = JSON.parse(JSON.stringify(formAssociationData));
      temp?.some((assocData) => {
        if (assocData.activity.actId == actId) {
          assocData.formId = e.target.value + "";

          return true;
        }
      });

      let newAssoc = {
        activity: { actId: actId + "", actName },
        formId: e.target.value + "",
      };
      temp.push(newAssoc);
      const unique = [
        ...new Map(temp.map((item) => [item.activity.actId, item])).values(),
      ];
      setformAssociationData(unique);
      props.modifiedAssociationJson(unique);
    };
    const getFormDetailsById = (id) => {
      let temp = {};
      allFormsList.some((form) => {
        if (form.formId + "" === id + "") {
          temp = form;
          return true;
        }
      });
      return temp;
    };
    const extraHeaders = [
      { formName: "Form Enabled" },
      { formName: "Workstep Name" },
    ];

    const checkFormEnabled = (actId) => {
      let temp = false;
      formAssociationData.forEach((assocData) => {
        if (
          assocData.activity.actId == actId &&
          assocData.activity?.operationType !== "D"
        )
          temp = true;
      });
      return temp;
    };

    const formEnabledHandler = (e, act) => {
      let temp = global.structuredClone(formAssociationData);
      if (!e.target.checked) {
        temp.forEach((assocData, index) => {
          if (assocData.activity.actId == act.ActivityId) {
            assocData.activity.operationType = "D";
          }
        });
      } else {
        temp.push({
          formId: "-1",
          activity: {
            actId: act.ActivityId,
            actName: act.ActivityName,
          },
        });
      }
      setformAssociationData(temp);
    };

    const formCheckHandler = (e, formId) => {
      let temp = global.structuredClone(formAssociationData);

      if (e.target.checked) {
        temp = [];
        allActivities.forEach((act) => {
          temp.push({
            formId: !!formId ? formId : "-1",
            activity: {
              actId: act.ActivityId,
              actName: act.ActivityName,
            },
          });
        });
      } else {
        temp = [];
        allActivities.forEach((act) => {
          temp.push({
            formId: !!formId ? formId : "",
            activity: {
              actId: act.ActivityId,
              actName: act.ActivityName,
              operationType: "D",
            },
          });
        });
      }

      setformAssociationData(temp);
    };
    const [open, setopen] = useState(false);
    const handleClose = () => {
      setAnchorElMF(null);
      setopen(false);
    };
    const [anchorElMF, setAnchorElMF] = React.useState(null);
    const [selectedPopoverForm, setselectedPopoverForm] = useState("");
    const handleTypeChangeMF = (event, form) => {
      setopen(true);
      setAnchorElMF(event?.currentTarget);
      setselectedPopoverForm(form);
    };
    const [viewChangeConfirmationBoolean, setviewChangeConfirmationBoolean] =
      useState(false);
    const viewChangeHandler = () => {
      setviewChangeConfirmationBoolean(true);
    };

    return (
      <div
        style={{
          display: showViewFormMF ? "flex" : "",
          flexDirection: showViewFormMF ? "row" : "",
          width: "100%",
          height: "100%",
        }}
      >
        {viewChangeConfirmationBoolean ? (
          <Modal
            show={viewChangeConfirmationBoolean}
            // backDropStyle={{ backgroundColor: "transparent" }}
            style={{
              top: "50%",
              left: "50%",
              width: "450px",
              padding: "0",
              zIndex: "1500",
              transform: "translate(-50%,-50%)",
              boxShadow: "0px 3px 6px #00000029",
              border: "1px solid #D6D6D6",
              borderRadius: "3px",
            }}
            modalClosed={() => setviewChangeConfirmationBoolean(false)}
            children={
              <ViewChangeModal
                setformAssociationType={setformAssociationType}
                setviewChangeConfirmationBoolean={
                  setviewChangeConfirmationBoolean
                }
                formAssociationData={formAssociationData}
                setformAssociationData={setformAssociationData}
              />
            }
          />
        ) : null}
        <Popover
          open={open}
          anchorEl={anchorElMF}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <div
            style={{
              width: "10rem",
              height: "5rem",
              display: "flex",
              flexDirection: "column",
              padding: "0.5rem",
              fontSize: "var(--base_text_font_size)",
              border: "1px solid #70707075",
              cursor: "pointer",
            }}
          >
            <div
              style={{ marginBlock: "4px" }}
              onClick={() => handleViewForm(selectedPopoverForm)}
            >
              <img src={editIcon} alt={t("edit")} />
              <span style={{ marginInline: "10px" }}>{t("edit")}</span>
            </div>
            <div>
              <img src={deleteIcon} alt={t("delete")} />
              <span style={{ color: "red", marginInline: "10px" }}>
                {t("delete")}
              </span>
            </div>
          </div>
        </Popover>
        {openCreateFormPopover && <NewFormPopover />}
        <div
          style={{
            display: "flex",
            width: !showViewFormMF ? "100%" : "50%",

            height: "100%",
            flexDirection: "column",
          }}
        >
          {props.showswappingHeader ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row-reverse",
                width: "100%",
                height: "10%",
              }}
            >
              <p
                style={{
                  fontSize: "var(--subtitle_text_font_size)",
                  fontWeight: "600",
                  color: "#0172C6",
                  cursor: "pointer",
                }}
                onClick={() => viewChangeHandler()}
              >
                {t("singleFormCompleteProcess")}
              </p>
            </div>
          ) : null}
          <div
            style={{
              overflowY: "scroll",
              overflowX: "scroll",
              width: "100%",
              height: "70%",
            }}
          >
            <div className={styles.multipleTableDiv}>
              {[...extraHeaders, ...allFormsList].map((form) => (
                <div
                  className={styles.multipleTableContainer}
                  style={{
                    // textAlign: "left",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  onMouseEnter={() => sethoverForm(form)}
                  onMouseLeave={() => sethoverForm(null)}
                >
                  {" "}
                  {form.formName !== "Workstep Name" ? (
                    <Checkbox
                      checked={checkAllFormEnabled(form.formId)}
                      onChange={(e) => formCheckHandler(e, form.formId)}
                    />
                  ) : null}
                  <p
                    style={{
                      fontSize: "var(--base_text_font_size)",
                      fontWeight: "bold",
                      marginBottom: "0",
                      marginInline: "10px",
                    }}
                  >
                    {form.formName}
                  </p>
                  {/* {form.formId === hoverForm?.formId &&
                  form.formName !== "Workstep Name" &&
                  form.formName !== "Form Enabled" &&
                  form.formId !== -1 ? (
                    <VisibilityOutlined
                      onClick={() => handleViewForm(form)}
                      fontSize="medium"
                      style={{ color: "black", opacity: "0.3" }}
                    />
                  ) : null} */}
                  {form.formName !== "Workstep Name" &&
                  form.formName !== "Form Enabled" ? (
                    <MoreVertIcon
                      onClick={(e) => handleTypeChangeMF(e, form)}
                      className={styles.moreVertIcon}
                    />
                  ) : null}
                </div>
              ))}
            </div>
            <div style={{ width: "100%", height: "90%" }}>
              {allActivities.map((act) => (
                <div
                  className={styles.multipleTableDiv}
                  // onMouseEnter={() => sethoverForm(null)}
                >
                  <div
                    className={styles.multipleTableContainer}
                    // style={{ textAlign: "left" }}
                  >
                    <Checkbox
                      checked={checkFormEnabled(act.ActivityId)}
                      onChange={(e) => formEnabledHandler(e, act)}
                    />
                  </div>

                  <div
                    className={styles.multipleTableContainer}
                    // style={{ textAlign: "left" }}
                  >
                    <p
                      style={{
                        fontSize: "var(--base_text_font_size)",
                        fontWeight: "bold",
                      }}
                    >
                      {act.ActivityName}
                    </p>
                  </div>
                  {/* <div
                    className={styles.multipleTableContainer}
                    style={{ textAlign: "left" }}
                  > */}
                  {allFormsList.map((form) => (
                    <div
                      className={`${styles.multipleTableContainer} radioAlign`}
                    >
                      <Radio
                        value={form.formId + ""}
                        checked={getCheckBoolFormAssoc(
                          form.formId,
                          act.ActivityId
                        )}
                        disabled={!checkFormEnabled(act.ActivityId)}
                        onChange={(e) =>
                          handleFormAssocChange(
                            e,
                            act.ActivityId,
                            act.ActivityName,
                            form.formName
                          )
                        }
                        size="medium"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {props.showOtherOptions ? (
            <div
              style={{
                width: "100%",
                height: "20%",
                border: "1px dashed #606060",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingInline: "5%",
              }}
            >
              <p
                style={{
                  fontSize: "var(--title_text_font_size)",
                  color: "#606060",
                  fontWeight: "600",
                }}
              >
                Drop forms here
              </p>
              <p
                style={{
                  fontSize: " var(--title_text_font_size)",
                  color: "#606060",
                  fontWeight: "600",
                }}
              >
                OR
              </p>
              <div
                style={{
                  display: "flex",

                  flexDirection: !showViewFormMF ? "row" : "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "24rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "11rem",
                    whiteSpace: "nowrap",
                    height: "2.3rem",
                    fontSize: "var(--base_text_font_size)",
                    border: "1px solid var(--button_color)",
                    color: "var(--button_color)",
                  }}
                >
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e)}
                    accept="application/x-zip-compressed"
                  />
                  {t("Import From Pc")}
                </label>

                <Button
                  // style={{ marginInline: "0.8rem" }}
                  className={styles.button}
                  variant="outlined"
                  onClick={handleNewFormCreate}
                >
                  Create New Form
                </Button>
              </div>
            </div>
          ) : null}
        </div>
        {showViewFormMF ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "50%",
              height: "100%",
              fontSize: "var(--title_text_font_size)",
              background: "#0172C61A",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                height: "15%",
                justifyContent: "space-between",
                paddingInline: "2%",
              }}
            >
              <p style={{ fontWeight: "600" }}>
                {getFormDetailsById(mfFormId).formName}
              </p>
              <div>
                {" "}
                <button
                  style={{
                    width: "150px",
                    height: "1.75rem",
                    marginInline: "10px",
                    color: "var(--button_color)",
                    border: "1px solid var(--button_color)",
                    borderRadius: "0.125rem",
                  }}
                  // onClick={() => window.loa(true)}
                >
                  {t("customiseThisForm")}
                </button>
                <CloseIcon onClick={() => setshowViewFormMF(false)} />
              </div>
            </div>
            <div
              id="mf_forms_show"
              style={{
                width: "96%",
                height: "85%",
                overflow: "hidden",
                display: showViewFormMF ? "" : "none",
              }}
            ></div>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        padding: "0.8rem",
      }}
    >
      {formAssociationType === "single" ? (
        <SingleFormView
          formAssociationData={formAssociationData}
          settemplateData={props.settemplateData}
        />
      ) : (
        <MultipleFormsView
          formAssociationData={formAssociationData}
          setformAssociationData={setformAssociationData}
          formAssociationType={formAssociationType}
          setformAssociationType={setformAssociationType}
        />
      )}
    </div>
  );
}

export default FormsListWithWorkstep;
