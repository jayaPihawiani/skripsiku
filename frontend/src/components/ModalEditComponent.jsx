import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ModalEditComponent = ({
  body,
  handleCloseEdit,
  modalTitle,
  submit,
  btnTitle,
}) => {
  return (
    <Modal show={true} onHide={handleCloseEdit}>
      <Modal.Header closeButton>
        <Modal.Title>{modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseEdit}>
          Close
        </Button>
        <Button variant="primary" onClick={submit}>
          {btnTitle ? btnTitle : "Simpan"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditComponent;
