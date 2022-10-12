import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ModalForm from "./../../../../UI/ModalForm/modalForm";
import Field from "./../../../../UI/InputFields/TextField/Field";
import { useTranslation } from "react-i18next";
import { Grid, Button, Typography } from "@material-ui/core";

import { useHistory } from "react-router-dom";
import { DeleteIcon } from "../../../../utility/AllImages/AllImages";
import { useRef } from "react";
import { FieldValidations } from "../../../../utility/FieldValidations/fieldValidations";

const useStyles = makeStyles((props) => ({
  container: {
    marginTop: "4rem",
  },
  deleteBtn: {
    marginTop: ".5rem",
    width: "1.3rem",
    height: "1.3rem",
  },
  comboValues: {
    width: "100%",
    overflowY: "scroll",
    padding: "10px",
    height: "19vh",
    border: "1px solid #CECECE",
    "&::-webkit-scrollbar": {
      backgroundColor: "transparent",
      width: "0.375rem",
      height: "1.125rem",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
      borderRadius: "0.313rem",
    },

    "&:hover::-webkit-scrollbar": {
      overflowY: "visible",
      width: "0.375rem",
      height: "1.125rem",
    },
    "&:hover::-webkit-scrollbar-thumb": {
      background: "#8c8c8c 0% 0% no-repeat padding-box",
      borderRadius: "0.313rem",
    },
  },
}));

/*Making inputs for fields */
const makeFieldInputs = (value) => {
  return {
    value: value,
    error: false,
    helperText: "",
  };
};

const ComboValuesModal = (props) => {
  let { t } = useTranslation();

  const { editedComboVar, isReadOnly } = props;
  const [open, setOpen] = useState(props.isOpen ? true : false);
  const [valueType, setValueType] = useState("");
  const [comboVal, setComboVal] = useState(makeFieldInputs(""));
  const [dynamicVal, setDynamicVal] = useState(makeFieldInputs(""));
  const [comboValList, setComboValList] = useState([]);

  const radioButtonsArrayForValueType = [
    { label: t("static"), value: "static" },
    { label: t("dynamic"), value: "dynamic" },
  ];

  useEffect(() => {
    if (editedComboVar) {
      if (editedComboVar.m_strDBLinking === "Y") {
        setValueType("dynamic");
        setDynamicVal({
          ...dynamicVal,
          value: editedComboVar.m_arrComboPickList[0]?.name,
        });
      } else {
        setValueType("static");
      }
      setComboValList(editedComboVar.m_arrComboPickList || []);
    }
  }, [editedComboVar]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "ValueType":
        setValueType(value);
        break;
      case "ComboValue":
        setComboVal({ ...comboVal, value });
        break;
      case "DynamicValue":
        setDynamicVal({ ...dynamicVal, value });
        break;
      default:
        break;
    }
  };

  const handleClose = () => {
    setOpen(false);

    props.handleClose();
  };
  const onClick1 = () => {
    handleClose();
  };
  const onClick2 = () => {
    const newComboVar = { ...editedComboVar };
    if (valueType === "static") {
      newComboVar["m_strDBLinking"] = "N";
      newComboVar["m_arrComboPickList"] = [...comboValList].map((item) => ({
        ...item,
        orderId: 0,
      }));
    } else {
      newComboVar["m_strDBLinking"] = "Y";
      newComboVar["m_arrComboPickList"] = [
        { name: dynamicVal.value, orderId: 0 },
      ];
    }
    props.saveComboVal && props.saveComboVal(newComboVar);
  };
  const handleComboValueList = () => {
    const comboList = [...comboValList];
    if (comboVal.value) {
      const newCombo = { name: comboVal.value };
      setComboValList([...comboList, newCombo]);
      /*****************************************************************************************
       * @author asloob_ali BUG ID : 111424   Description : Task Workdesk: Delete button for combo Box is deleting every value which are added except the one which should be deleted
       * Reason: state  updatation was not correct, only deleted values were getting updated.
       *  Resolution :updated state correctly.
       *  Date : 30/08/2022             **************/
      setComboVal({ ...comboVal, value: "" });
    }
  };

  const handleDeleteComboValue = (index) => {
    const comboList = [...comboValList];
    comboList.splice(index, 1);
    setComboValList(comboList);
  };

  return (
    <ModalForm
      isOpen={open}
      title={`${t("combo")} ${t("box")} ${t("value")} ${t("definition")}`}
      Content={
        <Content
          valueType={valueType}
          radioButtonsArrayForValueType={radioButtonsArrayForValueType}
          comboVal={comboVal}
          comboValList={comboValList}
          dynamicVal={dynamicVal}
          handleChange={handleChange}
          handleComboValueList={handleComboValueList}
          handleDeleteComboValue={handleDeleteComboValue}
          editedComboVar={editedComboVar}
          isReadOnly={isReadOnly}
        />
      }
      btn1Title={t("cancel")}
      btn2Title={t("save")}
      headerCloseBtn={true}
      onClickHeaderCloseBtn={handleClose}
      onClick1={onClick1}
      onClick2={onClick2}
      closeModal={handleClose}
      containerHeight={317}
      containerWidth={640}
    />
  );
};
export default ComboValuesModal;

{
  /*Fields, content of the modal */
}
const Content = ({
  valueType,
  radioButtonsArrayForValueType,
  handleChange,
  comboVal,
  comboValList,
  dynamicVal,
  handleComboValueList,
  handleDeleteComboValue,
  editedComboVar,
  isReadOnly,
}) => {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  console.log(editedComboVar.m_strVariableType);

  const classes = useStyles({ direction });
  const comboValRef=useRef();
  /*****************************************************************************************
     * @author asloob_ali BUG ID : 111440 Description : 111440 -  Task Combo Box IBPS 5 Comparison: the static field does not allow to type, it allows only integer values which is not the case with IBPS 5
     *  Reason: input type was mapped to the wrong m_iVariableType key not correct.
     * Resolution : now input type is mapped with m_strVariableType.
  
     *  Date : 01/07/2022             ****************/
  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Field
            radio={true}
            ButtonsArray={radioButtonsArrayForValueType}
            name="ValueType"
            value={valueType}
            onChange={handleChange}
            disabled={isReadOnly}
          />
        </Grid>
        {valueType === "static" && (
          <>
            <Grid item container spacing={1} xs alignItems="flex-end">
              <Grid item xs={10}>
                <Field
                  required={true}
                  type={
                    editedComboVar.m_strVariableType == "8"
                      ? "date"
                      : editedComboVar.m_strVariableType == "10"
                      ? "text"
                      : "number"
                  }
                  name="ComboValue"
                  label={`${t("combo")} ${t("value")}`}
                  value={comboVal.value}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  inputRef={comboValRef}
                          onKeyPress={(e) =>
                            FieldValidations(
                              e,
                              10,
                              comboValRef.current,
                              50
                            )
                          }
                />
                
              </Grid>
              <Grid item xs={2}>
                {!isReadOnly && (
                  <Button
                    className="secondary"
                    onClick={() => handleComboValueList()}
                    style={{ marginBottom: "5px" }}
                  >
                    {t("add")}
                  </Button>
                )}
              </Grid>
            </Grid>
            <Grid item>
              <div className={classes.comboValues}>
                <Grid container direction="column" spacing={1}>
                  {comboValList.map((item, index) => (
                    <Grid item>
                      <Grid container alignItems="center">
                        <Grid item>
                          <Typography
                            style={{ fontSize: "var(sub_text_font_size)" }}
                          >
                            {item.name || ""}
                          </Typography>
                        </Grid>
                        <Grid item style={{ marginLeft: "auto" }}>
                          {!isReadOnly && (
                            <DeleteIcon
                              className={classes.deleteBtn}
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={() => handleDeleteComboValue(index)}
                            />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Grid>
          </>
        )}
        {valueType === "dynamic" && (
          <Grid item container spacing={1} xs alignItems="flex-end">
            <Grid item xs>
              <Field
                multiline={true}
                name="DynamicValue"
                label={`${t("value")}`}
                value={dynamicVal.value}
                onChange={handleChange}
                disabled={isReadOnly}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </div>
  );
};
