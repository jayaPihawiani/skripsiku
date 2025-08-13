import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import AlertNotify from "../../components/Alert";
import InputComponents from "../../components/InputComponents";
import ModalComponent from "../../components/ModalComponent";
import ModalEditComponent from "../../components/ModalEditComponent";
import SearchBarComponent from "../../components/SearchBarComponent";
import SpinnerLoading from "../../components/SpinnerLoading";
import { LoadingContext } from "../../context/Loading";
import { getSatuanBarang } from "../../features/detailBarang";

const SatuanBarang = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const [satuanId, setSatuanId] = useState(null);
  const handleCloseEdit = () => setSatuanId(null);
  const dispatch = useDispatch();
  const detailSatuan = useSelector((state) => state.detail_barang?.satuan);
  const satuanBarang = detailSatuan?.satuan || {};
  const [show, setShow] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [inputSatuan, setInputSatuan] = useState({ name: "", desc: "" });
  const [inputSatuanEdit, setInputSatuanEdit] = useState({
    name: "",
    desc: "",
  });
  const [searchQuery, setSearchQuery] = useState();
  const [inputQuery, setInputQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
  });
  const { setLoading } = useContext(LoadingContext);
  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setInputSatuan({ name: "", desc: "" });
  };

  // function
  useEffect(() => {
    dispatch(getSatuanBarang(inputQuery));
  }, [dispatch, inputQuery.page, inputQuery.limit, inputQuery.search]);

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
        setAlertShow(true);
        setTimeout(() => {
          setAlertShow(false);
        }, 2000);
      }
    } catch (error) {
      console.error(error.response.data);
      alert(error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  const updateSatuan = async (e) => {
    e.preventDefault();
    if (!inputSatuanEdit.name || !inputSatuanEdit.desc) {
      alert("Data ada yang kosong! Harap isi semua data!");
      return;
    }
    try {
      const response = await axios.patch(
        `${url}/satuan/update/${satuanId}`,
        inputSatuanEdit
      );
      if (response.status === 200) {
        alert("Berhasil update data satuan.");
        dispatch(getSatuanBarang(inputQuery));
        handleCloseEdit();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.log("Gagal mendapatkan data!");
      }
    }
  };

  // HANDLE SEARCH
  const handleSearchBarang = (e) => {
    e.preventDefault();
    setInputQuery({ ...inputQuery, search: searchQuery, page: 0 });
  };

  // PAGE CHANGE REACT PAGINATION
  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected });
  };

  return (
    <>
      {satuanId && (
        <ModalEditComponent
          handleCloseEdit={handleCloseEdit}
          modalTitle="Ubah Data Satuan"
          submit={updateSatuan}
          body={
            <>
              <p className="m-0 mb-2">Nama Satuan</p>
              <InputComponents
                placeHolder="Nama Satuan"
                classStyle="w-100 p-2"
                val={inputSatuanEdit.name || ""}
                change={(e) =>
                  setInputSatuanEdit({
                    ...inputSatuanEdit,
                    name: e.target.value,
                  })
                }
              />
              <p className="m-0 mb-2 mt-3">Keterangan</p>
              <InputComponents
                placeHolder="Nama Satuan"
                classStyle="w-100 p-2"
                val={inputSatuanEdit.desc || ""}
                change={(e) =>
                  setInputSatuanEdit({
                    ...inputSatuanEdit,
                    desc: e.target.value,
                  })
                }
              />
            </>
          }
        />
      )}
      <AlertNotify
        alertMsg="Berhasil menambah data satuan."
        showAlert={alertShow}
        variantAlert="success"
      />
      <h4>DATA SATUAN BARANG</h4>
      <ModalComponent
        classStyle="mt-3"
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
        <div className="d-flex justify-content-between">
          <div className="w-100">
            <SearchBarComponent
              submit={handleSearchBarang}
              placeHolder="Cari data satuan barang..."
              btnTitle="Cari"
              inputChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="mt-3 me-3 d-flex">
            <select
              className="py-2 px-1 ms-auto"
              onChange={(e) => {
                setInputQuery({
                  ...inputQuery,
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
        </div>
        <div className="card-body">
          <div className="overflow-x-scroll">
            {detailSatuan.isLoading ? (
              <SpinnerLoading />
            ) : (
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
                  {satuanBarang.result &&
                    satuanBarang.result.map((item, index) => {
                      return (
                        <tr key={item.id}>
                          <td>
                            {index + 1 + inputQuery.page * inputQuery.limit}
                          </td>
                          <td>{item.name}</td>
                          <td>{item.desc}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                setSatuanId(item.id);
                                setInputSatuanEdit({
                                  name: item.name,
                                  desc: item.desc,
                                });
                              }}
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
            )}
            {satuanBarang.result && satuanBarang.result.length === 0 && (
              <p>Data tidak ditemukan!</p>
            )}
            {satuanBarang && (
              <p className="text-end">
                Total row: <strong>{satuanBarang.count}</strong> page{" "}
                <strong>
                  {satuanBarang.count ? satuanBarang.page + 1 : 0}
                </strong>
                of <strong>{satuanBarang.totalPage}</strong>
              </p>
            )}
            <nav key={satuanBarang && satuanBarang.count}>
              {satuanBarang && satuanBarang.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={satuanBarang ? satuanBarang.totalPage : 0}
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
