import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import AlertNotify from "../components/Alert";
import {
  formatTahunBulan,
  kondisiBarang,
  riwayatPemeliharaan,
} from "../components/kriteriaPengurangEstimasi";
import ModalEditComponent from "../components/ModalEditComponent";
import SearchBarComponent from "../components/SearchBarComponent";
import { LoadingContext } from "../context/Loading";
import { getAllBarang, getDataPemindahan } from "../features/barangSlice";
import { getAllLokasi } from "../features/detailBarang";
import { getAllUser } from "../features/UserSlice";

const DistribusiPage = () => {
  // variabel
  const [pindahId, setPindahId] = useState("");
  const handleShowEdit = (id) => setPindahId(id);
  const handleCloseEdit = () => setPindahId("");
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const dataPemindahan =
    useSelector((state) => state.barang.pemindahan?.data) || [];
  const userState = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputDataRiwayat, setInputDataRiwayat] = useState({
    riwayat_pemeliharaan: null,
    kondisi: null,
  });
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

  const deleteDistribusi = async (id) => {
    try {
      const response = await axios.delete(`${url}/distribusi/del/${id}`);
      if (response.status === 200) {
        alert("Berhasil menghapus data distribusi.");
        setInputQuery({ ...inputQuery, page: 0 });
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      }
      console.error(error);
    }
  };

  // update
  const handleEditRiwayat = async () => {
    try {
      const response = await axios.patch(
        `${url}/pindah/update/${pindahId}`,
        inputDataRiwayat
      );
      if (response.status === 200) {
        alert(response.data.msg);
        handleCloseEdit();
        dispatch(getDataPemindahan(inputQuery));
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.error(error);
      }
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
    dispatch(getAllBarang());
    dispatch(getAllLokasi());
    dispatch(getAllUser());
    dispatch(getDataPemindahan(inputQuery));
  }, [dispatch, inputQuery.page, inputQuery.limit, inputQuery.search]);

  // MAIN
  return (
    <>
      {pindahId && (
        <ModalEditComponent
          submit={handleEditRiwayat}
          modalTitle="Ubah Riwayat Pemeliharaan"
          handleCloseEdit={handleCloseEdit}
          body={
            <>
              <p className="m-0">Kondisi</p>
              <select
                className="form-select mt-2"
                onChange={(e) =>
                  setInputDataRiwayat({
                    ...inputDataRiwayat,
                    kondisi: e.target.value,
                  })
                }
              >
                <option value="">--Pilih--</option>
                {kondisiBarang.map((e, index) => {
                  return (
                    <option value={e.jenis} key={index}>
                      {e.jenis}
                    </option>
                  );
                })}
              </select>
              <p className="m-0 mt-2">Riwayat Pemeliharaan</p>
              <select
                className="form-select"
                onChange={(e) =>
                  setInputDataRiwayat({
                    ...inputDataRiwayat,
                    riwayat_pemeliharaan: e.target.value,
                  })
                }
              >
                <option value="">--Pilih--</option>
                {riwayatPemeliharaan.map((e, index) => {
                  return <option value={e.jenis}>{e.jenis}</option>;
                })}
              </select>
            </>
          }
        />
      )}
      <AlertNotify
        alertMsg={"Berhasil menambah data distribusi"}
        showAlert={alertShow}
        variantAlert={"success"}
      />
      <h4>
        {" "}
        {userState.data && userState.data.role === "admin"
          ? "DATA DISTRIBUSI INVENTARIS"
          : `DATA INVENTARIS RUANG ${userState.data.loc_user?.name ?? "-"}`}
      </h4>

      <div className="card me-4 mt-4 mb-4 shadow-lg">
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
                  <td>Lokasi</td>
                  <td>Kondisi Barang</td>
                  <td>Riwayat Pemeliharaan</td>
                  <td>Masa Ekonomis Inventaris</td>
                  <td style={{ width: "15%" }}>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {dataPemindahan.pindah &&
                  dataPemindahan.pindah.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {index + 1 + inputQuery.page * inputQuery.limit}
                        </td>
                        <td>{item.barang_unit.barang?.name ?? "-"}</td>
                        <td>{item.pindah_to?.name ?? "-"}</td>
                        <td>{item.kondisi}</td>
                        <td>{item.riwayat_pemeliharaan ?? "-"}</td>
                        <td>{formatTahunBulan(item.umur_ekonomis)}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleShowEdit(item.id)}
                          >
                            Ubah Riwayat
                          </button>
                          {userState.data &&
                            userState.data.role === "admin" && (
                              <button
                                className="btn btn-danger ms-1"
                                onClick={() => deleteDistribusi(item.id)}
                              >
                                Hapus
                              </button>
                            )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {dataPemindahan.pindah && dataPemindahan.pindah.length === 0 && (
              <p>Data tidak ditemukan!</p>
            )}
            {dataPemindahan.pindah && (
              <p className="text-end">
                Total row: <strong>{dataPemindahan.count}</strong> page{" "}
                <strong>
                  {dataPemindahan.count ? dataPemindahan.page + 1 : 0}
                </strong>{" "}
                of <strong>{dataPemindahan.totalPage}</strong>
              </p>
            )}
            <nav key={dataPemindahan && dataPemindahan.count}>
              {dataPemindahan && dataPemindahan.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={
                    dataPemindahan.pindah ? dataPemindahan.totalPage : 0
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
