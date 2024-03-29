// Changes made to solve Bug Id - 112252 (Not being able to export requirements)

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useTranslation } from "react-i18next";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/styles";
import { Checkbox } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import axios from "axios";
import FileUpload from "../../../../../UI/FileUpload";
import {
  ENDPOINT_IMPORT_SECTION,
  FILETYPE_ZIP,
} from "../../../../../Constants/appConstants";
import { SERVER_URL } from "../../../../../Constants/appConstants";
import { base64toBlob } from "../../../../../utility/Base64Operations/base64Operations";
import { contextType } from "react-datetime";
import { setToastDataFunc } from "../../../../../redux-store/slices/ToastDataHandlerSlice";
import { useDispatch } from "react-redux";

function ExportImport(props) {
  const useStyles = makeStyles({
    tableCell: {
      padding: "0",
      height: "20px",
      borderBottom: "none",
    },
    AccordionSummary: {
      padding: "0",
      width: "95%",
      marginRight: "0",
      height: "2.4rem",

      minHeight: "1rem",
    },
    TableContainer: {
      overflowY: "scroll",
      overFlowX: "hidden",
      "&::-webkit-scrollbar": {
        backgroundColor: "transparent",
        width: "0.3rem",
        height: "2rem",
      },

      "&:hover": {
        overflowY: "scroll",
        overFlowX: "hidden",
        "&::-webkit-scrollbar": {
          width: "0.3rem",
          height: "2rem",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#8c8c8c 0% 0% no-repeat padding-box",
          borderRadius: "0.313rem",
        },
      },
    },
    Buttons: {
      width: " 4.8125rem",
      height: " 1.75rem ",
      backgroundColor: "var(--button_color) !important",
      // border: "1px solid #C4C4C4 ",
      borderRadius: "2px ",
      fontFamily: "Open Sans",
      fontSize: "0.625rem",
      marginTop: "0.5rem",
      marginRight: "0.4375rem",
      textTransform: "none",
      whiteSpace: "nowrap",
      color: "white",
    },
    cancelButton: {
      width: " 4.8125rem",
      height: " 1.75rem ",
      backgroundColor: "white !important",
      border: "1px solid #C4C4C4 ",
      borderRadius: "2px ",
      fontFamily: "Open Sans",
      fontSize: "0.625rem",
      marginTop: "0.5rem",
      marginRight: "0.4375rem",
      textTransform: "none",
      whiteSpace: "nowrap",
      color: "white",
    },
    Accordion: {
      "&.MuiAccordion-root:before": {
        display: "none",
      },
    },
    FileUpload: {
      height: "7rem",
    },
    importButtons: {
      width: " 20rem",
      height: " 2rem ",
      backgroundColor: "#0072C6",
      // border: "1px solid #C4C4C4 ",
      // borderRadius: "2px ",
      fontFamily: "Open Sans",
      fontSize: "0.625rem",
      marginTop: "0.5rem",
      marginRight: "0.4375rem",
      textTransform: "none",
      whiteSpace: "nowrap",
      color: "white",
    },
  });
  const styles = useStyles();
  let { t } = useTranslation();
  const dispatch = useDispatch();
  const direction = `${t("HTML_DIR")}`;
  const [sectionsData, setsectionsData] = React.useState([]);
  const closeModalHandler = () => {
    props.closeExportImportModal();
  };

  const [files, setFiles] = useState([]);

  // React.useEffect(() => {
  //   const x = {
  //       Status:"0",
  //       Messsage:"",
  //       ZipData:"Q:LDEUAIIIAJ;S4:TAAAAAAAAAAAARAAA:T:F:D:U:J:P:O:T:U:B:C:M:Fu:4:t:s;t;U:NO;CwU;E-X:4;K-eA;B;Iu:e;6:i:D:i-U;AXo-w:M:I-4-RW0-e-e;qV:Y:I;R-Y-d;k:9-T:+;Z:MLx;m:N:e:X-i-I;SC-p-C;C;o;+F;s:h:S:a;w-nZ-yw;ju-YfJ-K;w:jl-SIvOR:3-R:gJ-2:wDCUp-P-P-PFa;/G-IW;v:YQ:p:p:z;Ol:WN:R;O-+;I;hLO;M-L;hw;g:L;w7tB-t;e-wr;s3O-r-+P-r;a;F:d:p;S-1M:E-r:N-g;6-z:w:9N;u;Jm:M:V:hm-u:a;D:r;gL-O:UZ:m-i:u:0-p-+Q;v:oT;h;ez5-V;c;8-5;l:1;M-Pf-j-ru:R-/-CD:Q:LHI;IJ00-NAAAnEAA:Q:LBCUAUAIIIAJ;S4:T;IJ00-NAAAnEAARAAAAAAAAAAAAAAAAA:T:F:D:U:J:P:O:T:U:B:C:M:Fu:4:t:s:Q:LFGAAAABABA/AAAMBAAAA",
  //       data: "7468697320697320612074c3a97374"
  //   }

  //   const y = Buffer.from(x.ZipData, "base64");
  //   // const z = new Blob([new Uint8Array(y).buffer]);
  //   // const file = new File([z], "name");
  //   let str = y.toString();

  //   fs.open('myFile.txt', str, (err) => {
  //       if(!err) console.log('Data written');
  //     });
  //   console.log( str, "tttttttttttttttttttt");
  // }, [])
  const [allSectionChecked, setallSectionChecked] = useState(false);
  useEffect(() => {
    let modData = [];
    props.sections.map((x) => {
      return modData.push({ ...x, isChecked: false });
    });

    setsectionsData(modData);
  }, [props]);

  const handleAllSectionChecked = (event) => {
    setallSectionChecked(event.target.checked);
    if (event.target.checked) {
      let temp = [...sectionsData];
      temp.forEach((elem) => {
        elem.isChecked = true;
      });
      setsectionsData(temp);
    } else {
      let temp = [...sectionsData];
      temp.forEach((elem) => {
        elem.isChecked = false;
      });
      setsectionsData(temp);
    }
  };

  const handleEachSectionChange = (event, secData) => {
    event.stopPropagation();
    let temp = [...sectionsData];
    let a = [];
    temp.forEach((data) => {
      if (data.OrderId === secData.OrderId) {
        data.isChecked = event.target.checked;
      }
      a.push(data.isChecked);
      if (a.includes(false)) setallSectionChecked(false);
      else if (!a.includes(false)) setallSectionChecked(true);
    });
    setsectionsData(temp);
  };

  const [newStyle, setnewStyle] = useState(false);

  const ref = useRef(null);
  const inputFile = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        closeModalHandler();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
  const fileUploadHandler = () => {
    inputFile.current.click();
  };

  const exportRequirementHandler = () => {
    let temp = [];
    sectionsData?.map((el) => {
      if (el.isChecked) {
        temp.push({
          sectionName: el.SectionName,
          sectionOrderId: el.OrderId,
          sectionId: el.SectionId,
        });
      }
    });
    let postBody = {
      objInnerSections: [...temp],
      sectionName: sectionsData[0].SectionName,
    };
    axios.post(SERVER_URL + `/exportSection`, postBody).then((res) => {
      if (res.status === 200) {
        // let tempp ="UEsDBBQACAgIAEeJBVUAAAAAAAAAAAAAAAARAAAAU0VDVElPTlNUQUJMRS54bWyzCU5NLsnMzysOSUzKSbXj4rQJyi93SSxJBDI5bfyLUlKLPFPsDG30YUwbqAa/xNxUOygbKI0sauOSWpxclFkAErDLyrLRR+bbBCQWpeaVeLrYGdjow9lAe/XhFsNNgzoKAFBLBwg3V2t6YgAAAKQAAABQSwECFAAUAAgICABHiQVVN1dremIAAACkAAAAEQAAAAAAAAAAAAAAAAAAAAAAU0VDVElPTlNUQUJMRS54bWxQSwUGAAAAAAEAAQA/AAAAoQAAAAAA"
        const url = window.URL.createObjectURL(
          base64toBlob(res.data.ZipData, res.headers["Content-Type"])
        );
        // var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        // var matches = filenameRegex.exec(res.headers["content-disposition"]);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", res.data.ZipFileName); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    });
  };

  /*****************************************************************************************
   * @author asloob_ali BUG ID: 114893 Description-: global requirement section: not able to import requirements
   * Reason:api was not integrated.
   * Resolution :integrated the api for import.
   * Date : 21/09/2022
   ****************/
  const handleImportRequirements = async (importType) => {
    const sectionInfo = {
      importedName: files[0]?.name.split(".").slice(0, -1).join("."),
    };

    sectionInfo["overwrite"] = importType === "override" ? true : false;

    const bodyFormData = new FormData();
    const selFile = files[0];
    bodyFormData.append("file", selFile);
    bodyFormData.append(
      "sectionInfo",
      new Blob([JSON.stringify(sectionInfo)], {
        type: "application/json",
      })
    );
    console.log(bodyFormData);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    try {
      const res = await axios.post(
        `${SERVER_URL}${ENDPOINT_IMPORT_SECTION}`,
        bodyFormData,
        config
      );

      if (res?.data?.Status === 0) {
        closeModalHandler();
        if (props.getSectionsDataAgain) {
          props.getSectionsDataAgain();
        }
      } else if (res?.data?.Status === -2) {
        dispatch(
          setToastDataFunc({
            message: res?.data?.Message,
            severity: "error",
            open: true,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setDropzonewithFileStyle = (data) => {
    setnewStyle(data);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {props.exportOrImportToShow === "export" ? (
        <div
          ref={ref}
          style={{
            width: "33.375rem",
            height: "27.8125rem",
            display: "flex",
            flexDirection: "column",
            background: " #FFFFFF 0% 0% no-repeat padding-box",
            padding: "0.5rem",
          }}
        >
          <div
            style={{
              width: "95%",
              height: "3rem",
              margin: "0.7rem 0 0.7rem 0.7rem",
            }}
          >
            <p
              style={{
                font: "var(--title_text_font_size) Open Sans",
                fontWeight: "bold",
                width: "3.4375rem",
              }}
            >
              {t("export")}
            </p>
            <div style={{ textAlign: "justify", whiteSpace: "nowrap" }}>
              <p
                style={{
                  font: "var(--subtitle_text_font_size) Open Sans",
                  color: "#727272",
                }}
              >
                {t("selectSectionsExport")}
              </p>
            </div>
          </div>
          <div style={{ height: "20rem", overflow: "hidden" }}>
            <TableContainer
              className={styles.TableContainer}
              style={{
                margin: direction === "rtl" ? "0 0.6rem 0 0" : "0 0 0 0.6rem",
                width: "95%",
                maxHeight: "20rem",
              }}
              component={Paper}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow style={{ maxHeight: "2rem" }}>
                    <TableCell
                      width="10%"
                      style={{ padding: "0", borderBottom: "none" }}
                      align="left"
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: "2.2rem",
                        }}
                      >
                        <Checkbox
                          size="medium"
                          checked={allSectionChecked}
                          onChange={handleAllSectionChecked}
                        />
                        <p
                          style={{
                            marginLeft: "3rem",
                            marginTop: "0.4rem",
                            fontWeight: "bold",
                            fontSize: "var(--subtitle_text_font_size)",
                          }}
                        >
                          {t("section")}s
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sectionsData.map((data) => {
                    return (
                      <TableRow>
                        <TableCell className={styles.tableCell}>
                          <Accordion className={styles.Accordion}>
                            <AccordionSummary
                              className={styles.AccordionSummary}
                              style={{ flexDirection: "row-reverse" }}
                              expandIcon={
                                <ExpandMoreIcon
                                  style={{
                                    color: "#C5CCD1",
                                  }}
                                />
                              }
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                <Checkbox
                                  size="medium"
                                  checked={data.isChecked}
                                  onChange={(e) =>
                                    handleEachSectionChange(e, data)
                                  }
                                />
                                <p
                                  style={{
                                    marginRight: "1.5rem",
                                    marginLeft: "3rem",
                                    paddingTop: "7px",
                                    fontSize: "var(--base_text_font_size)",
                                  }}
                                >
                                  {data.OrderId}.
                                </p>
                                <p
                                  style={{
                                    paddingTop: "7px",
                                    fontSize: "var(--base_text_font_size)",
                                  }}
                                >
                                  {data.SectionName}
                                </p>
                                {data.Description !== "" ? (
                                  <Tooltip
                                    disableFocusListener
                                    title={data.Description}
                                    placement="right"
                                  >
                                    <InfoOutlinedIcon
                                      style={{
                                        color: "#606060",
                                        marginTop: "5px",
                                        padding: "4px",
                                        marginLeft: "1.5rem",
                                        opacity: "0.6",
                                      }}
                                    />
                                  </Tooltip>
                                ) : null}
                              </div>
                            </AccordionSummary>
                            {data.hasOwnProperty("SectionInner") &&
                              data.SectionInner.map((subsection, index) => (
                                <Accordion
                                  className={styles.Accordion}
                                  defaultExpanded={false}
                                  style={{
                                    marginLeft: "7.5rem",
                                  }}
                                >
                                  <AccordionSummary
                                    className={styles.AccordionSummary}
                                    style={{
                                      flexDirection: "row-reverse",
                                      alignItems: "start",
                                    }}
                                    expandIcon={
                                      <ExpandMoreIcon
                                        style={{
                                          color: "#C5CCD1",
                                        }}
                                      />
                                    }
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "auto",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "row",
                                        }}
                                      >
                                        <p
                                          style={{
                                            padding: "0px 0 0 2px",
                                            color: "black",
                                            marginRight: "1.5rem",
                                            width: "1.7rem",
                                            height: "1.5rem",
                                            marginTop: "0px",
                                            borderRight: "none",
                                            fontSize:
                                              "var(--base_text_font_size)",
                                          }}
                                        >
                                          {subsection.OrderId + "."}
                                        </p>

                                        <p
                                          style={{
                                            fontWeight: "500",
                                            //font: "0.9rem Open Sans",
                                            margin: "0px 0 0 0px",

                                            borderLeft: "none",
                                            fontSize:
                                              "var(--base_text_font_size)",
                                          }}
                                        >
                                          {subsection.SectionName}
                                        </p>
                                        {subsection.Description !== "" ? (
                                          <Tooltip
                                            disableFocusListener
                                            title={subsection.Description}
                                            placement="right"
                                          >
                                            <InfoOutlinedIcon
                                              style={{
                                                color: "#606060",
                                                marginLeft: "1.5rem",
                                                marginTop: "0px",
                                                padding: "4px",
                                                opacity: "0.6",
                                              }}
                                            />
                                          </Tooltip>
                                        ) : null}
                                      </div>
                                    </div>
                                  </AccordionSummary>

                                  {subsection.hasOwnProperty("SectionInner2") &&
                                    subsection.SectionInner2.length !== 0 &&
                                    subsection.SectionInner2.map(
                                      (subsections2) => (
                                        <Accordion
                                          className={styles.Accordion}
                                          defaultExpanded={false}
                                          style={{
                                            marginLeft: "5.3rem",
                                          }}
                                        >
                                          <AccordionSummary
                                            className={styles.AccordionSummary}
                                            style={{
                                              flexDirection: "row-reverse",
                                              alignItems: "start",
                                            }}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                          >
                                            <div
                                              style={{
                                                display: "flex",
                                                flexDirection: "column",
                                              }}
                                            >
                                              <div
                                                style={{
                                                  display: "flex",
                                                  flexDirection: "row",
                                                }}
                                              >
                                                <p
                                                  style={{
                                                    padding: "0px 0 0 2px",
                                                    color: "black",
                                                    marginRight: "1.5rem",
                                                    width: "2.5rem",
                                                    height: "1.5rem",
                                                    marginTop: "0px",
                                                    borderRight: "none",
                                                    fontSize:
                                                      "var(--base_text_font_size)",
                                                  }}
                                                >
                                                  {subsections2.OrderId + "."}
                                                </p>
                                                <p
                                                  onClick={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                  style={{
                                                    fontWeight: "500",

                                                    marginLeft: "0px",
                                                    borderLeft: "none",
                                                    fontSize:
                                                      "var(--base_text_font_size)",
                                                  }}
                                                >
                                                  {subsections2.SectionName}
                                                </p>
                                                {subsections2.Description !==
                                                "" ? (
                                                  <Tooltip
                                                    disableFocusListener
                                                    title={
                                                      subsections2.Description
                                                    }
                                                    placement="right"
                                                  >
                                                    <InfoOutlinedIcon
                                                      style={{
                                                        color: "#606060",
                                                        marginTop: "0px",
                                                        padding: "4px",
                                                        marginLeft: "1.5rem",
                                                        opacity: "0.6",
                                                      }}
                                                    />
                                                  </Tooltip>
                                                ) : null}
                                              </div>
                                            </div>
                                          </AccordionSummary>
                                        </Accordion>
                                      )
                                    )}
                                </Accordion>
                              ))}
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div
            style={{
              padding: "5px",
              marginTop: "10px",
              display: "flex",
              flexDirection: "row-reverse",
              height: "4rem",
            }}
          >
            <Button
              className={styles.Buttons}
              style={{
                color: "white",
                background: "var(--button_color) !important",
              }}
              variant="contained"
              size="medium"
              onClick={() => exportRequirementHandler()}
            >
              {t("export")}
            </Button>
            <Button
              className={styles.cancelButton}
              style={{
                color: "#606060",
                backgroundColor: "white",
                border: "0.5px solid #C4C4C4",
              }}
              variant="contained"
              onClick={closeModalHandler}
              size="medium"
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
      ) : (
        <div
          ref={ref}
          style={{
            width: "27.8125rem",
            height: newStyle ? "18rem" : "19rem",
            display: "flex",
            flexDirection: "column",
            background: " #FFFFFF 0% 0% no-repeat padding-box",
            padding: "0.5rem",
          }}
        >
          <div style={{ margin: "0.5rem 0.7rem" }}>
            <p
              style={{
                fontWeight: "bolder",
                fontFamily: "Open Sans",
                fontSize: "1rem",
              }}
            >
              {t("import")}
            </p>
            <p
              style={{
                color: "#383737",
                fontWeight: "bold",
                opacity: "1",
                fontFamily: "Open Sans",
                fontSize: "0.75rem",
                marginTop: "1.4rem",
              }}
            >
              {t("uploadAZipFile")}
            </p>
          </div>
          <div>
            <div
              style={{
                marginLeft: "0.6rem",
                marginTop: "0.3rem",
                display: "flex",
                flexDirection: "row",
                // alignItems: "center",
                // justifyContent: "center",
                backgroundColor: "#0072C60D",
              }}
            >
              <FileUpload
                setStyle={(data) => setDropzonewithFileStyle(data)}
                typesOfFilesToAccept={[FILETYPE_ZIP]}
                containerStyle={newStyle ? { height: "9rem" } : null}
                setFiles={setFiles}
                dropString={t("dropFileHere")}
                returnFileAsItIs={true}
              />
            </div>
          </div>
          {newStyle ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                width: "27rem",
                height: "5rem",
                justifyContent: "space-around",
              }}
            >
              <Button
                onClick={closeModalHandler}
                variant="contained"
                size="medium"
                className={styles.cancelButton}
              >
                {t("cancel")}
              </Button>
              <Button
                variant="contained"
                size="medium"
                color="primary"
                className={styles.importButtons}
                onClick={() => handleImportRequirements("merge")}
              >
                {t("importAndMergeSections")}
              </Button>
              <Button
                variant="contained"
                size="medium"
                color="primary"
                className={styles.importButtons}
                onClick={() => handleImportRequirements("override")}
              >
                {t("importAndOverrideSections")}
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default ExportImport;
