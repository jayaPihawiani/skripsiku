import axios from "axios";
import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import InputComponents from "./InputComponents";
import ModalComponent from "./ModalComponent";

const SatuanBarangEdit = () => {
  // variabel
  const satuanId = useParams().id;
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [dataSatuan, setDataSatuan] = useState({});
  const [inputdataSatuan, setInputdataSatuan] = useState({
    name: dataSatuan.name,
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
        const response = await axios.get(`${url}/satuan/${satuanId}`);
        if (response.status === 200) {
          setDataSatuan(response.data);
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
    if (dataSatuan && dataSatuan.name) {
      setInputdataSatuan({
        name: dataSatuan.name,
        desc: dataSatuan.desc,
      });
    }
  }, [dataSatuan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputdataSatuan.name || !inputdataSatuan.desc) {
      alert("Data ada yang kosong! Harap isi semua data!");
      return;
    }
    try {
      const response = await axios.patch(
        `${url}/satuan/update/${satuanId}`,
        inputdataSatuan
      );
      if (response.status === 200) {
        alert("Berhasil update data satuan.");
        navigate("/satuan");
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
        className="back-icon mb-3"
        size={25}
        onClick={() => {
          navigate("/satuan");
        }}
      />
      <div className="card me-4">
        <div className="card-body">
          <h2>Ubah Data Satuan</h2>
          <form onSubmit={handleSubmit} className="d-flex flex-column">
            <InputComponents
              placeHolder="Nama"
              classStyle="w-100 p-2"
              val={inputdataSatuan.name ?? ""}
              change={(e) =>
                setInputdataSatuan({ ...inputdataSatuan, name: e.target.value })
              }
            />
            <InputComponents
              placeHolder="Keterangan"
              classStyle="w-100 p-2 mt-2"
              val={inputdataSatuan.desc ?? ""}
              change={(e) =>
                setInputdataSatuan({ ...inputdataSatuan, desc: e.target.value })
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
                inputField={<p>Yakin ingin mengubah data Satuan?</p>}
              />
            </span>
          </form>
        </div>
      </div>
    </>
  );
};

export default SatuanBarangEdit;
