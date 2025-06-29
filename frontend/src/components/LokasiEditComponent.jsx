import axios from "axios";
import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import InputComponents from "./InputComponents";
import ModalComponent from "./ModalComponent";

const LokasiEdit = () => {
  // variabel
  const lokasiId = useParams().id;
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [dataLokasi, setDataLokasi] = useState({});
  const [inputDataLokasi, setInputDataLokasi] = useState({
    name: "",
    desc: "",
  });

  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  // function

  // USE EFFECT
  useEffect(() => {
    const getLokasiById = async () => {
      try {
        const response = await axios.get(`${url}/lokasi/${lokasiId}`);
        if (response.status === 200) {
          setDataLokasi(response.data);
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

    getLokasiById();
  }, []);

  useEffect(() => {
    if (dataLokasi && dataLokasi.name) {
      setInputDataLokasi({
        name: dataLokasi.name,
        desc: dataLokasi.desc,
      });
    }
  }, [dataLokasi]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${url}/lokasi/update/${lokasiId}`,
        inputDataLokasi
      );
      if (response.status === 200) {
        alert("Berhasil update data lokasi.");
        navigate("/lokasi");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
        return;
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
          navigate("/lokasi");
        }}
      />
      <div className="card me-4">
        <div className="card-body">
          <h2>Ubah Data Lokasi</h2>
          <div className="d-flex flex-column">
            <InputComponents
              placeHolder=" Nama"
              classStyle="w-100 p-2"
              val={inputDataLokasi.name ?? ""}
              change={(e) =>
                setInputDataLokasi({
                  ...inputDataLokasi,
                  name: e.target.value,
                })
              }
            />
            <InputComponents
              placeHolder="Keterangan"
              classStyle="w-100 p-2 mt-2"
              val={inputDataLokasi.desc ?? ""}
              change={(e) =>
                setInputDataLokasi({
                  ...inputDataLokasi,
                  desc: e.target.value,
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
                inputField={<p>Yakin ingin mengubah data Lokasi?</p>}
              />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LokasiEdit;
