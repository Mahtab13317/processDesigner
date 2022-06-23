import React, { useState } from "react";
import "./Create.css";
import { useTranslation } from "react-i18next";
import SearchBox from "../../../UI/Search Component";
import { Select, MenuItem } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

function SelectTemplate(props) {
  let { t } = useTranslation();
  const [selected, setselected] = useState(0);
  const categories = [
    t("blank"),
    t("banking"),
    t("insurance"),
    t("anotherCategory"),
  ];
  const dropdown = ["option1", "option2"];

  return (
    <React.Fragment>
      <div>
        <div className="row">
          <div>
            <p classname="creteTittle">
              <span className="templateHeader">{t("BuildTheProcess")} </span>
              <span className="template">{t("templates")}</span>
            </p>
            <p className="templateSubHeader">{t("youCanCreate")}</p>
          </div>

          <div className="searching_shoting">
            <Select
              className="selectDropdown"
              MenuProps={{
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                getContentAnchorEl: null,
              }}
              defaultValue={"defaultValue"}
              //   onChange={onSelect}
            >
              <MenuItem
                className="dropdownData"
                style={{ marginTop: ".5px" }}
                value="defaultValue"
              >
                {t("global")}
              </MenuItem>
              {dropdown.map((x) => {
                return (
                  <MenuItem className="dropdownData" key={x} value={x}>
                    {x}
                  </MenuItem>
                );
              })}
            </Select>
            <SearchBox
              height="28px"
              width="200px"
              placeholder={"Search Here"}
            />
          </div>
        </div>

        <div className="row">
          <div className="leftPannel">
            <p className="cateoryModal">{t("Category")}</p>
            <ul>
              {categories.map((x, index) => {
                return (
                  <li
                    style={{
                      backgroundColor: selected == index ? "#FC66210F" : null,
                      color: selected == index ? "#F36A1F" : null,
                    }}
                    onClick={() => setselected(index)}
                  >
                    {x}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="middlePannel">
            <div
              className="addBtnDiv"
              onClick={() => props.setShowModal("openProcess")}
            >
              <AddIcon
                style={{
                  color: "#FFDAC8",
                  height: "48px",
                  width: "48px",
                  marginTop: "20%",
                  marginLeft: "20%",
                }}
              />
            </div>
            <p className="btn_desc">{t("startFromABank")}</p>
            <div>
              <p className="Temp_footer">{t("blankProcess")}</p>
              <p className="footer_desc">{t("startFromScratch")}</p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default SelectTemplate;
