import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputComponents from "../../components/InputComponents";
import ModalComponent from "../../components/ModalComponent";
import SearchBarComponent from "../../components/SearchBarComponent";
import { LoadingContext } from "../../context/Loading";
import { getAllBarang, getBrgRusak } from "../../features/barangSlice";
import AlertNotify from "../../components/Alert";

const KerusakanPage = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rusakState = useSelector((state) => state.barang.barang_rusak);
  const dataBarang =
    useSelector((state) => state.barang.all_barang?.data) || [];
  const userState = useSelector((state) => state.auth);
  const [dataBrgRusak, setDataBrgRusak] = useState([]);
  const [alertShow, SetAlertShow] = useState(false);
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputKerusakan, setInputKerusakan] = useState({
    desc: "",
    qty: 0,
    barangId: "",
  });
  const [inputQuery, setInputQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
  });
  const { setLoading, loading } = useContext(LoadingContext);
  const handleClose = () => {
    setShow(false);
    setInputKerusakan({ desc: "", qty: 0, barangId: "" });
  };
  const handleShow = () => setShow(true);

  // FUNCTION
  const addDataKerusakan = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${url}/rusak/create`, inputKerusakan);

      if (response.status === 201) {
        SetAlertShow(true);
        setTimeout(() => {
          SetAlertShow(false);
        }, 2000);
        setInputKerusakan({ desc: "", qty: 0, barangId: "" });
        dispatch(getBrgRusak(inputQuery));
        dispatch(getAllBarang());
        handleClose();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDataKerusakan = async (id) => {
    try {
      const response = await axios.delete(`${url}/rusak/del/${id}`);
      if (response.status === 200) {
        alert("Berhasil menghapus data kerusakan.");
        dispatch(getBrgRusak(inputQuery));
        setInputQuery({ ...inputQuery, page: 0 });
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      }
      console.error(error);
    }
  };

  // print laporan
  const printLaporan = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/print/rusak`, {
        responseType: "blob",
      });

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  // HANDLE SEARCH
  const handleSearch = (e) => {
    e.preventDefault();
    setInputQuery({ ...inputQuery, search: searchQuery, page: 0 });
  };

  // HANDLE PAGE CLICK
  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected });
  };

  // useEffect
  useEffect(() => {
    dispatch(getBrgRusak(inputQuery));
    dispatch(getAllBarang());
  }, [dispatch, inputQuery.page, inputQuery.limit, inputQuery.search]);

  useEffect(() => {
    if (rusakState.data && rusakState.isSuccess) {
      setDataBrgRusak(rusakState.data);
    }
  }, [rusakState.data, rusakState.isSuccess]);

  // MAIN
  return (
    <>
      <AlertNotify
        alertMsg={"Berhsil menambah data kerusakan"}
        showAlert={alertShow}
        variantAlert={"success"}
      />
      <h4>DATA KERUSAKAN INVENTARIS BARANG</h4>
      <div className="m-0">
        {userState.data && userState.data.role === "admin" && (
          <ModalComponent
            handleSubmit={addDataKerusakan}
            classStyle="mt-3"
            btntTitle="Tambah Data"
            show={show}
            handleShow={handleShow}
            handleClose={handleClose}
            modalTitle="Tambah Data Inventaris Barang Rusak"
            inputField={
              <>
                <p className="m-0">Nama Inventaris Barang</p>
                <select
                  className="form-select"
                  onChange={(e) =>
                    setInputKerusakan({
                      ...inputKerusakan,
                      barangId: e.target.value,
                    })
                  }
                >
                  <option value="">Pilih</option>
                  {dataBarang &&
                    dataBarang.map((item) => {
                      return (
                        <option value={item.id} key={item.id}>
                          {item.name} - qty: {item.qty}
                        </option>
                      );
                    })}
                </select>
                <p className="mt-2 m-0">Sebab Kerusakan</p>
                <InputComponents
                  type="text"
                  placeHolder="Sebab Kerusakan  "
                  classStyle="w-100 p-2"
                  change={(e) =>
                    setInputKerusakan({
                      ...inputKerusakan,
                      desc: e.target.value,
                    })
                  }
                />
                <p className="mt-2 m-0">Jumlah Kerusakan</p>
                <InputComponents
                  type="number"
                  placeHolder="Jumlah"
                  classStyle="w-100 p-2"
                  change={(e) =>
                    setInputKerusakan({
                      ...inputKerusakan,
                      qty: e.target.value,
                    })
                  }
                />
              </>
            }
          />
        )}

        <button className="btn btn-primary ms-1 mt-3" onClick={printLaporan}>
          {loading ? "Loading..." : "Cetak Laporan Kerusakan"}
        </button>
      </div>

      <div className="card me-4 mt-2 mb-4 shadow-lg">
        <div className="d-flex justify-content-between">
          <div className="w-100">
            <SearchBarComponent
              submit={handleSearch}
              btnTitle="Cari"
              placeHolder="Cari data inventaris barang rusak..."
              inputChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mt-3 me-3 d-flex">
            <select
              className="py-2 px-1 ms-auto"
              onChange={(e) =>
                setInputQuery({ ...inputQuery, page: 0, limit: e.target.value })
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
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <td style={{ width: "5%" }}>No. </td>
                  <td>Nama Inventaris Barang</td>
                  <td>Jumlah Rusak</td>
                  <td>Sisa</td>
                  <td>Sebab Kerusakan</td>
                  {userState.data && userState.data.role === "admin" && (
                    <td style={{ width: "15%" }}>Aksi</td>
                  )}
                </tr>
              </thead>
              <tbody>
                {dataBrgRusak.brg_rusak &&
                  dataBrgRusak.brg_rusak.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {index + 1 + inputQuery.page * inputQuery.limit}
                        </td>
                        <td>{item.barang.name}</td>
                        <td>{item.qty}</td>
                        <td>{item.barang.qty}</td>
                        <td>{item.desc}</td>
                        {userState.data && userState.data.role === "admin" && (
                          <td className="text-center">
                            <button
                              className="btn btn-primary"
                              onClick={() => navigate(`edit/${item.id}`)}
                            >
                              Ubah
                            </button>
                            <button
                              className="btn btn-danger ms-1"
                              onClick={() => deleteDataKerusakan(item.id)}
                            >
                              Hapus
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {dataBrgRusak.brg_rusak && dataBrgRusak.brg_rusak.length === 0 && (
              <p>Data tidak ditemukan!</p>
            )}
            {dataBrgRusak.brg_rusak && (
              <p className="text-end">
                Total row: <strong>{dataBrgRusak.count}</strong> page{" "}
                <strong>
                  {dataBrgRusak.count ? dataBrgRusak.page + 1 : 0}
                </strong>{" "}
                of <strong>{dataBrgRusak.totalPage}</strong>
              </p>
            )}
            <nav key={dataBrgRusak && dataBrgRusak.count}>
              {dataBrgRusak && dataBrgRusak.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={
                    dataBrgRusak.brg_rusak ? dataBrgRusak.totalPage : 0
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

export default KerusakanPage;
