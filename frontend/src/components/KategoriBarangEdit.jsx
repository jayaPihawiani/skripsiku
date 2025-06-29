import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputComponents from "./InputComponents";
import ModalComponent from "./ModalComponent";
import { BsArrowLeft } from "react-icons/bs";

const KategoriBarangEdit = () => {
  // variabel
  const kategoriId = useParams().id;
  const url = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [dataKategori, setDataKategori] = useState({});
  const [inputDataKategori, setInputDataKategori] = useState({
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
    const getKategoriById = async () => {
      try {
        const response = await axios.get(`${url}/kategori/${kategoriId}`);
        if (response.status === 200) {
          setDataKategori(response.data);
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

    getKategoriById();
  }, []);

  useEffect(() => {
    if (dataKategori && dataKategori.name) {
      setInputDataKategori({
        name: dataKategori.name,
        desc: dataKategori.desc,
      });
    }
  }, [dataKategori]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${url}/kategori/update/${kategoriId}`,
        inputDataKategori
      );
      if (response.status === 200) {
        alert("Berhasil update data kategori.");
        navigate("/kategori");
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
          navigate("/kategori");
        }}
      />
      <div className="card me-4">
        <div className="card-body">
          <h2>Ubah Data Kategori</h2>
          <form onSubmit={handleSubmit} className="d-flex flex-column">
            <InputComponents
              placeHolder=" Nama"
              classStyle="w-100 p-2"
              val={inputDataKategori.name ?? ""}
              change={(e) =>
                setInputDataKategori({
                  ...inputDataKategori,
                  name: e.target.value,
                })
              }
            />
            <InputComponents
              placeHolder="Keterangan"
              classStyle="w-100 p-2 mt-2"
              val={inputDataKategori.desc ?? ""}
              change={(e) =>
                setInputDataKategori({
                  ...inputDataKategori,
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
                inputField={<p>Yakin ingin mengubah data Kategori?</p>}
              />
            </span>
          </form>
        </div>
      </div>
    </>
  );
};

export default KategoriBarangEdit;
