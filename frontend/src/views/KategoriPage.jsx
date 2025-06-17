import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputComponents from "../components/InputComponents";
import ModalComponent from "../components/ModalComponent";
import SearchBarComponent from "../components/SearchBarComponent";
import { LoadingContext } from "../context/Loading";
import { getKategoriBarang } from "../features/detailBarang";

const KategoriPage = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const detailBarang = useSelector((state) => state.detail_barang);
  const [kategoriBarang, setKategoriBarang] = useState([]);
  const [show, setShow] = useState(false);
  const [inputKategori, setInputKategori] = useState({ name: "", desc: "" });
  const [inputQuery, setInputQuery] = useState({ page: 0, limit: 10 });
  const { setLoading } = useContext(LoadingContext);
  const handleClose = () => {
    setShow(false);
    setInputKategori({ name: "", desc: "" });
  };
  const handleShow = () => setShow(true);

  // function
  useEffect(() => {
    dispatch(getKategoriBarang(inputQuery));
  }, [dispatch, inputQuery.limit, inputQuery.page]);

  useEffect(() => {
    if (detailBarang.kategori && detailBarang.isSuccess) {
      setKategoriBarang(detailBarang.kategori.result);
    }
  }, [detailBarang.kategori, detailBarang.isSuccess]);

  const deleteDataKategori = async (id) => {
    try {
      const response = await axios.delete(`${url}/kategori/del/${id}`);
      if (response.status === 200) {
        setInputQuery({ ...inputQuery, page: 0 });
        dispatch(getKategoriBarang(inputQuery));
        alert("Berhasil menghapus data.");
      }
    } catch (error) {
      console.error(error.response.data.msg);
    }
  };

  const createDataKategori = async () => {
    if (!inputKategori.name || !inputKategori.desc) {
      alert("Data ada yang kosong! Harap isi semua data!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${url}/kategori/create`,
        inputKategori
      );
      if (response.status === 201) {
        setInputQuery({ ...inputQuery, page: 0 });
        dispatch(getKategoriBarang(inputQuery));
        handleClose();
        alert("Berhasil menambah data merk.");
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
      <h3>DATA KATEGORI BARANG</h3>
      <ModalComponent
        classStyle="mt-4"
        btntTitle="Tambah"
        modalTitle="Tambah Data Kategori"
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        handleSubmit={createDataKategori}
        inputField={
          <>
            <InputComponents
              classStyle="w-100 p-2"
              placeHolder="Nama Kategori"
              change={(e) =>
                setInputKategori({ ...inputKategori, name: e.target.value })
              }
              val={inputKategori.name}
            />
            <InputComponents
              classStyle="w-100 p-2 mt-2"
              placeHolder="Keterangan"
              change={(e) =>
                setInputKategori({ ...inputKategori, desc: e.target.value })
              }
              val={inputKategori.desc}
            />
          </>
        }
      />
      <div className="card me-4 mt-2 mb-4 shadow-lg">
        <SearchBarComponent
          placeHolder="Cari data inventaris barang..."
          btnTitle="Cari"
        />
        <div className="mt-3 me-3 d-flex">
          <select
            className="py-2 px-1 ms-auto"
            onChange={(e) => setInputQuery({ page: 0, limit: e.target.value })}
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
                  <td>Nama Kategori</td>
                  <td>Keterangan</td>
                  <td style={{ width: "15%" }}>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {kategoriBarang &&
                  kategoriBarang.map((item, index) => {
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
                            onClick={() => deleteDataKategori(item.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {detailBarang.merk && (
              <p className="text-end">
                Total row: <strong>{detailBarang.merk.count}</strong> page{" "}
                <strong>
                  {detailBarang.merk.count ? detailBarang.merk.page + 1 : 0}
                </strong>{" "}
                of <strong>{detailBarang.merk.totalPage}</strong>
              </p>
            )}
            <nav key={detailBarang.kategori && detailBarang.kategori.count}>
              {detailBarang.kategori && detailBarang.kategori.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={
                    detailBarang.kategori ? detailBarang.kategori.totalPage : 0
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

export default KategoriPage;
