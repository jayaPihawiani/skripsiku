import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { LoadingContext } from "../context/Loading";
import { useContext } from "react";

const ModalComponent = ({
  btntTitle,
  inputField,
  handleShow,
  handleClose,
  show,
  modalTitle,
  handleSubmit,
  classStyle,
}) => {
  const state = useSelector((state) => state.barang);
  const { loading } = useContext(LoadingContext);
  return (
    <>
      <Button variant="primary" onClick={handleShow} className={classStyle}>
        {btntTitle}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{inputField}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {loading ? "Loading" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalComponent;
