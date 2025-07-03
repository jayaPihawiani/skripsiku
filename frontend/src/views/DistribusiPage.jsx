import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputComponents from "../components/InputComponents";
import ModalComponent from "../components/ModalComponent";
import SearchBarComponent from "../components/SearchBarComponent";
import { LoadingContext } from "../context/Loading";
import { getDataDistribusi } from "../features/barangSlice";

const DistribusiPage = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const distribusiState = useSelector((state) => state.barang.distribusi);
  const userState = useSelector((state) => state.auth);
  const [dataDistribusi, setDataDistribusi] = useState([]);
  const [dataBarang, setDataBarang] = useState([]);
  const [dataLokasi, setDataLokasi] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputDistribusi, setInputDistribusi] = useState({
    barangId: "",
    lokasiId: "",
    userId: "",
    qty: 0,
  });
  const [inputQuery, setInputQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
  });
  const { setLoading, loading } = useContext(LoadingContext);
  const handleClose = () => {
    setShow(false);
    setInputDistribusi({ barangId: "", lokasiId: "", userId: "", qty: 0 });
  };
  const handleShow = () => setShow(true);

  // FUNCTION
  const getAllBarang = async () => {
    try {
      const barang = await axios.get(`${url}/barang/all`);
      const lokasi = await axios.get(`${url}/lokasi/all`);
      const user = await axios.get(`${url}/user/all`);
      if (barang.status === 200) {
        setDataBarang(barang.data);
        setDataLokasi(lokasi.data);
        setDataUser(user.data);
      }
    } catch (error) {
      if (error) {
        console.error(error);
      }
    }
  };

  const addDistribusi = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${url}/distribusi/create`,
        inputDistribusi
      );

      if (response.status === 201) {
        alert("Berhasil menambah data distribusi.");
        dispatch(getDataDistribusi(inputQuery));
        getAllBarang();
        handleClose();
      }
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

  const deleteDistribusi = async (id) => {
    try {
      const response = await axios.delete(`${url}/distribusi/del/${id}`);
      if (response.status === 200) {
        alert("Berhasil menghapus data distribusi.");
        dispatch(getDataDistribusi(inputQuery));
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
    dispatch(getDataDistribusi(inputQuery));
    getAllBarang();
  }, [dispatch, inputQuery.page, inputQuery.limit, inputQuery.search]);

  useEffect(() => {
    if (distribusiState.data && distribusiState.isSuccess) {
      setDataDistribusi(distribusiState.data);
    }
  }, [distribusiState.data, distribusiState.isSuccess]);

  // MAIN
  return (
    <>
      <h4>
        {" "}
        {userState.data && userState.data.role === "admin"
          ? "DATA DISTRIBUSI INVENTARIS"
          : `DATA INVENTARIS RUANG ${userState.data.divisi_user.name}`}
      </h4>
      <div className="m-0">
        {userState.data && userState.data.role === "admin" && (
          <ModalComponent
            handleSubmit={addDistribusi}
            classStyle="mt-3"
            btntTitle="Tambah Data"
            show={show}
            handleShow={handleShow}
            handleClose={handleClose}
            modalTitle="Tambah Data Distribusi Inventaris"
            inputField={
              <>
                <p className="m-0">Nama Inventaris Barang</p>
                <select
                  className="form-select"
                  onChange={(e) =>
                    setInputDistribusi({
                      ...inputDistribusi,
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
                <p className="m-0 mt-2">Lokasi Barang</p>
                <select
                  className="form-select"
                  onChange={(e) =>
                    setInputDistribusi({
                      ...inputDistribusi,
                      lokasiId: e.target.value,
                    })
                  }
                >
                  <option value="">Pilih</option>
                  {dataLokasi &&
                    dataLokasi.map((item) => {
                      return (
                        <option value={item.id} key={item.id}>
                          {item.name} - qty: {item.qty}
                        </option>
                      );
                    })}
                </select>
                <p className="m-0 mt-2">User</p>
                <select
                  className="form-select"
                  onChange={(e) =>
                    setInputDistribusi({
                      ...inputDistribusi,
                      userId: e.target.value,
                    })
                  }
                >
                  <option value="">Pilih</option>
                  {dataUser &&
                    dataUser.map((item) => {
                      return (
                        <option value={item.id} key={item.id}>
                          {item.username} - {item.divisi_user?.name ?? "-"}
                        </option>
                      );
                    })}
                </select>
                <p className="mt-2 m-0">Jumlah</p>
                <InputComponents
                  type="number"
                  placeHolder="Jumlah  "
                  classStyle="w-100 p-2"
                  change={(e) =>
                    setInputDistribusi({
                      ...inputDistribusi,
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
                  <td>Jumlah</td>
                  <td>Lokasi</td>
                  <td>Kondisi</td>
                  <td>Riwayat Pemeliharaan</td>
                  <td style={{ width: "15%" }}>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {dataDistribusi.distribusi &&
                  dataDistribusi.distribusi.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {index + 1 + inputQuery.page * inputQuery.limit}
                        </td>
                        <td>{item.barang.name}</td>
                        <td>{item.qty}</td>
                        <td>
                          {item.lokasi_unit?.name ?? "-"} /{" "}
                          {item.user?.username ?? "-"} -{" "}
                          {item.user?.divisi_user?.name ?? "-"}
                        </td>
                        <td>{item.barang?.kondisi ?? "-"}</td>
                        <td>{item.barang?.riwayat_pemeliharaan ?? "-"}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-primary"
                            onClick={() => navigate(`edit/${item.id}`)}
                          >
                            Ubah Riwayat
                          </button>
                          <button
                            className="btn btn-danger ms-1"
                            onClick={() => deleteDistribusi(item.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {dataDistribusi.distribusi &&
              dataDistribusi.distribusi.length === 0 && (
                <p>Data tidak ditemukan!</p>
              )}
            {dataDistribusi.distribusi && (
              <p className="text-end">
                Total row: <strong>{dataDistribusi.count}</strong> page{" "}
                <strong>
                  {dataDistribusi.count ? dataDistribusi.page + 1 : 0}
                </strong>{" "}
                of <strong>{dataDistribusi.totalPage}</strong>
              </p>
            )}
            <nav key={dataDistribusi && dataDistribusi.count}>
              {dataDistribusi && dataDistribusi.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={
                    dataDistribusi.distribusi ? dataDistribusi.totalPage : 0
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

export default DistribusiPage;
