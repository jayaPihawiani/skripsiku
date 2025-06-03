import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authStateReset, userInfo } from "../features/authSlice";
import { getDataBarang } from "../features/barangSlice";

const Dashboard = () => {
  // variabel
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.auth);

  // function
  useEffect(() => {
    dispatch(userInfo());
    dispatch(getDataBarang());
  }, [dispatch]);

  useEffect(() => {
    if (!state.data && state.isError) {
      navigate("/login");
      dispatch(authStateReset());
    }
  }, [state, navigate, dispatch]);

  // body
  if (state.data && state.data.username) {
    return <div>{state.data.username}</div>;
  }
};

export default Dashboard;
