import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputComponents from "../../components/InputComponents";
import ModalComponent from "../../components/ModalComponent";
import SearchBarComponent from "../../components/SearchBarComponent";
import { LoadingContext } from "../../context/Loading";
import { getDataPemindahan } from "../../features/barangSlice";
import { getDataLokasi } from "../../features/detailBarang";

const Pemindahan = () => {
  // VARIABEL
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dataLokasi, setDataLokasi] = useState([]);
  const [dataBarang, setDataBarang] = useState([]);
  const barangPindah = useSelector((state) => state.barang.pemindahan);
  const user = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const { setLoading } = useContext(LoadingContext);
  const [inputDataPindah, setInputDataPindah] = useState({
    barangId: "",
    qty: 0,
    desc: "",
    from: "",
    to: "",
    tgl_pindah: "",
  });

  const [inputQuery, setInputQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
  });
  const [brgPindah, setBrgPindah] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setInputDataPindah({
      barangId: "",
      qty: 0,
      desc: "",
      from: "",
      to: "",
      tgl_pindah: "",
    });
  };
  const handleShow = () => setShow(true);

  // FUNTION
  const getAllBarangLokasi = async () => {
    try {
      const response = await axios.get(`${url}/barang/all`);
      const lokasi = await axios.get(`${url}/lokasi/all`);
      if (response.status === 200) {
        setDataBarang(response.data);
        setDataLokasi(lokasi.data);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.error(error);
      }
    }
  };

  const deleteDataPindah = async (id) => {
    try {
      const response = await axios.delete(`${url}/pindah/del/${id}`);
      if (response.status === 200) {
        alert(response.data.msg);
        dispatch(getDataPemindahan(inputQuery));
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      }
      console.error(error);
    }
  };

  // CARI INVENTARIS
  const handleSearchBarang = (e) => {
    e.preventDefault();
    setInputQuery({ ...inputQuery, page: 0, search: searchQuery });
  };

  const addBarangPindah = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${url}/pindah/create`,
        inputDataPindah
      );
      if (response.status === 201) {
        alert(response.data.msg);
        dispatch(getDataPemindahan(inputQuery));
        getAllBarangLokasi();

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

  // PAGE CHANGE REACT PAGINATION
  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected });
  };

  // USEEFFECT
  useEffect(() => {
    dispatch(getDataPemindahan(inputQuery));
    getAllBarangLokasi();
  }, [dispatch, inputQuery.page, inputQuery.limit, inputQuery.search]);

  useEffect(() => {
    if (barangPindah.data) {
      setBrgPindah(barangPindah.data);
    }
  }, [barangPindah.data, barangPindah.isSuccess]);

  // MAIN
  return (
    <div className="w-100 pe-3">
      <h4>DATA PEMINDAHAN INVENTARIS</h4>
      <div className="mt-4  ">
        {user.data && user.data.role === "admin" && (
          <ModalComponent
            btntTitle="Tambah"
            show={show}
            handleClose={handleClose}
            handleShow={handleShow}
            handleSubmit={addBarangPindah}
            modalTitle="Tambah Data Barang Masuk"
            inputField={
              <>
                <p className="m-0">Nama Barang</p>
                <select
                  className="form-select"
                  onChange={(e) =>
                    setInputDataPindah({
                      ...inputDataPindah,
                      barangId: e.target.value,
                    })
                  }
                >
                  <option value="">Barang</option>
                  {dataBarang.map((e) => {
                    return (
                      <option value={e.id} key={e.id}>
                        {e.name} - stok {e.qty}
                      </option>
                    );
                  })}
                </select>
                <p className="m-0 mt-1">Asal Barang</p>
                <select
                  className="form-select"
                  onChange={(e) => {
                    setInputDataPindah({
                      ...inputDataPindah,
                      from: e.target.value,
                    });
                  }}
                >
                  <option value="">Pilih Asal Barang</option>
                  {dataLokasi.map((e) => {
                    return (
                      <option value={e.id} key={e.id}>
                        {e.name}
                      </option>
                    );
                  })}
                </select>
                <p className="m-0 mt-1">Tujuan Pindah</p>
                <select
                  className="form-select"
                  onChange={(e) => {
                    setInputDataPindah({
                      ...inputDataPindah,
                      to: e.target.value,
                    });
                  }}
                >
                  <option value="">Pilih Tujuan Barang</option>
                  {dataLokasi.map((e) => {
                    return (
                      <option value={e.id} key={e.id}>
                        {e.name}
                      </option>
                    );
                  })}
                </select>
                <p className="m-0 mt-1">Jumlah</p>
                <InputComponents
                  type="number"
                  classStyle="w-100 p-2"
                  placeHolder="Jumlah"
                  change={(e) =>
                    setInputDataPindah({
                      ...inputDataPindah,
                      qty: e.target.value,
                    })
                  }
                />
                <p className="m-0 mt-1">Keterangan</p>
                <InputComponents
                  type="text"
                  classStyle="w-100 p-2"
                  placeHolder="Keterangan"
                  change={(e) =>
                    setInputDataPindah({
                      ...inputDataPindah,
                      desc: e.target.value,
                    })
                  }
                />
                <p className="m-0 mt-1">Tanggal Pemindahan</p>
                <InputComponents
                  type="date"
                  classStyle="w-100 p-2"
                  placeHolder="Tanggal Masuk"
                  change={(e) =>
                    setInputDataPindah({
                      ...inputDataPindah,
                      tgl_pindah: e.target.value,
                    })
                  }
                />
              </>
            }
          />
        )}
        <button className="btn btn-primary ms-1">
          Cetak Laporan Pemindahan
        </button>
      </div>

      <div className="card shadow-lg mb-4 mt-2 w-100">
        <div className="d-flex justify-content-between">
          <div className="w-100">
            <SearchBarComponent
              submit={handleSearchBarang}
              placeHolder="Cari data pemindahan..."
              btnTitle="Cari"
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
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Asal Barang</th>
                  <th>Tujuan Pindah</th>
                  <th>Jumlah</th>
                  <th>Sisa Stok</th>
                  <th>Keterangan</th>
                  <th>Tanggal Pemindahan</th>
                  {user.data.role === "admin" && <th>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {brgPindah.pindah &&
                  brgPindah.pindah.map((e, index) => {
                    return (
                      <tr key={e.id}>
                        <td>
                          {index + 1 + inputQuery.page * inputQuery.limit}
                        </td>
                        <td>{e.nama_barang.name}</td>
                        <td>{e.pindah_from?.name ?? "-"}</td>
                        <td>{e.pindah_to?.name ?? "-"}</td>
                        <td>{e.qty}</td>
                        <td>{e.nama_barang.qty}</td>
                        <td>{e.desc}</td>
                        <td>{e.tgl_pindah?.slice(0, 10)}</td>
                        {user.data.role === "admin" && (
                          <td>
                            <button
                              className="btn btn-danger ms-1"
                              onClick={() => deleteDataPindah(e.id)}
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
          </div>
          {brgPindah.pindah && brgPindah.pindah.length === 0 && (
            <p>Data tidak ditemukan!</p>
          )}
          {brgPindah && (
            <p className="text-end">
              Total row: <strong>{brgPindah.count}</strong> page
              <strong>
                {brgPindah.count ? brgPindah.page + 1 : 0}
              </strong> of <strong>{brgPindah.totalPage}</strong>
            </p>
          )}
          <nav key={brgPindah && brgPindah.count}>
            {brgPindah && brgPindah.totalPage > 0 && (
              <ReactPaginate
                previousLabel={"<<"}
                nextLabel={">>"}
                breakLabel={"..."}
                pageCount={brgPindah ? brgPindah.totalPage : 0}
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
  );
};

export default Pemindahan;
