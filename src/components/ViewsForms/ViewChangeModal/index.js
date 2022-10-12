import React from "react";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "../../../utility/AllImages/AllImages";

function ViewChangeModal(props) {
  let { t } = useTranslation();
  const viewMap = {
    single: "multiple",
    multiple: "single",
  };

  const formViewChangeHandler = () => {
    let temp = global.structuredClone(props.formAssociationData);
    temp.forEach((assocData) => {
      assocData.formId = "-1";
    });
    props.setformAssociationData(temp);
    props.setformAssociationType((prev) => viewMap[prev]);

    props.setviewChangeConfirmationBoolean(false);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "180px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "28%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: "1rem",
          fontSize: "var(--title_text_font_size)",
          borderBottom: "1px solid rgb(0,0,0,0.4)",
          fontWeight: "600",
        }}
      >
        {t("formSelection")}
        <CloseIcon />
      </div>
      <div
        style={{
          width: "100%",
          height: "47%",
          display: "flex",
          flexDirection: "row",

          padding: "1rem",
          fontSize: "var(--base_text_font_size)",
        }}
      >
        {t("unsavedChangesLost")}
      </div>
      <div
        style={{
          width: "100%",
          height: "25%",
          display: "flex",
          flexDirection: "row-reverse",
          alignItems: "center",

          fontSize: "var(--base_text_font_size)",
        }}
      >
        <button
          style={{
            background: "var(--button_color)",
            color: "white",
            border: "none",
          }}
          onClick={() => formViewChangeHandler()}
        >
          {t("yes,continue")}
        </button>
        <button
          style={{
            background: "white",
            color: "#606060",
            border: "1px solid #C4C4C4",
          }}
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}

export default ViewChangeModal;
