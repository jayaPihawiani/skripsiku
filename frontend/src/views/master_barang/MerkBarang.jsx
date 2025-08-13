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
import { getMerkBarang } from "../../features/detailBarang";

const MerkBarang = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const [merkId, setMerkId] = useState(null);
  const handleCloseEdit = () => {
    setMerkId(null);
    setDataMerkEdit({ name: "", desc: "" });
  };
  const dispatch = useDispatch();
  const detailBarang = useSelector((state) => state.detail_barang?.merk);
  const merkBarang = detailBarang.merk?.result || [];
  const [show, setShow] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [dataMerk, setDataMerk] = useState({ name: "", desc: "" });
  const [dataMerkEdit, setDataMerkEdit] = useState({
    name: "",
    desc: "",
  });
  const [inputQuery, setInputQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
  });
  const { setLoading } = useContext(LoadingContext);
  const [searchQuery, setSearchQuery] = useState("");

  const handleClose = () => {
    setShow(false);
    setDataMerk({ name: "", desc: "" });
  };
  const handleShow = () => setShow(true);

  // USE EFFECT
  useEffect(() => {
    dispatch(getMerkBarang(inputQuery));
  }, [dispatch, inputQuery.limit, inputQuery.page, inputQuery.search]);

  // USE EFFECT
  const deleteDataMerk = async (id) => {
    try {
      const response = await axios.delete(`${url}/merk/del/${id}`);
      if (response.status === 200) {
        setInputQuery({
          ...inputQuery,
          page: 0,
        });

        dispatch(getMerkBarang(inputQuery));
        alert("Berhasil menghapus data.");
      }
    } catch (error) {
      console.error(error.response.data.msg);
    }
  };

  // TAMBAH DATA MERK
  const createDataMerk = async () => {
    if (!dataMerk.name || !dataMerk.desc) {
      alert("Data ada yang kosong! Harap isi semua data!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${url}/merk/create`, dataMerk);
      if (response.status === 201) {
        dispatch(getMerkBarang(inputQuery));
        handleClose();
        setAlertShow(true);
        setTimeout(() => {
          setAlertShow(false);
        }, 2000);
        // alert("Berhasil menambah data merk.");
      }
    } catch (error) {
      console.error(error.response.data);
      alert(error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  const updateDataMerk = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${url}/merk/update/${merkId}`,
        dataMerkEdit
      );
      if (response.status === 200) {
        alert("Berhasil update data merk.");
        dispatch(getMerkBarang(inputQuery));
        handleCloseEdit();
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

  const handleSearch = (e) => {
    e.preventDefault();
    setInputQuery({ ...inputQuery, search: searchQuery, page: 0 });
  };

  // PAGE CHANGE REACT PAGINATION
  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected });
  };

  return (
    <>
      {merkId && (
        <ModalEditComponent
          handleCloseEdit={handleCloseEdit}
          modalTitle="Ubah Data Merk"
          submit={updateDataMerk}
          body={
            <>
              <p className="m-0 mb-2">Nama Merk</p>
              <InputComponents
                val={dataMerkEdit.name}
                type="text"
                placeHolder="Nama Merk"
                classStyle="w-100 p-2"
                change={(e) =>
                  setDataMerkEdit({ ...dataMerkEdit, name: e.target.value })
                }
              />
              <p className="m-0 mt-2">Keterangan</p>
              <InputComponents
                val={dataMerkEdit.desc}
                type="text"
                placeHolder="Keterangan"
                classStyle="w-100 p-2"
                change={(e) =>
                  setDataMerkEdit({ ...dataMerkEdit, desc: e.target.value })
                }
              />
            </>
          }
        />
      )}
      <AlertNotify
        showAlert={alertShow}
        alertMsg="Berhasil menambah data merk"
        variantAlert="success"
      />
      <h4>DATA MERK BARANG</h4>
      <ModalComponent
        classStyle={"mt-3"}
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
              placeHolder="Nama Merk"
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
      <div className="card me-4 mt-2 mb-4 shadow-lg">
        <div className="d-flex justify-content-between">
          <div className="w-100">
            <SearchBarComponent
              submit={handleSearch}
              placeHolder="Cari data merk barang..."
              btnTitle="Cari"
              inputChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mt-3 me-3 d-flex">
            <select
              className="py-2 px-1 ms-auto"
              onChange={(e) =>
                setInputQuery({
                  ...inputQuery,
                  page: 0,
                  limit: e.target.value,
                })
              }
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        <div className="card-body">
          <div className="overflow-x-scroll">
            {detailBarang.isLoading ? (
              <SpinnerLoading />
            ) : (
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <td style={{ width: "5%" }}>No. </td>
                    <td>Nama Merk</td>
                    <td>Keterangan</td>
                    <td style={{ width: "15%" }}>Aksi</td>
                  </tr>
                </thead>
                <tbody>
                  {merkBarang &&
                    merkBarang.map((item, index) => {
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
                                setMerkId(item.id);
                                setDataMerkEdit({
                                  name: item.name,
                                  desc: item.desc,
                                });
                              }}
                              // onClick={() => navigate(`edit/${item.id}`)}
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
            )}
            {detailBarang.merk && detailBarang.merk.result.length === 0 && (
              <p>Data tidak ditemukan!</p>
            )}
            {detailBarang.merk && (
              <p className="text-end">
                Total row: <strong>{detailBarang.merk.count}</strong> page{" "}
                <strong>
                  {detailBarang.merk.count ? detailBarang.merk.page + 1 : 0}
                </strong>{" "}
                of <strong>{detailBarang.merk.totalPage}</strong>
              </p>
            )}
            <nav key={(detailBarang.merk && detailBarang.merk.count) || 0}>
              {detailBarang.merk && detailBarang.merk.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={
                    detailBarang.merk ? detailBarang.merk.totalPage : 0
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

export default MerkBarang;
