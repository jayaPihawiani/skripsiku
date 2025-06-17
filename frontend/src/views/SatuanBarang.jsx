import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputComponents from "../components/InputComponents";
import ModalComponent from "../components/ModalComponent";
import { LoadingContext } from "../context/Loading";
import { getSatuanBarang } from "../features/detailBarang";

const SatuanBarang = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const detailSatuan = useSelector((state) => state.detail_barang);
  const [satuanBarang, setSatuanBarang] = useState([]);
  const [show, setShow] = useState(false);
  const [inputSatuan, setInputSatuan] = useState({ name: "", desc: "" });
  const [inputQuery, setInputQuery] = useState({ page: 0, limit: 10 });
  const { setLoading } = useContext(LoadingContext);
  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setInputSatuan({ name: "", desc: "" });
  };

  // function
  useEffect(() => {
    dispatch(getSatuanBarang(inputQuery));
  }, [dispatch, inputQuery.page, inputQuery.limit]);

  useEffect(() => {
    if (detailSatuan.satuan && detailSatuan.isSuccess) {
      setSatuanBarang(detailSatuan.satuan.result);
    }
  }, [detailSatuan.satuan, detailSatuan.isSuccess]);

  const deleteDataSatuan = async (id) => {
    try {
      const response = await axios.delete(`${url}/satuan/del/${id}`);
      if (response.status === 200) {
        setInputQuery({ ...inputQuery, page: 0 });
        dispatch(getSatuanBarang(inputQuery));
        alert("Berhasil menghapus data satuan.");
      }
    } catch (error) {
      console.error(error.response.data.msg);
    }
  };

  const createDataSatuan = async () => {
    if (!inputSatuan.name || !inputSatuan.desc) {
      alert("Data ada yang kosong! Harap isi semua data!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(`${url}/satuan/create`, inputSatuan);
      if (response.status === 201) {
        setInputSatuan({ name: "", desc: "" });
        dispatch(getSatuanBarang(inputQuery));
        handleClose();
        alert("Berhasil menambah data satuan.");
      }
    } catch (error) {
      console.error(error.response.data);
      alert(error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  // PAGE CHANGE REACT PAGINATION
  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected });
  };

  return (
    <>
      <h3>DATA SATUAN BARANG</h3>
      <ModalComponent
        classStyle="mt-4"
        btntTitle="Tambah"
        modalTitle="Tambah Data Satuan"
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        handleSubmit={createDataSatuan}
        inputField={
          <>
            <InputComponents
              classStyle="w-100 p-2"
              placeHolder="Nama Satuan"
              change={(e) =>
                setInputSatuan({ ...inputSatuan, name: e.target.value })
              }
              val={inputSatuan.name}
            />
            <InputComponents
              classStyle="w-100 p-2 mt-2"
              placeHolder="Keterangan"
              change={(e) =>
                setInputSatuan({ ...inputSatuan, desc: e.target.value })
              }
              val={inputSatuan.desc}
            />
          </>
        }
      />
      <div className="card me-4 mt-2 mb-4 shadow-lg">
        <div className="mt-3 me-3 d-flex">
          <select
            className="py-2 px-1 ms-auto"
            onChange={(e) => {
              setInputQuery({
                page: 0,
                limit: e.target.value,
              });
            }}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="card-body">
          <div className="overflow-x-scroll">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <td style={{ width: "5%" }}>No. </td>
                  <td>Nama Satuan</td>
                  <td>Keterangan</td>
                  <td style={{ width: "15%" }}>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {satuanBarang &&
                  satuanBarang.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {" "}
                          {index + 1 + inputQuery.page * inputQuery.limit}
                        </td>
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
                            onClick={() => deleteDataSatuan(item.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {detailSatuan.satuan && (
              <p className="text-end">
                Total row: <strong>{detailSatuan.satuan.count}</strong> page{" "}
                <strong>
                  {detailSatuan.satuan.count ? detailSatuan.satuan.page + 1 : 0}
                </strong>{" "}
                of <strong>{detailSatuan.satuan.totalPage}</strong>
              </p>
            )}
            <nav key={detailSatuan.satuan && detailSatuan.satuan.count}>
              {detailSatuan.satuan && detailSatuan.satuan.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={
                    detailSatuan.satuan ? detailSatuan.satuan.totalPage : 0
                  }
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination justify-content-end"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                  forcePage={inputQuery.page}
                />
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default SatuanBarang;
