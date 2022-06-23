import React from "react";
import { useTranslation } from "react-i18next";
import "./index.css";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import { LightTooltip } from "../StyledTooltip";

function FeatureListing(props) {
  let { t } = useTranslation();

  const { maxAvailableFeaturesId, menuName, interfaceId, description } = props;
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <p className="image-div" />
      <p id="PF_Feature_Name" className="features-data" onClick={props.onClick}>
        {menuName}
      </p>
      {interfaceId <= maxAvailableFeaturesId ? (
        <div>
          <LightTooltip
            id="PF_Tooltip"
            arrow={true}
            enterDelay={500}
            placement="bottom-start"
            title={description}
          >
            <HelpOutlineOutlinedIcon className="features-help-icon" />
          </LightTooltip>
        </div>
      ) : (
        <p className="custom-tag">{t("customTag")}</p>
      )}
    </div>
  );
}

export default FeatureListing;
