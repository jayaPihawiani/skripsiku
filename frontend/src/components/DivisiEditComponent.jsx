import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputComponents from "./InputComponents";
import ModalComponent from "./ModalComponent";
import { BsArrowLeft } from "react-icons/bs";

const DivisiEdit = () => {
  // variabel
  const divisiId = useParams().id;
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [dataDivisi, setDataDivisi] = useState({});
  const [inputdataDivisi, setInputdataDivisi] = useState({
    name: "",
    desc: "",
  });

  // function
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  // USE EFFECT
  useEffect(() => {
    const getDivisiById = async () => {
      try {
        const response = await axios.get(`${url}/divisi/${divisiId}`);
        if (response.status === 200) {
          setDataDivisi(response.data);
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

    getDivisiById();
  }, []);

  useEffect(() => {
    if (dataDivisi && dataDivisi.name) {
      setInputdataDivisi({
        name: dataDivisi.name,
        desc: dataDivisi.desc,
      });
    }
  }, [dataDivisi]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${url}/divisi/update/${divisiId}`,
        inputdataDivisi
      );
      if (response.status === 200) {
        alert("Berhasil update data divisi.");
        navigate("/divisi");
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
          navigate("/divisi");
        }}
      />
      <div className="card me-4">
        <div className="card-body">
          <h2>Ubah Data Divisi</h2>
          <div className="d-flex flex-column">
            <InputComponents
              placeHolder=" Nama"
              classStyle="w-100 p-2"
              val={inputdataDivisi.name ?? ""}
              change={(e) =>
                setInputdataDivisi({
                  ...inputdataDivisi,
                  name: e.target.value,
                })
              }
            />
            <InputComponents
              placeHolder="Keterangan"
              classStyle="w-100 p-2 mt-2"
              val={inputdataDivisi.desc ?? ""}
              change={(e) =>
                setInputdataDivisi({
                  ...inputdataDivisi,
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
                inputField={<p>Yakin ingin mengubah data Divisi?</p>}
              />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DivisiEdit;
