import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import { useTranslation } from "react-i18next";

function ConfirmationModal(props) {
  const {
    errorMessageObj,
    setopenConfirmationModal,
    subtitle,
    title,
    setAction,
    errorData,
  } = props;
  const okHandler = () => {
    setopenConfirmationModal(false);
    setAction(null);
  };
  console.log("nnnnnnnnnnnnnnn", errorMessageObj);
  const cancelHandler = () => {};
  let { t } = useTranslation();
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        id="header"
        style={{
          width: "100%",
          height: "10%",
          display: "flex",
          alignItems: "center",
          paddingInline: "1rem",
          fontSize: "var(--title_text_font_size)",
          fontWeight: "600",
          borderBottom: "2px solid rgb(0,0,0,0.3)",
          justifyContent: "space-between",
        }}
      >
        {title}
        <CloseIcon
          fontSize="medium"
          style={{
            cursor: "pointer",
            width: "1.5rem",
            height: "1.5rem",
            color: "rgb(0,0,0,0.5)",
          }}
          onClick={() => setopenConfirmationModal(false)}
        />
      </div>
      <div
        id="body"
        style={{
          width: "100%",
          height: "80%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {errorMessageObj.map((errorTab) => (
          <div style={{ marginBlock: "1rem" }}>
            <div
              style={{
                width: "100%",
                padding: "1rem",
                display: "flex",
                flexDirection: "row",
                fontSize: "var(--base_text_font_size)",
                fontWeight: "600",
              }}
            >
              {errorTab.header}
            </div>
            <div
              style={{
                width: "100%",

                display: "flex",
                flexDirection: "column",
                overflowY: "scroll",
              }}
            >
              <div
                style={{
                  width: "100%",

                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {errorTab.subHeaders.map((subHead, index) => (
                  <div
                    style={{
                      width: errorTab.subHeaders.length > 1 ? "50%" : "100%",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      paddingInline: index === 0 ? "1.5rem" : "",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "var(--base_text_font_size)",
                        fontWeight: "500",
                        color: "#606060",
                      }}
                    >
                      {subHead}
                    </p>
                  </div>
                ))}
              </div>
              {errorTab.errorData.map((data, index) => {
                if (typeof data === "string") {
                  return (
                    <div
                      style={{
                        fontSize: "var(--base_text_font_size)",
                        fontWeight: "600",
                        color: "#000000",
                        display: "flex",
                        flexDirection: "row",
                        height: "2.6rem",
                        paddingInline: "1.5rem",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingBlock: "10px",
                      }}
                    >
                      {index + 1}. {data}
                    </div>
                  );
                } else if (errorTab.key === "renamedDataObjects") {
                  return (
                    <div
                      style={{
                        fontSize: "var(--base_text_font_size)",
                        fontWeight: "600",
                        color: "#000000",
                        display: "flex",
                        flexDirection: "row",
                        height: "2.6rem",
                        width: "100%",
                        paddingInline: "1.5rem",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingBlock: "10px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          height: "100%",
                          width: "50%",

                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        {index + 1}. {data.oldName}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          height: "100%",
                          width: "50%",

                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        {data.name}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      style={{
                        fontSize: "var(--base_text_font_size)",
                        fontWeight: "600",
                        color: "#000000",
                        display: "flex",
                        flexDirection: "row",
                        height: "2.6rem",
                        paddingInline: "1.5rem",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        paddingBlock: "10px",
                      }}
                    >
                      {index + 1}. {data.name}
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>
      <div
        id="footer"
        style={{
          width: "100%",
          height: "10%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <button
          style={{
            height: "1.75rem",
            width: "3.5rem",
            border: "none",
            color: "white",
            background: "var(--button_color)",
            borderRadius: "0.125rem",
            fontSize: "var(--base_text_font_size)",
          }}
          onClick={okHandler}
        >
          {t("ok")}
        </button>
      </div>
    </div>
  );
}

export default ConfirmationModal;
