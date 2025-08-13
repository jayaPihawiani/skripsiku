import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import InputComponents from "../components/InputComponents";
import ModalComponent from "../components/ModalComponent";
import SearchBarComponent from "../components/SearchBarComponent";
import { getAllBarang } from "../features/barangSlice";
import { getPermintaan } from "../features/permintaanSlice";
import SpinnerLoading from "../components/SpinnerLoading";

const PermintaanPage = () => {
  // VARIABEL
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [inputQuery, setInputQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
  });
  const [inputPermintaan, setInputPermintaan] = useState({
    barangId: "",
    qty: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [show, setShow] = useState(false);
  const permintaanState = useSelector((state) => state.permintaan?.permintaan);
  const permintaanData = permintaanState?.data || {};
  const allBarang = useSelector((state) => state.barang.all_barang?.data) || [];
  const user = useSelector((state) => state.auth?.data) || {};

  // VARIABEL

  // FUNCTION
  const handleClose = () => {
    setShow(false);
    setInputPermintaan({ barangId: "", qty: "" });
  };

  const handleShow = () => setShow(true);

  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setInputQuery({ ...inputQuery, search: searchQuery, page: 0 });
  };

  const createPermintaan = async () => {
    try {
      const response = await axios.post(
        `${url}/permintaan/create`,
        inputPermintaan
      );
      if (response.status === 201) {
        dispatch(getPermintaan({ ...inputQuery }));
        handleClose();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.error(error);
      }
    }
  };

  const updateStatusPemindahan = async (id) => {
    try {
      const response = await axios.patch(`${url}/permintaan/update/${id}`);
      if (response.status === 200) {
        dispatch(getPermintaan(inputQuery));
        alert(response.data.msg);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.error(error);
      }
    }
  };

  const deletePermintaan = async (id) => {
    try {
      const response = await axios.delete(`${url}/permintaan/del/${id}`);
      if (response.status === 200) {
        dispatch(getPermintaan(inputQuery));
        setInputQuery({
          ...inputQuery,
          page: 0,
        });
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    dispatch(getPermintaan(inputQuery));
    dispatch(getAllBarang());
  }, [dispatch, inputQuery.limit, inputQuery.page, inputQuery.search]);
  // FUNCTION
  return (
    <div>
      <h4>PERMINTAAN USER</h4>
      <ModalComponent
        classStyle="btn btn-primary me-3 mt-3 mb-2"
        btntTitle="Tambah"
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        handleSubmit={createPermintaan}
        modalTitle="Tambah Permintaan"
        inputField={
          <>
            <p className="m-0 mb-2">Nama Barang</p>
            <select
              className="form-select"
              onChange={(e) =>
                setInputPermintaan({
                  ...inputPermintaan,
                  barangId: e.target.value,
                })
              }
            >
              <option value="">--Pilih--</option>
              {allBarang.map((item) => {
                return (
                  <option value={item.id} key={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
            <p className="m-0 my-2">Jumlah</p>
            <InputComponents
              change={(e) =>
                setInputPermintaan({ ...inputPermintaan, qty: e.target.value })
              }
              classStyle="w-100 p-2"
              placeHolder="Qty"
              type="number"
            />
          </>
        }
      />
      <div className="card me-4 shadow">
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
                setInputQuery({
                  ...inputQuery,
                  page: 0,
                  limit: e.target.value,
                })
              }
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        <div className="card-body">
          <div className="overflow-auto">
            {permintaanState.isLoading && permintaanState.isLoading ? (
              <SpinnerLoading />
            ) : (
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>No</th>
                    <th>Nama Inventaris</th>
                    <th>Jumlah Minta</th>
                    <th>Tanggal Minta</th>
                    <th>Asal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {permintaanData.permintaan &&
                    permintaanData.permintaan.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          {index +
                            1 +
                            permintaanData.limit * permintaanData.page}
                        </td>
                        <td>{item.barang.name}</td>
                        <td>{item.qty}</td>
                        <td>{item.createdAt.slice(0, 10)}</td>
                        <td>{item.user.loc_user?.name ?? "-"}</td>
                        <td>{item.status}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-danger"
                            onClick={() => deletePermintaan(item.id)}
                          >
                            Hapus
                          </button>
                          {user && user.role === "admin" && (
                            <button
                              className="btn btn-primary ms-1"
                              onClick={() => updateStatusPemindahan(item.id)}
                              disabled={item.status === "disetujui"}
                            >
                              Setujui
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
            {permintaanData.permintaan &&
              permintaanData.permintaan.length === 0 && (
                <p>Data tidak ditemukan!</p>
              )}
            {permintaanData && (
              <p className="text-end">
                Total row: <strong>{permintaanData.count}</strong> page{" "}
                <strong>
                  {permintaanData.count ? permintaanData.page + 1 : 0}
                </strong>{" "}
                of <strong>{permintaanData.totalPage}</strong>
              </p>
            )}
            <nav key={(permintaanData && permintaanData.count) || 0}>
              {permintaanData && permintaanData.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={permintaanData ? permintaanData.totalPage : 0}
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
    </div>
  );
};

export default PermintaanPage;
