import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import intanlogo from "../assets/intanlogo.png";
import InputComponents from "../components/InputComponents";
import "../css/login_responsive.css";
import { authStateReset, loginUser } from "../features/authSlice";
import { LoadingContext } from "../context/Loading";

const Login = () => {
  const [dataLogin, setDataLogin] = useState({ username: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.auth);
  const [errMessage, setErrMessage] = useState("");
  const { loading, setLoading } = useContext(LoadingContext);
  // function
  useEffect(() => {
    if (state.isSuccess) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      dispatch(authStateReset());
    }
  }, [state, dispatch, navigate]);

  useEffect(() => {
    if (state.isError || state.message) {
      setErrMessage(state.message);
      setTimeout(() => {
        setErrMessage("");
        dispatch(authStateReset());
      }, 3000);
    }
  }, [state, state.isError, state.message]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await dispatch(loginUser(dataLogin));
    setLoading(false);

    setDataLogin({ username: "", password: "" });
  };

  return (
    <div className="container-fluid min-vh-100 bg-primary position-relative">
      <div className="card-login position-absolute start-50 top-50 translate-middle">
        <img src={intanlogo} alt="intanlogo" />
        <hr />
        <p className="text-center fw-bold">
          Selamat Datang di Aplikasi Pengelolaan Inventaris Barang PT. Air Minum
          Intan Banjar
        </p>
        {state.isError && state.message && (
          <p className="text-danger fst-italic text-center">{errMessage}</p>
        )}
        <form onSubmit={handleLogin} className="d-flex flex-column">
          <InputComponents
            type={"text"}
            classStyle="input-login"
            placeHolder="Username"
            change={(e) =>
              setDataLogin({ ...dataLogin, username: e.target.value })
            }
            val={dataLogin.username}
          />
          <InputComponents
            type={"password"}
            classStyle="input-login my-2"
            placeHolder="Password"
            change={(e) =>
              setDataLogin({ ...dataLogin, password: e.target.value })
            }
            val={dataLogin.password}
          />
          <Button variant="primary" type="submit" className="button-login">
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
