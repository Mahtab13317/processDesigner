import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import SunEditor from "../../../../UI/SunEditor/SunTextEditor";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuItem from "@material-ui/core/MenuItem";
import { store, useGlobalState } from "state-pool";

function FormsAndValidations(props) {
  let { t } = useTranslation();
  const localActivityPropertyData = store.getState("activityPropertyData");
  const [
    localLoadedActivityPropertyData,
    setlocalLoadedActivityPropertyData,
    updatelocalLoadedActivityPropertyData,
  ] = useGlobalState(localActivityPropertyData);
  const [customValidations, setcustomValidations] = React.useState(false);

  const [formEnabledCheck, setformEnabledCheck] = React.useState(true);
  const [selectedFormName, setselectedFormName] = React.useState("");
  React.useEffect(() => {
    if (props.formEnabled == 0) {
      setformEnabledCheck(false);
    } else {
      setformEnabledCheck(true);
      setselectedFormName(props.FormName);
    }
  }, [props]);

  const handleCheckSwitch = (e) => {
    props.changeBasicDetails(e);
  };

  return (
    <>
      <p
        style={{
          color: "#727272",
          fontWeight: "bolder",
        }}
      >
        {t("formsAndValidations")}
      </p>
      <div
        style={{
          flexDirection: "row",
          marginLeft: "-0.6875rem",
          marginBottom: "0.3rem",
        }}
        className="flexScreen"
      >
        <Checkbox
          name="formEnabled"
          checked={
            localLoadedActivityPropertyData?.ActivityProperty?.actGenPropInfo
              ?.m_bFormView
          }
          onChange={handleCheckSwitch}
          disabled={props.disabled}
          size="small"
        />
        <p
          style={{
            paddingTop: "0.8rem",

            fontWeight: "600",
          }}
        >
          {t("formEnabled")}
        </p>
      </div>

      <div style={{ marginBlock: "0.3rem" }}>
        <p
          style={{
            color: "black",

            fontWeight: "500",
          }}
        >
          {t("formName")}
        </p>
        <Select
          disabled={props.disabled}
          IconComponent={ExpandMoreIcon}
          style={{ width: props.customStyle, height: "2rem" }}
          variant="outlined"
          //autoWidth
        >
          {selectedFormName !== "" ? (
            <MenuItem style={{ width: "100%", marginBlock: "0.2rem" }}>
              <p
                style={{
                  font: "0.8rem Open Sans",
                }}
              >
                {selectedFormName}
              </p>
            </MenuItem>
          ) : null}
        </Select>
      </div>

      <>
        {" "}
        {!customValidations ? (
          <p
            style={{
              color: 'var(--link_color)',
              cursor: "pointer",   
              marginTop: "1rem",
            }}
            onClick={() => setcustomValidations(true)}
          >
            {t("mentionCustomValidations")}
          </p>
        ) : null}
        {customValidations ? (
          <div style={{ marginBlock: "0.7rem" }}>
            <p
              style={{
                color: "#606060",
                marginBottom: "0.3rem",
              }}
            >
              {t("customValidations")}
            </p>
            <SunEditor
              width="100%"
              customHeight="6rem"
              placeholder={t("placeholderCustomValidation")}
              value={
                localLoadedActivityPropertyData.ActivityProperty.actGenPropInfo
                  .genPropInfo.customValidation
              }
              getValue={(e) =>
                props.changeBasicDetails(e, "validationBasicDetails")
              }
            />
          </div>
        ) : null}
      </>
    </>
  );
}

export default FormsAndValidations;
