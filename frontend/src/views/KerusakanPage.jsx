import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputComponents from "../components/InputComponents";
import ModalComponent from "../components/ModalComponent";
import SearchBarComponent from "../components/SearchBarComponent";
import { LoadingContext } from "../context/Loading";
import { getBrgRusak } from "../features/barangRusak";

const KerusakanPage = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const rusakState = useSelector((state) => state.brg_rusak);
  const [dataBrgRusak, setDataBrgRusak] = useState([]);
  const [dataBarang, setDataBarang] = useState([]);
  const [show, setShow] = useState(false);
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
  const { setLoading } = useContext(LoadingContext);
  const handleClose = () => {
    setShow(false);
    setInputKerusakan({ desc: "", qty: 0, barangId: "" });
  };
  const handleShow = () => setShow(true);

  // FUNCTION
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

  const addDataKerusakan = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${url}/rusak/create`, inputKerusakan);

      if (response.status === 201) {
        alert("Berhasil menambah data kerusakan");
        setInputKerusakan({ desc: "", qty: 0, barangId: "" });
        dispatch(getBrgRusak(inputQuery));
        getAllBarang();
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

  // HANDLE PAGE CLICK
  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected });
  };

  // useEffect
  useEffect(() => {
    dispatch(getBrgRusak(inputQuery));
    getAllBarang();
  }, [dispatch, inputQuery.page, inputQuery.limit, inputQuery.search]);

  useEffect(() => {
    if (rusakState.data && rusakState.isSuccess) {
      setDataBrgRusak(rusakState.data);
    }
  }, [rusakState.data, rusakState.isSuccess]);

  // MAIN
  return (
    <>
      <h3>DATA KERUSAKAN INVENTARIS BARANG</h3>
      <ModalComponent
        handleSubmit={addDataKerusakan}
        classStyle="mt-4"
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
            <p className="m-0">Keterangan</p>
            <InputComponents
              type="text"
              placeHolder="Keterangan"
              classStyle="w-100 p-2"
              change={(e) =>
                setInputKerusakan({
                  ...inputKerusakan,
                  desc: e.target.value,
                })
              }
            />
            <p className="m-0">Jumlah Kerusakan</p>
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

      <div className="card me-4 mt-2 mb-4 shadow-lg">
        <SearchBarComponent
          btnTitle="Cari"
          placeHolder="Cari data inventaris barang rusak..."
        />
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
        <div className="card-body">
          <div className="overflow-x-scroll">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <td style={{ width: "5%" }}>No. </td>
                  <td>Nama Inventaris Barang</td>
                  <td>Jumlah</td>
                  <td>Keterangan</td>
                  <td style={{ width: "15%" }}>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {dataBrgRusak.brg_rusak &&
                  dataBrgRusak.brg_rusak.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.barang.name}</td>
                        <td>{item.qty}</td>
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
                            onClick={() => deleteDataKerusakan(item.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
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
