import React from "react";
import { useSelector } from "react-redux";

const AuthAccessComponent = ({ children }) => {
  // variabel
  const state = useSelector((state) => state.auth);

  // body
  if (state.data && state.data.role === "user") {
    return (
      <div className="text-center mt-4">
        <h1>🚫 Forbidden Access</h1>
        <p>
          Sorry, you don’t have the required permissions to access this content.
        </p>
        <p>
          Please contact the administrator if you believe this is a mistake.
        </p>
      </div>
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthAccessComponent;
