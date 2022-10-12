import React, { useEffect, useState } from "react";
import "./ProjectProperties.css";
import DoneIcon from "@material-ui/icons/Done";

function SortByModal(props) {
  const [sortByOptions, setSortByOptions] = useState([
    "Last Modified By Me",
    "Last Modified",
    "Name",
  ]);
  const [sortOrderOptionsOne, setSortOrderOptionsOne] = useState([
    "Newest To Oldest",
    "Oldest To Newest",
  ]);
  const [sortOrderOptionsTwo, setSortOrderOptionsTwo] = useState([
    "Ascending",
    "Descending",
  ]);
  const [sortBySelected, setSortBySelected] = useState(2);
  const [sortOrderSelected, setSortOrderSelected] = useState(0);

  useEffect(() => {
    setSortOrderSelected(0);
    if (sortBySelected == 2) {
      setSortOrderOptionsOne(sortOrderOptionsTwo);
    } else {
      setSortOrderOptionsOne(["Newest To Oldest", "Oldest To Newest"]);
    }
  }, [sortBySelected]);

  useEffect(() => {
    props.getSortingOptions(sortBySelected, sortOrderSelected);
  }, [sortBySelected, sortOrderSelected]);

  return (
    <div>
      <p style={{ color: "#606060", fontSize: "14px" }}>SORT BY</p>
      <ul className="upperSection">
        {sortByOptions.map((el, index) => {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              {index == sortBySelected ? (
                <DoneIcon
                  className={props.isArabic ? "tickIcon_arabic" : "tickIcon"}
                />
              ) : null}
              <li
                className="upperSubSection"
                onClick={() => setSortBySelected(index)}
              >
                {el}
              </li>
            </div>
          );
        })}
      </ul>
      <p style={{ color: "#606060", fontSize: "14px" }}>SORT ORDER</p>
      <ul className="lowerSection">
        {sortOrderOptionsOne.map((el, index) => {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              {index == sortOrderSelected ? (
                <DoneIcon
                  className={props.isArabic ? "tickIcon_arabic" : "tickIcon"}
                />
              ) : null}
              <li
                className="upperSubSection"
                onClick={() => setSortOrderSelected(index)}
              >
                {el}
              </li>
            </div>
          );
        })}
      </ul>
    </div>
  );
}

export default SortByModal;
