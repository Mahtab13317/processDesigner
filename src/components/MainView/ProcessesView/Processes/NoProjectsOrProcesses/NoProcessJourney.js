import React, { useEffect, useState } from "react";
import "./noProcessOrProjects.css";
import { useTranslation } from "react-i18next";
import ProcessTemplate from "../../../../../UI/ProcessTemplate/ProcessTemplate";
import "./NoprocessArabic.css";
import c_Names from "classnames";
import axios from "axios";
import {
  CREATE_PROCESS_FLAG_FROM_PROCESSES,
  ENDPOINT_FETCH_ALL_TEMPLATES,
  PREVIOUS_PAGE_CREATE_FROM_NO_PROCESS,
  PREVIOUS_PAGE_PROCESS,
  SERVER_URL,
} from "../../../../../Constants/appConstants";
import * as actionCreators from "../../../../../redux-store/actions/processView/actions";
import * as actionCreators_template from "../../../../../redux-store/actions/Template";
import { connect } from "react-redux";

function NoProcessJourney(props) {
  let { t } = useTranslation();
  const [categoryList, setCategoryList] = useState([]);
  const [carouselModalClicked, setCarouselModalClicked] = useState(false);
  const direction = `${t("HTML_DIR")}`;

  useEffect(() => {
    if (props.getTemplatePage === PREVIOUS_PAGE_CREATE_FROM_NO_PROCESS) {
      setCarouselModalClicked(true);
    }
    axios.get(SERVER_URL + ENDPOINT_FETCH_ALL_TEMPLATES).then((res) => {
      if (res.data.Status === 0) {
        setCategoryList(res.data.Category);
      }
    });
  }, []);

  //code added on 6 June 2022 for BugId 110139
  const createProcessHandler = () => {
    props.CreateProcessClickFlag(CREATE_PROCESS_FLAG_FROM_PROCESSES);
    props.setTemplatePage(PREVIOUS_PAGE_PROCESS);
  };

  return (
    <div
      className={c_Names({
        NoProcessAvailable: direction !== "rtl",
        NoProcessAvailableArabic: direction == "rtl",
      })}
      style={{
        direction: `${t("HTML_DIR")}`,
      }}
    >
      <div className="row justifyCenter">
        <button
          className={c_Names({
            importProcessBtn: direction !== "rtl",
            importProcessBtnArabic: direction == "rtl",
          })}
        >
          {t("importaProcess")}
        </button>
        <button
          className={c_Names({
            createProcessBtn: direction !== "rtl",
            createProcessBtnArabic: direction == "rtl",
          })}
          //code added on 6 June 2022 for BugId 110139
          onClick={createProcessHandler}
        >
          {" "}
          {t("createaProcess")}
        </button>
      </div>
      <p className="hrLine">
        <span>{t("or")}</span>
      </p>
      <div>
        <p className="ProcessHeading">{t("createProcesssUsingTemplate")}</p>
      </div>
      <ProcessTemplate
        data={categoryList}
        modalClicked={carouselModalClicked}
        setModalClicked={setCarouselModalClicked}
        selectTemplateFunc={() => {
          setCarouselModalClicked(true);
        }}
      />
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTemplateDetails: (
      category,
      view,
      createBtnClick,
      template,
      projectName,
      isProjectNameConstant,
      processName,
      files
    ) =>
      dispatch(
        actionCreators_template.setTemplateDetails(
          category,
          view,
          createBtnClick,
          template,
          projectName,
          isProjectNameConstant,
          processName,
          files
        )
      ),
    //code added on 6 June 2022 for BugId 110139
    CreateProcessClickFlag: (flag) =>
      dispatch(actionCreators.createProcessFlag(flag)),
    setTemplatePage: (value) =>
      dispatch(actionCreators_template.storeTemplatePage(value)),
  };
};

const mapStateToProps = (state) => {
  return {
    getTemplatePage: state.templateReducer.template_page,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NoProcessJourney);
