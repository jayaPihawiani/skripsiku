import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputComponents from "./InputComponents";
import ModalComponent from "./ModalComponent";
import { BsArrowLeft } from "react-icons/bs";
import "../css/style.css";

const MerkBarangEdit = () => {
  // variabel
  const merkId = useParams().id;
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [dataMerk, setDataMerk] = useState({});
  const [inputDataMerk, setInputDataMerk] = useState({
    name: "",
    desc: "",
  });

  // function
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    const getMerkById = async () => {
      try {
        const response = await axios.get(`${url}/merk/${merkId}`);
        if (response.status === 200) {
          setDataMerk(response.data);
        }
      } catch (error) {
        if (error.response) {
          alert(error.response.data.msg);
          console.error(error.response.data.msg);
        } else {
          console.log("Gagal mendapatkan data!");
        }
      }
    };

    getMerkById();
  }, []);

  useEffect(() => {
    if (dataMerk && dataMerk.name) {
      setInputDataMerk({
        name: dataMerk.name,
        desc: dataMerk.desc,
      });
    }
  }, [dataMerk]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${url}/merk/update/${merkId}`,
        inputDataMerk
      );
      if (response.status === 200) {
        alert("Berhasil update data merk.");
        navigate("/merk");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
        console.error(error.response.data.msg);
      } else {
        console.log("Gagal mendapatkan data!");
      }
    }
  };

  return (
    <>
      <BsArrowLeft
        className="back-icon"
        size={25}
        onClick={() => {
          navigate("/merk");
        }}
      />
      <div className="card me-4 mt-3">
        <div className="card-body">
          <h2>Ubah Data Merk</h2>
          <form onSubmit={handleSubmit} className="d-flex flex-column">
            <InputComponents
              placeHolder=" Nama"
              classStyle="w-100 p-2"
              val={inputDataMerk.name ?? ""}
              change={(e) =>
                setInputDataMerk({ ...inputDataMerk, name: e.target.value })
              }
            />
            <InputComponents
              placeHolder="Keterangan"
              classStyle="w-100 p-2 mt-2"
              val={inputDataMerk.desc ?? ""}
              change={(e) =>
                setInputDataMerk({ ...inputDataMerk, desc: e.target.value })
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
                inputField={<p>Yakin ingin mengubah data Merk?</p>}
              />
            </span>
          </form>
        </div>
      </div>
    </>
  );
};

export default MerkBarangEdit;
