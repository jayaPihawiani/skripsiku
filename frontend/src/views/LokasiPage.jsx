import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputComponents from "../components/InputComponents";
import ModalComponent from "../components/ModalComponent";
import { getDataLokasi } from "../features/detailBarang";

const LokasiPage = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const detailLokasi = useSelector((state) => state.detail_barang);
  const [dataLokasi, setDataLokasi] = useState([]);
  const [show, setShow] = useState(false);
  const [inputLokasi, setInputLokasi] = useState({ name: "", desc: "" });
  const [inputQuery, setInputQuery] = useState({ page: 0, limit: 10 });

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setInputLokasi({ name: "", desc: "" });
  };

  // function
  useEffect(() => {
    dispatch(getDataLokasi(inputQuery));
  }, [dispatch, inputQuery.page, inputQuery.limit]);

  useEffect(() => {
    if (detailLokasi.lokasi && detailLokasi.isSuccess) {
      setDataLokasi(detailLokasi.lokasi.result);
    }
  }, [detailLokasi.satuan, detailLokasi.isSuccess]);

  const deleteDataLokasi = async (id) => {
    try {
      const response = await axios.delete(`${url}/lokasi/del/${id}`);
      if (response.status === 200) {
        setInputQuery({ ...inputQuery, page: 0 });
        dispatch(getDataLokasi(inputQuery));
        alert("Berhasil menghapus data satuan.");
      }
    } catch (error) {
      console.error(error.response.data.msg);
    }
  };

  const createDataLokasi = async () => {
    if (!inputLokasi.name || !inputLokasi.desc) {
      alert("Data ada yang kosong! Harap isi semua data!");
      return;
    }
    try {
      const response = await axios.post(`${url}/lokasi/create`, inputLokasi);
      if (response.status === 201) {
        setInputQuery({
          ...inputQuery,
          page: 0,
        });
        dispatch(getDataLokasi(inputQuery));
        handleClose();
        alert("Berhasil menambah data lokasi.");
      }
    } catch (error) {
      console.error(error.response.data);
      alert(error.response.data.msg);
    }
  };

  // PAGE CHANGE REACT PAGINATION
  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected });
  };

  return (
    <>
      <h3>DATA SATUAN LOKASI</h3>
      <ModalComponent
        classStyle="mt-4"
        btntTitle="Tambah"
        modalTitle="Tambah Data Lokasi"
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        handleSubmit={createDataLokasi}
        inputField={
          <>
            <InputComponents
              classStyle="w-100 p-2"
              placeHolder="Nama Lokasi"
              change={(e) =>
                setInputLokasi({ ...inputLokasi, name: e.target.value })
              }
              val={inputLokasi.name}
            />
            <InputComponents
              classStyle="w-100 p-2 mt-2"
              placeHolder="Keterangan"
              change={(e) =>
                setInputLokasi({ ...inputLokasi, desc: e.target.value })
              }
              val={inputLokasi.desc}
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
          <div style={{ overflowX: "auto" }}>
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <td style={{ width: "5%" }}>No. </td>
                  <td>Nama Lokasi</td>
                  <td>Keterangan</td>
                  <td style={{ width: "15%" }}>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {dataLokasi &&
                  dataLokasi.map((item, index) => {
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
                            onClick={() => deleteDataLokasi(item.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {detailLokasi.lokasi && (
              <p className="text-end">
                Total row: <strong>{detailLokasi.lokasi.count}</strong> page{" "}
                <strong>
                  {detailLokasi.lokasi.count ? detailLokasi.lokasi.page + 1 : 0}
                </strong>{" "}
                of <strong>{detailLokasi.lokasi.totalPage}</strong>
              </p>
            )}
            <nav key={detailLokasi.lokasi && detailLokasi.lokasi.count}>
              {detailLokasi.lokasi && detailLokasi.lokasi.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={
                    detailLokasi.lokasi ? detailLokasi.lokasi.totalPage : 0
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

export default LokasiPage;
