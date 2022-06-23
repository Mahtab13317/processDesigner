import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "../modal.module.css";
import StarRateIcon from "@material-ui/icons/StarRate";
import Button from "@material-ui/core/Button";
import SelectWithInput from "../../../../UI/SelectWithInput";
import axios from "axios";
import {
  ENDPOINT_ADD_TEMPLATE,
  ENDPOINT_FETCH_CATEGORIES,
  SERVER_URL,
} from "../../../../Constants/appConstants";
import { connect } from "react-redux";

function SaveTemplate(props) {
  let { t } = useTranslation();
  const [category, setCategory] = useState();
  const [isCategoryConstant, setCategoryConstant] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");
  const [categories, setCategories] = useState([]);
  const [templateList, setTemplateList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios.get(SERVER_URL + ENDPOINT_FETCH_CATEGORIES).then((res) => {
      if (res.data.Status === 0) {
        setCategories(res.data.Category);
        let templateArr = [];
        res.data.Category &&
          res.data.Category.forEach((category) => {
            category.Templates &&
              category.Templates.forEach((template) => {
                templateArr.push(template.Name.toLowerCase());
              });
          });
        setTemplateList(templateArr);
      }
    });
  }, []);

  const createTemplateFunc = () => {
    if (templateList.includes(templateName.toLowerCase())) {
      setErrorMessage(
        `This template name is already taken. Please choose another name.`
      );
    } else {
      let json = {
        processDefId: props.openProcessID,
        processType: props.openProcessType,
        templateName: templateName,
        categoryName: isCategoryConstant ? "constantName" : "",
        categoryId: isCategoryConstant ? "" : category.id,
        description: templateDesc,
      };
      axios.post(SERVER_URL + ENDPOINT_ADD_TEMPLATE, json).then((response) => {
        if (response.data.Status === 0) {
          props.setModalClosed();
        }
      });
    }
  };

  return (
    <React.Fragment>
      <div className={styles.header}>{t("saveAsTemplate")}</div>
      <div className={styles.form}>
        <div>
          <p className={styles.labelHeading}>
            {t("Category")}
            <span className={styles.starIcon}>*</span>
          </p>
          <SelectWithInput
            dropdownOptions={categories}
            setValue={(val) => {
              if (val) {
                setCategory({ id: val.CategoryId, name: val.CategoryName });
              } else {
                setCategory(val);
              }
            }}
            showEmptyString={false}
            showConstValue={true}
            inputClass={styles.selectWithInputTextField}
            constantInputClass={styles.multiSelectConstInput}
            setIsConstant={setCategoryConstant}
            isConstant={isCategoryConstant}
            constantStatement="category"
            constantOptionStatement="+addCategory"
            optionStyles={{ color: "darkBlue" }}
            isConstantIcon={true}
            optionKey="CategoryName"
          />
        </div>
        <div>
          <p className={styles.labelHeading}>
            {t("Template")} {t("Name")}
            <span className={styles.starIcon}>*</span>
          </p>
          <input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className={styles.nameInput}
          />
        </div>
        <div>
          <p className={styles.labelHeading}>
            {t("Template")} {t("Discription")}
          </p>
          <textarea
            rows="10"
            cols="50"
            value={templateDesc}
            onChange={(e) => setTemplateDesc(e.target.value)}
            className={styles.descInput}
          />
        </div>
      </div>
      <div className={styles.errorMessage}>{errorMessage}</div>
      <div className={styles.footer}>
        <Button
          className={styles.cancelCategoryButton}
          onClick={props.setModalClosed}
        >
          {t("cancel")}
        </Button>
        <Button
          className={
            templateName.trim() === "" || !templateName || !category
              ? styles.disabledCategoryButton
              : styles.addCategoryButton
          }
          onClick={createTemplateFunc}
          disabled={templateName.trim() === "" || !templateName || !category}
        >
          {t("createTemplate")}
        </Button>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessType: state.openProcessClick.selectedType,
  };
};

export default connect(mapStateToProps, null)(SaveTemplate);
