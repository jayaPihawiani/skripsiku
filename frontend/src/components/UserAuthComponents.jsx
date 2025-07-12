import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authStateReset, userInfo } from "../features/authSlice";

const UserAuthComponent = ({ children }) => {
  // variabel
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.auth);

  // function
  useEffect(() => {
    dispatch(userInfo());
  }, [dispatch]);

  useEffect(() => {
    if (!state.data && state.isError) {
      navigate("/login");
      dispatch(authStateReset());
    }
  }, [state, navigate, dispatch]);

  // body
  if (state.data && state.data.username) {
    return <section style={{ marginTop: "65px" }}>{children}</section>;
  }
};

export default UserAuthComponent;
