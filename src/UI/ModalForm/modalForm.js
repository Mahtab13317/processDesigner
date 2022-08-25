import React from "react";
import {
  Button,
  Grid,
  Typography,
  makeStyles,
  Modal,
  Fade,
  Backdrop,
  Divider,
  withStyles,
} from "@material-ui/core";

import customStyle from "../../assets/css/customStyle";
import CircularProgress from "@material-ui/core/CircularProgress";
import { red } from "@material-ui/core/colors";
import { CloseIcon } from "../../utility/AllImages/AllImages";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    outline: 0,
  },
  container: {
    display: "flex",

    width: 540,
    backgroundColor: "white",
    flexDirection: "column",
    outline: 0,
  },
  title: {
    color: "#000000",
    opacity: 1,
    fontSize: "var(--subtitle_text_font_size)",
    fontWeight: 600,
  },
  modalHeader: {
    paddingBottom: 14,
    flexDirection: "row",
    paddingTop: 14,
    outline: 0,
  },
  modalFooter: {
    paddingTop: 8,
    paddingBottom: 8,
    // paddingLeft: 16,
    // paddingRight: 16,
    outline: 0,
    backgroundColor: "#f7f9fc",
  },
  headerBtn: {
    color: `${theme.palette.primary.main}`,
  },
  addBtn: {
    backgroundColor: `${theme.palette.primary.main}`,
    color: "#FFFFFF",
  },
  deleteBtn: {
    backgroundColor: "#D53D3D",
    color: "#FFFFFF",
  },
  content: {
    // paddingLeft: "15px",
    /*  flex: 1,
    flexDirection: "column",
    outline: 0,
    overflowY: (props) => (props.overflowHidden ? "hidden" : "auto"),*/
    overflowY: "scroll",
    display: "flex",
    height: (props) => (props.contentNotScrollable ? null : "50vh"),
    flexDirection: "column",
    direction: (props) => props.direction,
    "&::-webkit-scrollbar": {
      backgroundColor: "transparent",
      width: "0.375rem",
      height: "1.125rem",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "transparent",
      borderRadius: "0.313rem",
    },

    "&:hover::-webkit-scrollbar": {
      overflowY: "visible",
      width: "0.375rem",
      height: "1.125rem",
    },
    "&:hover::-webkit-scrollbar-thumb": {
      background: "#8c8c8c 0% 0% no-repeat padding-box",
      borderRadius: "0.313rem",
    },
  },
  padding: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  paddingContent: {
    paddingLeft: (props) =>
      props.paddingLeftContent ? props.paddingLeftContent : 16,
    paddingRight: (props) =>
      props.paddingRightContent ? props.paddingRightContent : 16,
    paddingTop: (props) =>
      props.paddingTopContent ? props.paddingTopContent : 16,
    paddingBottom: (props) =>
      props.paddingBottomContent ? props.paddingBottomContent : 16,
  },
  text_12: {
    fontSize: "12px",
  },
  header: {},
  selectedTab: {
    fontWeight: 600,
    borderBottom: `2px solid ${theme.palette.primary.main}`,
    color: `${theme.palette.primary.main}`,
  },
}));
const DeleteButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[600]),
    backgroundColor: red[600],
    "&:hover": {
      backgroundColor: red[700],
    },
  },
}))(Button);
const ModalForm = (props) => {
  const {
    overflowHidden,
    paddingLeftContent,
    paddingRightContent,
    contentNotScrollable = false,
  } = props;
  const classes = useStyles({
    overflowHidden,
    paddingLeftContent,
    paddingRightContent,
    contentNotScrollable,
  });
  const closeModal = () => {
    props.closeModal();
  };
  return (
    <Modal
      className={classes.modal}
      open={props.isOpen}
      onClose={closeModal}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 50,
      }}
      disableScrollLock={true}
      id={props.id || "common_Modal"}
    >
      <Fade in={props.isOpen}>
        {/* modal container */}
        <div
          style={{
            height: props.containerHeight ? props.containerHeight : 450,
            width: props.containerWidth ? props.containerWidth : 550,
          }}
          className={classes.container}
        >
          {/* modal header  */}
          {props.title && (
            <>
              <div className={classes.modalHeader} data-testid="modalForm">
                <Grid
                  container
                  justify="space-between"
                  className={classes.padding}
                >
                  <Grid item container spacing={2} alignItems="center">
                    <Grid item>
                      <Typography className={classes.title}>
                        {props.title}
                      </Typography>
                    </Grid>

                    {props.name && (
                      <Grid item style={{ marginTop: "5px" }}>
                        <Grid container alignItems="center">
                          <Grid item style={{ marginRight: "4px" }}>
                            {props.icon ? props.icon : null}
                          </Grid>
                          <Grid item>{props.name}</Grid>
                        </Grid>
                      </Grid>
                    )}
                    {(props.headerBtn1Title ||
                      props.headerBtn2Title ||
                      props.headerCloseBtn) && (
                      <Grid item style={{ marginLeft: "auto" }}>
                        <Grid container spacing={2}>
                          {props.headerBtn1Title && (
                            <Grid item>
                              <Button
                                color="primary"
                                variant="contained"
                                onClick={props.onClick1Header}
                              >
                                {props.headerBtn1Title}
                              </Button>
                            </Grid>
                          )}
                          {props.headerBtn2Title && (
                            <Grid item>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={props.onClick2Header}
                              >
                                {props.headerBtn2Title}
                              </Button>
                            </Grid>
                          )}
                          {props.headerCloseBtn && (
                            <Grid item>
                              <CloseIcon
                                onClick={
                                  props.onClickHeaderCloseBtn
                                    ? () => props.onClickHeaderCloseBtn()
                                    : () => {
                                        console.log(
                                          "onClickHeaderCloseBtn fn not passed"
                                        );
                                      }
                                }
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  cursor: "pointer",
                                }}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </div>

              <Divider variant="fullWidth" />
            </>
          )}

          {/* modal content  */}
          <div className={classes.content + " " + classes.paddingContent}>
            {props.Content}
          </div>

          <Divider variant="fullWidth" />

          {/* modal footer  */}
          <div className={classes.modalFooter}>
            <div className={classes.padding}>
              <Grid container justify="space-between">
                {props.footerText && (
                  <Grid item>
                    <Typography>{props.footerText}</Typography>
                  </Grid>
                )}

                <Grid item>
                  <Grid container justify="flex-start" alignItems="center">
                    {/* btn3  */}
                    {props.btn3Title && (
                      <Grid item style={{ paddingRight: 5 }}>
                        <Button
                          style={customStyle.btn}
                          variant="outlined"
                          size="small"
                          onClick={props.onClick3}
                        >
                          {props.btn3Title}
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container justify="flex-end" spacing={1}>
                    {/* btn1  */}
                    {props.btn1Title && (
                      <Grid item style={{ marginRight: "4px" }}>
                        <Button
                          style={customStyle.btn1}
                          //  variant="outlined"
                          //  size="small"
                          className="tertiary"
                          onClick={props.onClick1}
                        >
                          {props.btn1Title}
                        </Button>
                      </Grid>
                    )}
                    {/* btn2 */}
                    {props.btn2Title &&
                      (props.isProcessing ? (
                        <Grid item>
                          {props.btn2Title.indexOf("Delete") !== -1 ? (
                            <DeleteButton
                              style={{ fontSize: "12px" }}
                              variant="contained"
                              size="small"
                              //color="primary"
                            >
                              <CircularProgress
                                color="#FFFFFF"
                                style={{
                                  height: "15px",
                                  width: "15px",
                                  marginRight: "8px",
                                }}
                              ></CircularProgress>

                              {props.btn2Title}
                            </DeleteButton>
                          ) : (
                            <Button
                              style={{ fontSize: "12px" }}
                              // variant="contained"
                              //size="small"
                              //color="primary"
                              className="primary"
                              sx={{
                                position: "relative",
                                display: "inline-flex",
                                height: "15px",
                                width: "20px",
                              }}
                            >
                              <CircularProgress
                                color="#FFFFFF"
                                variant={
                                  props.withProgress
                                    ? "determinate"
                                    : "indeterminate"
                                }
                                style={{
                                  height: "20px",
                                  width: "20px",
                                  marginRight: "8px",
                                }}
                                value={
                                  props.withProgress ? props.percentage : null
                                }
                              ></CircularProgress>
                              {props.withProgress && (
                                <Typography
                                  variant="caption"
                                  component="div"
                                  // color="#FFFFFF"
                                  style={{
                                    color: "#FFFFFF",
                                    fontSize: "8px",
                                    top: 0,
                                    left: -80,
                                    bottom: 0,
                                    right: 0,
                                    position: "absolute",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  {`${Math.round(props.percentage)}%`}
                                </Typography>
                              )}

                              {props.btn2Title}
                            </Button>
                          )}
                        </Grid>
                      ) : (
                        <Grid item>
                          {props.btn2Title.indexOf("Delete") !== -1 ? (
                            <DeleteButton
                              style={{ fontSize: "12px" }}
                              variant="contained"
                              size="small"
                              // color="primary"
                              onClick={props.onClick2}
                            >
                              {props.btn2Title}
                            </DeleteButton>
                          ) : (
                            <Button
                              style={{ fontSize: "12px" }}
                              //  variant="contained"
                              // size="small"
                              //color="primary"
                              className="primary"
                              onClick={props.onClick2}
                              disabled={props.btn2Disabled}
                            >
                              {props.btn2Title}
                            </Button>
                          )}
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default ModalForm;
