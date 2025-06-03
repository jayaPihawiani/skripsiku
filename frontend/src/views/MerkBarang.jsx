import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputComponents from "../components/InputComponents";
import ModalComponent from "../components/ModalComponent";
import { authStateReset, userInfo } from "../features/authSlice";
import { getMerkBarang } from "../features/detailBarang";

const MerkBarang = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.auth);
  const detailBarang = useSelector((state) => state.detail_barang);
  const [merkBarang, setMerkBarang] = useState([]);
  const [show, setShow] = useState(false);
  const [dataMerk, setDataMerk] = useState({ name: "", desc: "" });

  const handleClose = () => {
    setShow(false);
    setDataMerk({ name: "", desc: "" });
  };
  const handleShow = () => setShow(true);

  // function
  useEffect(() => {
    dispatch(userInfo());
    dispatch(getMerkBarang());
  }, [dispatch]);

  useEffect(() => {
    if (detailBarang.isSuccess || detailBarang.merk) {
      setMerkBarang(detailBarang.merk);
    }
  }, [detailBarang.merk, detailBarang.isSuccess]);

  useEffect(() => {
    if (!state.data && state.isError) {
      navigate("/login");
      dispatch(authStateReset());
    }
  }, [state, navigate, dispatch]);

  const deleteDataMerk = async (id) => {
    try {
      const response = await axios.delete(`${url}/merk/del/${id}`);
      if (response.status === 200) {
        dispatch(getMerkBarang());
        alert("Berhasil menghapus data.");
      }
    } catch (error) {
      console.error(error.response.data.msg);
    }
  };

  const createDataMerk = async () => {
    if (!dataMerk.name || !dataMerk.desc) {
      alert("Data ada yang kosong! Harap isi semua data!");
      return;
    }
    try {
      const response = await axios.post(`${url}/merk/create`, dataMerk);
      if (response.status === 201) {
        dispatch(getMerkBarang());
        handleClose();
        alert("Berhasil menambah data merk.");
      }
    } catch (error) {
      console.error(error.response.data);
      alert(error.response.data.msg);
    }
  };

  return (
    <>
      <h3>DATA JENIS BARANG</h3>
      <ModalComponent
        btntTitle="Tambah"
        modalTitle="Tambah Data Merk"
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        handleSubmit={createDataMerk}
        inputField={
          <>
            <InputComponents
              classStyle="w-100 p-2"
              placeHolder="Nama"
              change={(e) => setDataMerk({ ...dataMerk, name: e.target.value })}
              val={dataMerk.name}
            />
            <InputComponents
              classStyle="w-100 p-2 mt-2"
              placeHolder="Keterangan"
              change={(e) => setDataMerk({ ...dataMerk, desc: e.target.value })}
              val={dataMerk.desc}
            />
          </>
        }
      />
      <div className="card me-4 mt-2 shadow-lg">
        <div className="card-body">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <td style={{ width: "5%" }}>No. </td>
                <td>Nama</td>
                <td>Keterangan</td>
                <td style={{ width: "15%" }}>Aksi</td>
              </tr>
            </thead>
            <tbody>
              {merkBarang &&
                merkBarang.map((item, index) => {
                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.desc}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`edit/${item.id}`)}
                        >
                          Ubah
                        </button>
                        <button
                          className="btn btn-danger ms-1"
                          onClick={() => deleteDataMerk(item.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MerkBarang;
