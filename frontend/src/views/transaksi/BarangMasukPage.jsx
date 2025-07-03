import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputComponents from "../../components/InputComponents";
import ModalComponent from "../../components/ModalComponent";
import SearchBarComponent from "../../components/SearchBarComponent";
import { LoadingContext } from "../../context/Loading";
import { getDataBarangMasuk } from "../../features/barangSlice";

const BarangMasuk = () => {
  // VARIABEL
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dataBarang, setDataBarang] = useState([]);
  const barangMasuk = useSelector((state) => state.barang.barang_masuk);
  const user = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const { setLoading } = useContext(LoadingContext);
  const [inputBrgMasuk, setInputBrgMasuk] = useState({
    barangId: "",
    qty: 0,
    desc: "",
    tgl_masuk: "",
  });

  const [inputQuery, setInputQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
  });
  const [brgMasuk, setBrgMasuk] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setInputBrgMasuk({
      barangId: "",
      qty: 0,
      desc: "",
      tgl_masuk: "",
    });
  };
  const handleShow = () => setShow(true);

  // FUNTION
  const getAllBarang = async () => {
    try {
      const response = await axios.get(`${url}/barang/all`);
      if (response.status === 200) {
        setDataBarang(response.data);
      }
    } catch (error) {
      if (error) {
        console.error(error);
      }
    }
  };

  const deleteDataMasuk = async (id) => {
    try {
      const response = await axios.delete(`${url}/masuk/del/${id}`);
      if (response.status === 200) {
        alert(response.data.msg);
        dispatch(getDataBarangMasuk(inputQuery));
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

  const addBarangMasuk = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${url}/masuk/create`, inputBrgMasuk);
      if (response.status === 201) {
        alert(response.data.msg);
        dispatch(getDataBarangMasuk(inputQuery));
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

  // PAGE CHANGE REACT PAGINATION
  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected });
  };

  // USEEFFECT
  useEffect(() => {
    dispatch(getDataBarangMasuk(inputQuery));
    getAllBarang();
  }, [dispatch, inputQuery]);

  useEffect(() => {
    if (barangMasuk.data) {
      setBrgMasuk(barangMasuk.data);
    }
  }, [barangMasuk.data]);

  // MAIN
  return (
    <div className="w-100 pe-3">
      <h4>DATA BARANG MASUK</h4>
      <div className="mt-4">
        {user.data && user.data.role === "admin" && (
          <ModalComponent
            btntTitle="Tambah"
            show={show}
            handleClose={handleClose}
            handleShow={handleShow}
            handleSubmit={addBarangMasuk}
            modalTitle="Tambah Data Barang Masuk"
            inputField={
              <>
                <p className="m-0">Nama Barang</p>
                <select
                  className="form-select"
                  onChange={(e) =>
                    setInputBrgMasuk({
                      ...inputBrgMasuk,
                      barangId: e.target.value,
                    })
                  }
                >
                  <option value="">Barang</option>
                  {dataBarang.map((e) => {
                    return (
                      <option value={e.id} key={e.id}>
                        {e.name} - stok: {e.qty}
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
                    setInputBrgMasuk({
                      ...inputBrgMasuk,
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
                    setInputBrgMasuk({
                      ...inputBrgMasuk,
                      desc: e.target.value,
                    })
                  }
                />
                <p className="m-0 mt-1">Tanggal Masuk</p>
                <InputComponents
                  type="date"
                  classStyle="w-100 p-2"
                  placeHolder="Tanggal Masuk"
                  change={(e) =>
                    setInputBrgMasuk({
                      ...inputBrgMasuk,
                      tgl_masuk: e.target.value,
                    })
                  }
                />
              </>
            }
          />
        )}
        <button className="btn btn-primary ms-1">Cetak Laporan Masuk</button>
      </div>

      <div className="card shadow-lg mb-2 mt-2 w-100">
        <div className="d-flex justify-content-between">
          <div className="w-100">
            <SearchBarComponent
              submit={handleSearchBarang}
              placeHolder="Cari data barang masuk..."
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
                  <th>Jumlah</th>
                  <th>Harga</th>
                  <th>Kondisi</th>
                  <th>Tanggal Masuk</th>
                  <th>Sisa Stok</th>
                  <th>Keterangan</th>
                  {user.data.role === "admin" && <th>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {brgMasuk.brgMasuk &&
                  brgMasuk.brgMasuk.map((e, index) => {
                    return (
                      <tr key={e.id}>
                        <td>
                          {index + 1 + inputQuery.page * inputQuery.limit}
                        </td>
                        <td>{e.barang.name}</td>
                        <td>{e.qty}</td>
                        <td>{e.barang.harga}</td>
                        <td>{e.barang.kondisi}</td>
                        <td>{e.tgl_masuk?.slice(0, 10)}</td>
                        <td>{e.sisa_stok}</td>
                        <td>{e.desc}</td>
                        {user.data.role === "admin" && (
                          <td>
                            <button
                              className="btn btn-danger ms-1"
                              onClick={() => deleteDataMasuk(e.id)}
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
          {brgMasuk.brgMasuk && brgMasuk.brgMasuk.length === 0 && (
            <p>Data tidak ditemukan!</p>
          )}
          {brgMasuk && (
            <p className="text-end">
              Total row: <strong>{brgMasuk.count}</strong> page{" "}
              <strong>{brgMasuk.count ? brgMasuk.page + 1 : 0}</strong> of{" "}
              <strong>{brgMasuk.totalPage}</strong>
            </p>
          )}
          <nav key={brgMasuk && brgMasuk.count}>
            {brgMasuk && brgMasuk.totalPage > 0 && (
              <ReactPaginate
                previousLabel={"<<"}
                nextLabel={">>"}
                breakLabel={"..."}
                pageCount={brgMasuk ? brgMasuk.totalPage : 0}
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

export default BarangMasuk;
