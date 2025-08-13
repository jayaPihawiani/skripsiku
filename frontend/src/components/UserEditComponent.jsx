import axios from "axios";
import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import InputComponents from "./InputComponents";
import ModalComponent from "./ModalComponent";

const UserEdit = () => {
  // variabel
  const userId = useParams().id;
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [lokasi, setLokasi] = useState([]);
  const [user, setUser] = useState({});
  const [inputDataUser, setInputDataUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    lokasiId: "",
  });

  // function
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  // USE EFFECT
  useEffect(() => {
    const getUserById = async () => {
      try {
        const user = await axios.get(`${url}/user/${userId}`);
        if (user.status === 200) {
          setUser(user.data);
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data.msg);
        } else {
          console.log("Gagal mendapatkan data!");
        }
      }
    };

    const getAllLokasi = async () => {
      try {
        const response = await axios.get(`${url}/lokasi/all`);
        if (response.status === 200) {
          setLokasi(response.data);
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data.msg);
        } else {
          console.error(error);
        }
      }
    };

    getUserById();
    getAllLokasi();
  }, []);

  useEffect(() => {
    if (user && user.username) {
      setInputDataUser({
        ...inputDataUser,
        username: user.username,
        lokasiId: user.loc_user?.id ?? "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${url}/user/update/${userId}`,
        inputDataUser
      );
      if (response.status === 200) {
        alert("Berhasil update data divisi.");
        navigate("/user");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <>
      <BsArrowLeft
        className="back-icon mb-3"
        size={25}
        onClick={() => {
          navigate("/user");
        }}
      />
      <div className="card me-4">
        <div className="card-body">
          <h2>Ubah Data User</h2>
          <div className="d-flex flex-column">
            <select
              value={inputDataUser.lokasiId || ""}
              className="form-select mt-2"
              onChange={(e) =>
                setInputDataUser({
                  ...inputDataUser,
                  lokasiId: e.target.value,
                })
              }
            >
              <option value="">--Pilih Lokasi--</option>
              {lokasi.map((e) => {
                return (
                  <option value={e.id} key={e.id}>
                    {e.name}
                  </option>
                );
              })}
            </select>
            <InputComponents
              val={inputDataUser.username}
              placeHolder="Username"
              classStyle="w-100 p-2 mt-2"
              change={(e) =>
                setInputDataUser({
                  ...inputDataUser,
                  username: e.target.value,
                })
              }
            />
            <InputComponents
              val={inputDataUser.password}
              placeHolder="Password"
              classStyle="w-100 p-2 mt-2"
              change={(e) =>
                setInputDataUser({
                  ...inputDataUser,
                  password: e.target.value,
                })
              }
            />
            <InputComponents
              val={inputDataUser.confirmPassword}
              placeHolder="Konfirmasi Password"
              classStyle="w-100 p-2 mt-2"
              change={(e) =>
                setInputDataUser({
                  ...inputDataUser,
                  confirmPassword: e.target.value,
                })
              }
            />
            <span className="ms-auto mt-1">
              <ModalComponent
                show={show}
                handleClose={handleClose}
                handleShow={handleShow}
                btntTitle="Ubah"
                btnType2="submit"
                handleSubmit={handleSubmit}
                modalTitle="KONFIRMASI"
                inputField={<p>Yakin ingin mengubah data User?</p>}
              />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserEdit;
