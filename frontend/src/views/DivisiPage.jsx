import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputComponents from "../components/InputComponents";
import ModalComponent from "../components/ModalComponent";
import SearchBarComponent from "../components/SearchBarComponent";
import { LoadingContext } from "../context/Loading";
import { getDataDivisi } from "../features/UserSlice";

const DivisiPage = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const divisiState = useSelector((state) => state.user);
  const [dataDivisi, setDataDivisi] = useState([]);
  const [show, setShow] = useState(false);
  const [inputDataDivisi, setInputDataDivisi] = useState({
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
    setInputDataDivisi({
      name: "",
      desc: "",
    });
  };
  const handleShow = () => setShow(true);

  //   FUNCTION

  const deleteDivisi = async (id) => {
    try {
      const response = await axios.delete(`${url}/divisi/del/${id}`);
      if (response.status === 200) {
        setInputQuery({
          ...inputQuery,
          page: 0,
        });
        dispatch(getDataDivisi(inputQuery));
        alert("Berhasil menghapus data divisi.");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
        return;
      }
      console.error(error);
    }
  };

  // TAMBAH DATA MERK
  const createDivisi = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${url}/divisi/create`,
        inputDataDivisi
      );

      if (response.status === 201) {
        dispatch(getDataDivisi(inputQuery));
        handleClose();
        alert(response.data.msg);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
        return;
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setInputQuery({ ...inputQuery, search: searchQuery, page: 0 });
  };

  // PAGE CHANGE REACT PAGINATION
  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected, search: "" });
  };

  useEffect(() => {
    dispatch(getDataDivisi(inputQuery));
  }, [dispatch, inputQuery.limit, inputQuery.page, inputQuery.search]);

  useEffect(() => {
    if (divisiState.divisi && divisiState.divisi.isSuccess) {
      setDataDivisi(divisiState.divisi.data);
    }
  }, [divisiState.divisi.isSuccess, divisiState.divisi.data]);

  //   MAIN
  return (
    <>
      <h4>DATA DIVISI USER</h4>
      <ModalComponent
        classStyle={"mt-4"}
        btntTitle="Tambah"
        modalTitle="Tambah Data Divisi"
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        handleSubmit={createDivisi}
        inputField={
          <>
            <p className="m-0">Nama Divisi</p>
            <InputComponents
              classStyle="w-100 p-2"
              placeHolder="Nama Divisi"
              change={(e) =>
                setInputDataDivisi({ ...inputDataDivisi, name: e.target.value })
              }
            />
            <p className="m-0 mt-1">Keterangan</p>
            <InputComponents
              classStyle="w-100 p-2"
              placeHolder="Keterangan"
              change={(e) =>
                setInputDataDivisi({ ...inputDataDivisi, desc: e.target.value })
              }
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
                  <td>Nama</td>
                  <td>Keterangan</td>
                  <td style={{ width: "15%" }}>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {dataDivisi.result &&
                  dataDivisi.result.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {index + 1 + inputQuery.limit * inputQuery.page}
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
                            onClick={() => deleteDivisi(item.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {dataDivisi.result && dataDivisi.result.length === 0 && (
              <p>Data tidak ditemukan!</p>
            )}
            {dataDivisi && (
              <p className="text-end">
                Total row: <strong>{dataDivisi.count}</strong> page{" "}
                <strong>{dataDivisi.count ? dataDivisi.page + 1 : 0}</strong> of{" "}
                <strong>{dataDivisi.totalPage}</strong>
              </p>
            )}
            <nav key={(dataDivisi && dataDivisi.count) || 0}>
              {dataDivisi && dataDivisi.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={dataDivisi ? dataDivisi.totalPage : 0}
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

export default DivisiPage;
