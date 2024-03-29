// #BugID - 115179
// #BugDescription - add another button issues fixed.
import { Button } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "../../../Templates/template.module.css";
import arabicStyles from "../../..//Templates/templateArabicStyles.module.css";
import { RTL_DIRECTION } from "../../../../../Constants/appConstants";
import { FieldValidations } from "../../../../../utility/FieldValidations/fieldValidations";
import { useRef } from "react";

function AddNewSectionBox(props) {
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;
  const cancelButtonClick = () => {
    props.cancelCallBack();
  };
  const [previousOrderId, setpreviousOrderId] = useState(props.previousOrderId);
  const [newSection, setnewSection] = useState({});
  const [sectionName, setsectionName] = useState("");
  const [desc, setdesc] = useState("");
  const sectionNameRef=useRef();
  const sectionDescRef=useRef();

  const addHandler = () => {
    if (sectionName !== "") {
      
      
   var get =  JSON.parse(localStorage.getItem('reqData'));
  
    var tempLocal=[...get,{...newSection,SectionId: newSection.OrderId}]
   localStorage.setItem('reqData', JSON.stringify(tempLocal));
      props.mapNewSection(newSection);
      setpreviousOrderId((prevState) => prevState + 1);
      setdesc("");
      setsectionName("");
    }
  };

  const addcloseHandler = () => {
    if (sectionName !== "") {
      var get =  JSON.parse(localStorage.getItem('reqData'));
  
      var tempLocal=[...get,{...newSection,SectionId: newSection.OrderId}]
     localStorage.setItem('reqData', JSON.stringify(tempLocal));
      props.mapNewSection(newSection);
    }
    cancelButtonClick();
  };

  useEffect(() => {
    let parent = previousOrderId + 1;
    setnewSection({
      OrderId: parent.toString(),
      SectionName: sectionName,
      Description: desc,
    });
  }, [desc, previousOrderId, props, sectionName]);

  return (
    <div>
      <p
        className={
          direction === RTL_DIRECTION
            ? arabicStyles.addCategoryHeading
            : styles.addCategoryHeading
        }
      >
        {props.sectionNo === "" || props.sectionNo === undefined
          ? t("addNewSection")
          : `${t("addSectionWithin")} ${props.sectionNo}`}
      </p>
      <div>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.labelHeading
              : styles.labelHeading
          }
        >
          {t("section")} {t("name")}
          <span className={styles.starIcon}>*</span>
        </p>
        <input
          id="add_sectionName"
          value={sectionName}
          maxLength={255}
          type="text"
          onChange={(e) => setsectionName(e.target.value)}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.nameInput
              : styles.nameInput
          }
          ref={sectionNameRef}
                  onKeyPress={(e) =>
                    FieldValidations(e, 163, sectionNameRef.current, 100)
                  }
        />
      </div>
    
      <div>
        <p
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.labelHeading
              : styles.labelHeading
          }
        >
          {t("Discription")}
        </p>
        <textarea
          id="add_sectionDesc"
          value={desc}
          maxLength={255}
          onChange={(e) => setdesc(e.target.value)}
          className={
            direction === RTL_DIRECTION
              ? arabicStyles.descInput
              : styles.descInput
          }

          ref={sectionDescRef}
                  onKeyPress={(e) =>
                    FieldValidations(e, 163, sectionDescRef.current, 150)
                  }
        />
      </div>
      <div className={styles.buttonDiv}>
        <Button
          className={styles.cancelCategoryButton}
          onClick={cancelButtonClick}
        >
          {t("cancel")}
        </Button>
        <Button
          className={
            sectionName.trim() === "" || !sectionName
              ? styles.disabledCategoryButton
              : styles.addCategoryButton
          }
          onClick={addHandler}
          disabled={sectionName.trim() === "" || !sectionName}
        >
          {t("addAnother")}
        </Button>
        <Button
          className={
            sectionName.trim() === "" || !sectionName
              ? styles.disabledCategoryButton
              : styles.addCategoryButton
          }
          onClick={addcloseHandler}
          disabled={sectionName.trim() === "" || !sectionName}
        >
          {t("add&Close")}
        </Button>
      </div>
    </div>
  );
}

export default AddNewSectionBox;
