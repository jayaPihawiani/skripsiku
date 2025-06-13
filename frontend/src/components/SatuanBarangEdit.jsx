import { useEffect, useState } from "react";
import InputComponents from "./InputComponents";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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
          <button className="btn btn-primary ms-auto mt-2" type="submit">
            Ubah
          </button>
        </form>
      </div>
    </div>
  );
};

export default SatuanBarangEdit;
