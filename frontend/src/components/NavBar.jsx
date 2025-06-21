import React from "react";
import { useSelector } from "react-redux";

const NavBar = () => {
  const user = useSelector((state) => state.auth);
  return (
    <div
      className="d-flex align-items-center p-2"
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
        <p className="m-0 text-light">
          Welcome, <strong>{user.data && user.data.username}</strong>
        </p>
      </div>
    </div>
  );
};

export default NavBar;
