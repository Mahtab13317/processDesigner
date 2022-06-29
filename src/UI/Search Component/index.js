import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import { validateRegex } from "../../validators/validator";
import { useTranslation } from "react-i18next";
import { RTL_DIRECTION } from "../../Constants/appConstants";
import Close from "../../assets/close.png";
import Lens from "../../assets/lens.png";

const useStyles = makeStyles((theme) => ({
  searchBox: (props) => {
    return {
      //code added on 21 June 2022 for BugId 110814
      cursor: "text",
      position: "relative",
      marginLeft: 0,
      display: "flex",
      maxWidth: props.width ? props.width : "289px",
      background: "#FFFFFF",
      border: "1px solid #C4C4C4",
      borderRadius: "2px",
      height: props.height,
      width: props.width ? props.width : "289px",
      [theme.breakpoints.up("sm")]: {
        maxWidth: props.width ? props.width : "289px",
      },
    };
  },
  searchIcon: {
    position: "absolute",
    right: (props) => (props.direction === RTL_DIRECTION ? "unset" : "0.5rem"),
    left: (props) => (props.direction === RTL_DIRECTION ? "0.5rem" : "unset"),
    height: "100%",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  cancelIcon: {
    position: "absolute",
    top: "50%",
    right: (props) => (props.direction === RTL_DIRECTION ? "unset" : "1.5rem"),
    left: (props) => (props.direction === RTL_DIRECTION ? "1.5rem" : "unset"),
    transform: "translateY(-50%)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(0.5, 1),
    //code added on 16 June 2022 for BugId 110814
    cursor: "text",
    marginTop: "1px",
    fontSize: "12px",
    height: "5px",
    marginBottom: "2px",
    background: "#fff",
    transition: theme.transitions.create("width"),
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    "&::placeholder": {
      fontSize: "12px",
      textOverflow: "ellipsis",
    },
  },
  popoverBlock: {
    position: "absolute",
    top: "30px",
    left: "-1px",
    width: (props) => (props.width ? props.width : "200px"),
    boxShadow: " 0px 3px 6px #00000029",
    border: "1px solid #C4C4C4",
    borderRadius: "2px",
    zIndex: 999,
    opacity: 1,
    background: "#fff",
    maxHeight: "250px",
    overflowY: "auto",
  },
  popoverItem: {
    listStyle: "none",
    margin: 0,
    padding: "0 0 4px",
    "& li": {
      fontSize: "12px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      textAlign: "left",
      padding: "5.5px 8px",
      cursor: "pointer",
      "&.heading": {
        fontWeight: 600,
        color: "#000",
      },
    },
  },
  listItem: {
    background: "#fff",
    transition: "all 100ms ease-in",
    "&:hover": {
      background: "#F0F0F0",
    },
  },
}));

const SearchBox = (props) => {
  const {
    name,
    width = "200px",
    height = "28px",
    placeholder = "Search",
    onSearchChange = null,
    onSearchSubmit = null,
    clearSearchResult = null,
    haveSuggestions = false,
    haveRecents = false,
    onLoadSuggestions = null,
    onLoadRecents = null,
    recentData = [],
    suggestionData = [],
    style = {},
    regex = null,
  } = props;
  let { t } = useTranslation();
  const direction = `${t("HTML_DIR")}`;

  const classes = useStyles({ height, width, direction });

  const [searchValue, setSearchValue] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showRecents, setShowRecents] = useState(false);

  useEffect(() => {
    if (haveRecents) if (onLoadRecents !== null) onLoadRecents();
  }, []);

  useEffect(() => {
    function onClickEvent(event) {
      let isEleFound = false;

      for (let i = 0; i < 4; i++) {
        const ele = event.path[i];
        if (ele && ele.id === "searchBoxId") {
          isEleFound = true;
          return;
        }
      }
      if (!isEleFound) {
        setShowRecents(false);
        setShowSuggestion(false);
      }
    }

    window.addEventListener("click", onClickEvent);
    return () => window.removeEventListener("click", onClickEvent);
  }, []);

  useEffect(() => {
    if (props.searchTerm || props.searchTerm === "") {
      setSearchValue(props.searchTerm);
    }
  }, [props.searchTerm]);

  const onKeyDownEvent = (event) => {
    if (event.keyCode === 13) {
      searchHandler();
    }
  };

  const onChangeHandler = (e) => {
    if (props.setSearchTerm) {
      props.setSearchTerm(e.target.value);
    }
    let isRegexPassed =
      regex !== null ? validateRegex(e.target.value, regex) : true; // to test the regex with the typed value

    if (isRegexPassed || e.target.value.length === 0) {
      //*  e.target.value.length === 0 -> this is used when you want delete the last charcter using backspace
      setSearchValue(e.target.value);
      if (onSearchChange !== null) onSearchChange(e.target.value);

      //hide recents when we start the typing
      if (haveRecents)
        setShowRecents(e.target.value.length === 0 ? true : false);

      //show suggestion when we start the typing
      if (haveSuggestions) {
        if (e.target.value.length > 2) {
          if (e.target.value.length % 3 === 0)
            if (onLoadSuggestions !== null) onLoadSuggestions(e.target.value);
          setShowSuggestion(true);
        } else {
          setShowSuggestion(false);
        }
      }
    }
  };

  const cancelHandler = () => {
    setSearchValue("");
    if (onSearchChange !== null) onSearchChange("");
    setShowSuggestion(false);

    if (haveRecents) {
      setShowRecents(true);
      if (onLoadRecents !== null) onLoadRecents();
    }
    if (clearSearchResult != null) clearSearchResult();
  };

  const searchHandler = (item) => {
    let val = document.getElementById("searchBoxInput").value;
    if (item !== undefined) {
      item = {
        ...item,
        searchString: val,
      };

      setSearchValue(item.label);
      setShowRecents(false);
      setShowSuggestion(false);
      if (onSearchSubmit !== null) onSearchSubmit(item);
    } else {
      if (onSearchSubmit !== null) onSearchSubmit({ searchString: val });
    }
  };

  const onFocusHandler = (event) => {
    if (haveRecents && searchValue.trim() === "") {
      setShowRecents(true);
    }
  };

  return (
    <div
      className={classes.searchBox}
      style={{ width: width, ...style }}
      id="searchBoxId"
    >
      <InputBase
        name={name}
        id="searchBoxInput"
        placeholder={placeholder ? placeholder : ""}
        value={searchValue}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        style={{ width: `calc(${width} - 42px)` }}
        inputProps={{ "aria-label": "search" }}
        onFocus={onFocusHandler}
        onChange={onChangeHandler}
        onKeyDown={onKeyDownEvent}
      />

      {showRecents && recentData && recentData.length > 0 && (
        <div className={classes.popoverBlock}>
          <ul className={classes.popoverItem}>
            <li className="heading">Recent Searches</li>
            {recentData.map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  <li
                    className={classes.listItem}
                    onClick={() => searchHandler(item)}
                  >
                    {item.label}
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      )}
      {showSuggestion && suggestionData && suggestionData.length > 0 && (
        <div className={classes.popoverBlock}>
          <ul className={classes.popoverItem}>
            {suggestionData.map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  <li
                    className={classes.listItem}
                    onClick={() => searchHandler(item)}
                  >
                    {item.label}
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      )}
      {searchValue !== "" && (
        <div className={classes.cancelIcon} onClick={cancelHandler}>
          <img
            onClick={() => {
              if (props.setSearchTerm) {
                props.setSearchTerm("");
              }
            }}
            src={Close}
            alt="lens"
            width="16px"
            height="16px"
          />
        </div>
      )}
      <div className={classes.searchIcon} onClick={() => searchHandler()}>
        <img src={Lens} alt="lens" width="16px" height="16px" />
      </div>
    </div>
  );
};

export default SearchBox;

SearchBox.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  onSearchChange: PropTypes.func,
  onSearchSubmit: PropTypes.func, // return object {id:"", label:"", searchString:""}
  clearSearchResult: PropTypes.func,

  haveSuggestions: PropTypes.bool,
  onLoadSuggestions: PropTypes.func,
  suggestionData: PropTypes.array,
  haveRecents: PropTypes.bool,
  onLoadRecents: PropTypes.func,
  recentData: PropTypes.array,

  regex: PropTypes.string, //validation framework
};
