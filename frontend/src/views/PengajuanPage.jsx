import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import InputComponents from "../components/InputComponents";
import ModalComponent from "../components/ModalComponent";
import SearchBarComponent from "../components/SearchBarComponent";
import { LoadingContext } from "../context/Loading";
import { userInfo } from "../features/authSlice";
import { getPengajuan } from "../features/pengajuanSlice";

const PengajuanPage = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [file, setFile] = useState("");
  const pengajuanState = useSelector(
    (state) => state.pengajuan.pengajuan?.data
  );
  const pengajuan = useSelector(
    (state) => state.pengajuan.pengajuan.data?.pengajuan
  );
  const userState = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const [inputPengajuan, setInputPengajuan] = useState({
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
    setInputPengajuan({ name: "", desc: "", qty: 0 });
    setFile("");
  };
  const handleShow = () => setShow(true);

  // USE EFFECT
  useEffect(() => {
    dispatch(getPengajuan(inputQuery));
    dispatch(userInfo());
  }, [dispatch, inputQuery.limit, inputQuery.page, inputQuery.search]);

  // USE EFFECT

  const deletepengajuan = async (id) => {
    try {
      const response = await axios.delete(`${url}/pengajuan/del/${id}`);
      if (response.status === 200) {
        setInputQuery({
          ...inputQuery,
          page: 0,
        });

        dispatch(getPengajuan(inputQuery));
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

  // TAMBAH DATA pengajuan
  const createpengajuan = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", inputPengajuan.name);
      formData.append("desc", inputPengajuan.desc);
      formData.append("qty", inputPengajuan.qty);
      formData.append("file", file);
      const response = await axios.post(`${url}/pengajuan/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        dispatch(getPengajuan(inputQuery));
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
        {userState.data && userState.data.role == "user"
          ? `DATA PENGAJUAN INVENTARIS RUANG ${
              userState.data.loc_user?.name ?? ""
            }`
          : `DATA PENGAJUAN INVENTARIS RUANGAN`}
      </h4>
      {userState.data && userState.data.role === "user" && (
        <ModalComponent
          classStyle={"mt-4"}
          btntTitle="Tambah"
          modalTitle="Tambah Data pengajuan"
          show={show}
          handleClose={handleClose}
          handleShow={handleShow}
          handleSubmit={createpengajuan}
          inputField={
            <>
              <p className="m-0">Nama Barang</p>
              <InputComponents
                classStyle="w-100 p-2"
                placeHolder="Nama Barang"
                change={(e) =>
                  setInputPengajuan({
                    ...inputPengajuan,
                    name: e.target.value,
                  })
                }
                val={inputPengajuan.name}
              />
              <p className="m-0 mt-2">Jumlah</p>
              <InputComponents
                type="number"
                classStyle="w-100 p-2"
                placeHolder="Qty"
                change={(e) =>
                  setInputPengajuan({
                    ...inputPengajuan,
                    qty: e.target.value,
                  })
                }
                val={inputPengajuan.qty}
              />
              <p className="m-0 mt-2">Keterangan</p>
              <InputComponents
                classStyle="w-100 p-2"
                placeHolder="Keterangan"
                change={(e) =>
                  setInputPengajuan({
                    ...inputPengajuan,
                    desc: e.target.value,
                  })
                }
                val={inputPengajuan.desc}
              />
              <p className="m-0 mt-2">Unggah Dokumen Disposisi Surat</p>
              <InputComponents
                type="file"
                classStyle="w-100 p-2"
                change={setFileUpload}
                //   val={inputPengajuan.desc}
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
              placeHolder="Cari data pengajuan..."
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
                  <td>Nama Barang pengajuan</td>
                  <td>Keterangan</td>
                  <td>Jumlah</td>
                  {userState.data && userState.data.role === "admin" && (
                    <td>Asal pengajuan</td>
                  )}
                  <td>Tanggal Buat</td>
                  <td style={{ width: "15%" }}>Disposisi Surat pengajuan</td>
                  <td style={{ width: "15%" }}>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {pengajuan &&
                  pengajuan.map((item, index) => {
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
                          <button
                            className="btn btn-primary"
                            onClick={() => window.open(item.url, "_blank")}
                            disabled={!item.url}
                          >
                            Unduh
                          </button>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-danger ms-1"
                            onClick={() => deletepengajuan(item.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {pengajuan && pengajuan.length === 0 && (
              <p>Data tidak ditemukan!</p>
            )}
            {pengajuanState && (
              <p className="text-end">
                Total row: <strong>{pengajuanState.count}</strong> page{" "}
                <strong>
                  {pengajuanState.count ? pengajuanState.page + 1 : 0}
                </strong>{" "}
                of <strong>{pengajuanState.totalPage}</strong>
              </p>
            )}
            <nav key={(pengajuanState && pengajuanState.count) || 0}>
              {pengajuanState && pengajuanState.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={pengajuanState ? pengajuanState.totalPage : 0}
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

export default PengajuanPage;
