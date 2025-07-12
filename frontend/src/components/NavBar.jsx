import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authStateReset, logoutUser } from "../features/authSlice";
import { BsArrowRight, BsBoxArrowLeft, BsBoxArrowRight } from "react-icons/bs";

const NavBar = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    if (user.isLogout) {
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      dispatch(authStateReset());
    }
  };

  return (
    <div
      className="d-flex align-items-center p-2 position-fixed w-100 z-3"
      style={{ backgroundColor: "#313131" }}
    >
      <div className="ms-auto me-3">
        <h5 className="m-0 text-light">
          {user.data && user.data.role === "admin"
            ? "Administrator"
            : user.data && user.data.role === "user"
            ? "User"
            : ""}
        </h5>
        <p className="m-0 text-light me-3">
          Welcome, <strong>{user.data && user.data.username}</strong>
        </p>
      </div>
      <>
        <>
          <Button variant="outline-light" onClick={handleShow}>
            <span className="icons">
              <BsBoxArrowRight />
            </span>
            <span className="side-desc ms-3">Log out</span>
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>KONFIRMASI</Modal.Title>
            </Modal.Header>
            <Modal.Body>Log out dari aplikasi?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleLogout}>
                Log out
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      </>
    </div>
  );
};

export default NavBar;
