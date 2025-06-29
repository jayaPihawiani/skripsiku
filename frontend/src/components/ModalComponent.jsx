import { useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { LoadingContext } from "../context/Loading";

const ModalComponent = ({
  btntTitle,
  inputField,
  handleShow,
  handleClose,
  show,
  modalTitle,
  handleSubmit,
  classStyle,
  btnType,
}) => {
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
          <Button variant="primary" onClick={handleSubmit} type={btnType}>
            {loading ? "Loading" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalComponent;
