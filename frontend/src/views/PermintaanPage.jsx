import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import InputComponents from "../components/InputComponents";
import ModalComponent from "../components/ModalComponent";
import SearchBarComponent from "../components/SearchBarComponent";
import { LoadingContext } from "../context/Loading";
import { userInfo } from "../features/authSlice";
import { getPermintaan } from "../features/permintaanSlice";
import { useNavigate } from "react-router-dom";

const PermintaanPage = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const permintaanState = useSelector((state) => state.permintaan.permintaan);
  const userState = useSelector((state) => state.auth);
  const [permintaan, setPermintaan] = useState([]);
  const [show, setShow] = useState(false);
  const [inputPermintaan, setInputPermintaan] = useState({
    name: "",
    desc: "",
    qty: 0,
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
    setInputPermintaan({ name: "", desc: "", qty: 0 });
    setFile("");
  };
  const handleShow = () => setShow(true);

  // USE EFFECT
  useEffect(() => {
    dispatch(getPermintaan(inputQuery));
    dispatch(userInfo());
  }, [dispatch, inputQuery.limit, inputQuery.page, inputQuery.search]);

  useEffect(() => {
    if (permintaanState.data && permintaanState.isSuccess) {
      setPermintaan(permintaanState.data);
    }
  }, [permintaanState.data, permintaanState.isSuccess]);
  // USE EFFECT

  const deletePermintaan = async (id) => {
    try {
      const response = await axios.delete(`${url}/permintaan/del/${id}`);
      if (response.status === 200) {
        setInputQuery({
          ...inputQuery,
          page: 0,
        });

        dispatch(getPermintaan(inputQuery));
        alert("Berhasil menghapus data.");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.error(error);
      }
    }
  };

  // TAMBAH DATA permintaan
  const createPermintaan = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", inputPermintaan.name);
      formData.append("desc", inputPermintaan.desc);
      formData.append("qty", inputPermintaan.qty);
      formData.append("file", file);
      const response = await axios.post(`${url}/permintaan/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        dispatch(getPermintaan(inputQuery));
        alert("Berhasil menambah data merk.");
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

  const handleSearch = (e) => {
    e.preventDefault();
    setInputQuery({ ...inputQuery, search: searchQuery, page: 0 });
  };

  // PAGE CHANGE REACT PAGINATION
  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected });
  };

  // TAMBAH DATA BARANG BARU
  const setFileUpload = (e) => {
    try {
      const file = e.target.files[0];
      setFile(file);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h4
        className={
          userState.data && userState.data.role === "admin" ? "mb-4" : ""
        }
      >
        DATA PERMINTAAN INVENTARIS RUANGAN
      </h4>
      {userState.data && userState.data.role === "user" && (
        <ModalComponent
          classStyle={"mt-4"}
          btntTitle="Tambah"
          modalTitle="Tambah Data Permintaan"
          show={show}
          handleClose={handleClose}
          handleShow={handleShow}
          handleSubmit={createPermintaan}
          inputField={
            <>
              <p className="m-0">Nama Barang</p>
              <InputComponents
                classStyle="w-100 p-2"
                placeHolder="Nama Barang"
                change={(e) =>
                  setInputPermintaan({
                    ...inputPermintaan,
                    name: e.target.value,
                  })
                }
                val={inputPermintaan.name}
              />
              <p className="m-0 mt-2">Jumlah</p>
              <InputComponents
                type="number"
                classStyle="w-100 p-2"
                placeHolder="Qty"
                change={(e) =>
                  setInputPermintaan({
                    ...inputPermintaan,
                    qty: e.target.value,
                  })
                }
                val={inputPermintaan.qty}
              />
              <p className="m-0 mt-2">Keterangan</p>
              <InputComponents
                classStyle="w-100 p-2"
                placeHolder="Keterangan"
                change={(e) =>
                  setInputPermintaan({
                    ...inputPermintaan,
                    desc: e.target.value,
                  })
                }
                val={inputPermintaan.desc}
              />
              <p className="m-0 mt-2">Unggah Dokumen Disposisi Surat</p>
              <InputComponents
                type="file"
                classStyle="w-100 p-2"
                change={setFileUpload}
                //   val={inputPermintaan.desc}
              />
            </>
          }
        />
      )}
      <div className="card me-4 mt-2 mb-4 shadow-lg">
        <div className="d-flex justify-content-between">
          <div className="w-100">
            <SearchBarComponent
              submit={handleSearch}
              placeHolder="Cari data permintaan..."
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
                  <td>Nama Barang Permintaan</td>
                  <td>Keterangan</td>
                  <td>Jumlah</td>
                  {userState.data && userState.data.role === "admin" && (
                    <td>Asal Permintaan</td>
                  )}
                  <td>Tanggal Buat</td>
                  <td style={{ width: "15%" }}>Disposisi Surat Permintaan</td>
                  <td style={{ width: "15%" }}>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {permintaan.permintaan &&
                  permintaan.permintaan.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {index + 1 + inputQuery.page * inputQuery.limit}
                        </td>
                        <td>{item.name}</td>
                        <td>{item.desc}</td>
                        <td>{item.qty}</td>
                        {userState.data && userState.data.role === "admin" && (
                          <td>
                            Ruang {item.user.loc_user?.name ?? "-"} -{" "}
                            {item.user?.username ?? "-"}
                          </td>
                        )}

                        <td>{item.createdAt?.slice(0, 10)}</td>
                        <td className="text-center">
                          <button className="btn btn-primary">Unduh</button>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-primary"
                            onClick={() => navigate("detail")}
                          >
                            Lihat Detail
                          </button>
                          <button
                            className="btn btn-danger ms-1"
                            onClick={() => deletePermintaan(item.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {permintaan.permintaan && permintaan.permintaan.length === 0 && (
              <p>Data tidak ditemukan!</p>
            )}
            {permintaan && (
              <p className="text-end">
                Total row: <strong>{permintaan.count}</strong> page{" "}
                <strong>{permintaan.count ? permintaan.page + 1 : 0}</strong> of{" "}
                <strong>{permintaan.totalPage}</strong>
              </p>
            )}
            <nav key={(permintaan && permintaan.count) || 0}>
              {permintaan && permintaan.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={permintaan ? permintaan.totalPage : 0}
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

export default PermintaanPage;
