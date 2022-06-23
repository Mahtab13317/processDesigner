import React, { useState } from "react";
import styles from "../index.module.css";
import MoreHorizOutlinedIcon from "@material-ui/icons/MoreHorizOutlined";
import Modal from "../../../../../../UI/Modal/Modal";
import MappingDataModal from "../MappingDataModal";

function MappingModal(props) {
  const { index, dataFields, setDataFields, fieldName, isProcessReadOnly } =
    props;
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.moreOptionsInput}>
      <MoreHorizOutlinedIcon
        id="table_details_more_options"
        onClick={() => setIsOpen(true)}
        fontSize="small"
      />
      <Modal
        show={isOpen}
        modalClosed={() => setIsOpen(false)}
        style={{
          width: "25%",
          height: "45%",
          left: "36%",
          top: "34%",
          padding: "0px",
        }}
      >
        <MappingDataModal
          index={index}
          fieldName={fieldName}
          dataFields={dataFields}
          setDataFields={setDataFields}
          handleClose={() => setIsOpen(false)}
          isProcessReadOnly={isProcessReadOnly}
        />
      </Modal>
    </div>
  );
}
export default MappingModal;
