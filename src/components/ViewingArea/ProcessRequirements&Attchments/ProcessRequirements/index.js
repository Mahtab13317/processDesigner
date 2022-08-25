// Changes made to solve 110715 (Global Requirement section: Buttons not visible while Adding section)

import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import "./index.css";
import axios from "axios";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import {
  SERVER_URL,
  ENDPOINT_FETCHSYSTEMREQUIREMENTS,
} from "../../../../Constants/appConstants";
import RightSection from "./requirementsRightSection";
import { connect } from "react-redux";
import TabsHeading from "../../../../UI/TabsHeading";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "16%",
    borderRight: "1px solid #CECECE",
    height: "100%",
    marginTop: "4px",
    backgroundColor: "white",
  },
  heading: {
    fontSize: "var(--subtitle_text_font_size)",
    fontWeight: theme.typography.fontWeightRegular,
    color: "#606060",
  },
}));

function ProcessRequirements(props) {
  const classes = useStyles();
  const [showRight, setShowRight] = useState(false);
  const [sections, setSections] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState();
  const handleAccordionClick = () => {
    props.setIsActive(true);
  };

  useEffect(() => {
    async function getSections() {
      const res = await axios.get(
        SERVER_URL +
          "/requirement/" +
          `${props.openProcessID}/${props.openProcessType}`
      );
      if (res.status === 200) {
        setSections(res?.data?.Requirement);
        setSelectedOrder({
          SectionId: res?.data?.Requirement
            ? res?.data?.Requirement[0]?.RequirementId
            : null,
          SectionLevel: "0",
          SectionName: res?.data?.Requirement
            ? res?.data?.Requirement[0]?.RequirementName
            : null,
        });
      }
    }
    getSections();
  }, []);

  return (
    <>
      <TabsHeading heading={props.heading} />
      <div style={{ display: "flex", height: "100%" }}>
    
    {props.isDrawerExpanded ? (
      <div className={classes.root}>
        <p
          style={{
            fontSize: "var(--subtitle_text_font_size)",
            fontWeight: "700",
            backgroundColor: "white",
            paddingLeft: "8px",
          }}
        >
          Sections
        </p>
        {sections?.map((sec) => {
          return (
            <Accordion>
              <AccordionSummary
                style={{
                  flexDirection: "row-reverse",
                  backgroundColor:
                    sec.RequirementId == selectedOrder?.SectionId
                      ? "#0072C626"
                      : "white",
                  fontWeight:
                    sec.RequirementId == selectedOrder?.SectionId
                      ? "600"
                      : "400",
                }}
                expandIcon={<ArrowRightIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography
                  className={classes.heading}
                  onClick={() =>
                    setSelectedOrder({
                      SectionId: sec.RequirementId,
                      SectionLevel: "0",
                      SectionName: sec.RequirementName,
                    })
                  }
                >
                  {sec.RequirementName}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                onClick={() => handleAccordionClick()}
                style={{ backgroundColor: props.isActive ? "#0072C626" : "" }}
              >
                <Typography>
                  {sec?.InnerRequirement?.map((secInner) => {
                    return (
                      <Accordion>
                        <AccordionSummary
                          style={{
                            flexDirection: "row-reverse",
                            backgroundColor:
                              secInner.RequirementId ==
                              selectedOrder?.SectionId
                                ? "#0072C626"
                                : "white",
                            fontWeight:
                              sec.RequirementId == selectedOrder?.SectionId
                                ? "600"
                                : "400",
                          }}
                          expandIcon={<ArrowRightIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography
                            className={classes.heading}
                            onClick={() =>
                              setSelectedOrder({
                                SectionId: secInner.RequirementId,
                                SectionLevel: "1",
                                SectionName: secInner.RequirementName,
                              })
                            }
                          >
                            {secInner.RequirementName}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                          onClick={() => handleAccordionClick()}
                          style={{
                            backgroundColor: props.isActive
                              ? "#0072C626"
                              : "",
                          }}
                        >
                          <Typography>
                            {secInner?.InnerRequirement2?.map((el) => {
                              return (
                                <Accordion>
                                  <AccordionSummary
                                    style={{
                                      flexDirection: "row-reverse",
                                      backgroundColor:
                                        el.RequirementId ==
                                        selectedOrder?.SectionId
                                          ? "#0072C626"
                                          : "white",
                                      fontWeight:
                                        sec.RequirementId ==
                                        selectedOrder?.SectionId
                                          ? "600"
                                          : "400",
                                    }}
                                    expandIcon={<ArrowRightIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                  >
                                    <Typography
                                      className={classes.heading}
                                      onClick={() =>
                                        setSelectedOrder({
                                          SectionId: el.RequirementId,
                                          SectionLevel: "2",
                                          SectionName: el.RequirementName,
                                        })
                                      }
                                    >
                                      {el.RequirementName || "Inner2"}
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails
                                    onClick={() => handleAccordionClick()}
                                    style={{
                                      backgroundColor: props.isActive
                                        ? "#0072C626"
                                        : "",
                                    }}
                                  >
                                    {/* <Typography>'HELL'</Typography> */}
                                  </AccordionDetails>
                                </Accordion>
                              );
                            })}
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
    ) : null}
    <div
      style={{
        padding: props.isDrawerExpanded ? "10px 25px 17px 17px" : "0px",
        backgroundColor: "white",
        width: props.isDrawerExpanded ? "84%" : "100%",
        marginTop: "4px",
        overflowY: "scroll",
      }}
    >
      <RightSection
        completeSections={sections}
        selectedOrder={selectedOrder}
      />
    </div>
  </div>
    </>
    
  );
}

const mapStateToProps = (state) => {
  return {
    openProcessID: state.openProcessClick.selectedId,
    openProcessName: state.openProcessClick.selectedProcessName,
    openProcessType: state.openProcessClick.selectedType,
    templateId: state.openTemplateReducer.templateId,
    templateName: state.openTemplateReducer.templateName,
    openTemplateFlag: state.openTemplateReducer.openFlag,
    isDrawerExpanded: state.isDrawerExpanded.isDrawerExpanded,
  };
};

export default connect(mapStateToProps)(ProcessRequirements);
