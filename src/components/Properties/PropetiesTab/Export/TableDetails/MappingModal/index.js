import React, { useState } from "react";
import styles from "../index.module.css";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import Modal from "../../../../../../UI/Modal/Modal";
import MappingDataModal from "../MappingDataModal";

function MappingModal(props) {
  const {
    index,
    dataFields,
    setDataFields,
    fieldName,
    isReadOnly,
    documentList,
    variablesList,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.moreOptionsInput}>
      <MoreHorizOutlinedIcon
        id="table_details_more_options"
        onClick={() => setIsOpen(true)}
        fontSize="small"
        className={styles.moreOptionIcon}
      />
      <Modal
        show={isOpen}
        modalClosed={() => setIsOpen(false)}
        style={{
          width: "28%",
          height: "54%",
          left: "35%",
          top: "27%",
          padding: "0px",
        }}
      >
        <MappingDataModal
          index={index}
          fieldName={fieldName}
          dataFields={dataFields}
          setDataFields={setDataFields}
          handleClose={() => setIsOpen(false)}
          isReadOnly={isReadOnly}
          documentList={documentList}
          variablesList={variablesList}
        />
      </Modal>
    </div>
  );
}
export default MappingModal;
