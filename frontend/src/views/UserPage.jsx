import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import InputComponents from "../components/InputComponents";
import ModalComponent from "../components/ModalComponent";
import SearchBarComponent from "../components/SearchBarComponent";
import { LoadingContext } from "../context/Loading";
import { getDataDivisi, getDataUser } from "../features/UserSlice";

const UserPage = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const [dataUser, setDataUser] = useState([]);
  const [dataDivisi, setDataDivisi] = useState([]);
  const [show, setShow] = useState(false);
  const [inputDataUser, setInputDataUser] = useState({
    nip: "",
    username: "",
    password: "",
    divisi: "",
    role: "",
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
    setInputDataUser({
      nip: "",
      username: "",
      password: "",
      divisi: "",
      role: "",
    });
  };
  const handleShow = () => setShow(true);

  //   FUNCTION
  const getAllDivisi = async () => {
    try {
      const response = await axios.get(`${url}/divisi/all`);
      if (response.status === 200) {
        setDataDivisi(response.data);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      }
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
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
  const createUser = async () => {
    // if (!dataMerk.name || !dataMerk.desc) {
    //   alert("Data ada yang kosong! Harap isi semua data!");
    //   return;
    // }

    try {
      setLoading(true);
      const response = await axios.post(`${url}/user/create`, inputDataUser);
      if (response.status === 201) {
        dispatch(getDataUser(inputQuery));
        handleClose();
        alert(response.data.msg);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
        return;
      }
      console.error([error.message, error.code]);
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
    dispatch(getDataUser(inputQuery));
    dispatch(getDataDivisi(inputQuery));
    getAllDivisi();
  }, [dispatch, inputQuery.limit, inputQuery.page, inputQuery.search]);

  useEffect(() => {
    if (userState.user && userState.user.isSuccess) {
      setDataUser(userState.user.data);
    }
  }, [userState.user.isSuccess, userState.user.data]);

  //   MAIN
  return (
    <>
      <h4>DATA USER</h4>
      <ModalComponent
        classStyle={"mt-4"}
        btntTitle="Tambah"
        modalTitle="Tambah Data User"
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        handleSubmit={createUser}
        inputField={
          <>
            <p className="m-0">NIP Pegawai</p>
            <InputComponents
              classStyle="w-100 p-2"
              placeHolder="NIP"
              change={(e) =>
                setInputDataUser({ ...inputDataUser, nip: e.target.value })
              }
              val={inputDataUser.nip}
            />
            <p className="m-0 mt-1">Username</p>
            <InputComponents
              classStyle="w-100 p-2"
              placeHolder="Username"
              change={(e) =>
                setInputDataUser({ ...inputDataUser, username: e.target.value })
              }
              val={inputDataUser.username}
            />
            <p className="m-0 mt-1">Password</p>
            <InputComponents
              classStyle="w-100 p-2"
              placeHolder="Password"
              change={(e) =>
                setInputDataUser({ ...inputDataUser, password: e.target.value })
              }
              val={inputDataUser.password}
            />
            <p className="m-0 mt-1">Divisi</p>
            <select
              className="form-select"
              onChange={(e) =>
                setInputDataUser({ ...inputDataUser, divisi: e.target.value })
              }
            >
              <option value="">Pilih Divisi User</option>
              {dataDivisi.map((e) => {
                return (
                  <option value={e.id} key={e.id}>
                    {e.name}
                  </option>
                );
              })}
            </select>
            <p className="m-0 mt-1">Role</p>
            <select
              className="form-select"
              onChange={(e) =>
                setInputDataUser({ ...inputDataUser, role: e.target.value })
              }
            >
              <option value="">Pilih Role User</option>
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
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
                  <td>NIP Pegawai</td>
                  <td>Username</td>
                  <td>Divisi</td>
                  <td>Role</td>
                  <td style={{ width: "15%" }}>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {dataUser.user &&
                  dataUser.user.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {index + 1 + inputQuery.limit * inputQuery.page}
                        </td>
                        <td>{item.nip}</td>
                        <td>{item.username}</td>
                        <td>{item.divisi_user.name}</td>
                        <td>{item.role}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-primary"
                            onClick={() => navigate(`edit/${item.id}`)}
                          >
                            Ubah
                          </button>
                          <button
                            className="btn btn-danger ms-1"
                            onClick={() => deleteUser(item.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {dataUser.user && dataUser.user.length === 0 && (
              <p>Data tidak ditemukan!</p>
            )}
            {dataUser && (
              <p className="text-end">
                Total row: <strong>{dataUser.count}</strong> page{" "}
                <strong>{dataUser.count ? dataUser.page + 1 : 0}</strong> of{" "}
                <strong>{dataUser.totalPage}</strong>
              </p>
            )}
            <nav key={(dataUser && dataUser.count) || 0}>
              {dataUser && dataUser.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={dataUser ? dataUser.totalPage : 0}
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

export default UserPage;
