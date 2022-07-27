import React, { useState, useEffect } from "react";
import styles from "./rights.module.css";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { useTranslation } from "react-i18next";

function PaginateVar({ showPerPageVar, onPaginationVarChange, total, page }) {
  let { t } = useTranslation();
  const [counter, setCounter] = useState(1);
  const [data, setData] = useState(null);

  useEffect(() => {
    const value = showPerPageVar * counter;
    let range = onPaginationVarChange(value - showPerPageVar, value);
    setData({
      count: counter,
      val: value,
      show: showPerPageVar,
      tot: total,
      first: range.start,
      last:range.end
    });
  }, [counter]);

  const onButtonClick = (type) => {
    if (type === "prev") {
      if (counter === 1) {
        setCounter(1);
      } else {
        setCounter(counter - 1);
      }
    } else if (type === "next") {
      if (Math.ceil(total / showPerPageVar) === counter) {
        setCounter(counter);
      } else {
        setCounter(counter + 1);
      }
    }
  };
  return (
    <>
      <ArrowBackIosIcon
        className={`${styles.prev} ${styles.arrow}`}
        onClick={() => onButtonClick("prev")}
      />
      <span>
        {" "}
        {t("toolbox.dataRights.showing")} {data?.first}-{data?.last>total?total:data?.last} of {total}
      </span>{" "}
      <ArrowForwardIosIcon
        className={`${styles.next} ${styles.arrow}`}
        onClick={() => onButtonClick("next")}
      />
      
    </>
  );
}

export default PaginateVar;
