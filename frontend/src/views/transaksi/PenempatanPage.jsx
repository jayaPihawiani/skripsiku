import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import { BsTrash3 } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import AlertNotify from "../../components/Alert";
import InputComponents from "../../components/InputComponents";
import LaporanPenempatan, {
  PDFButton,
} from "../../components/Laporan/Penempatan";
import ModalComponent from "../../components/ModalComponent";
import ModalEditComponent from "../../components/ModalEditComponent";
import SearchBarComponent from "../../components/SearchBarComponent";
import SpinnerLoading from "../../components/SpinnerLoading";
import { LoadingContext } from "../../context/Loading";
import {
  getAllBarang,
  getDataPemindahan,
  getUnitBarangByLoc,
} from "../../features/barangSlice";
import { getAllLokasi } from "../../features/detailBarang";
import { updatePenyusutanBrgPindah } from "../../features/penyusutanSlice";
import { getAllUser } from "../../features/UserSlice";

const Penempatan = () => {
  // VARIABEL
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [pindahId, setPindahId] = useState(null);
  const handleCloseDelete = () => setPindahId(null);
  const user = useSelector((state) => state.auth?.data) || {};
  const dataLokasi =
    useSelector((state) => state.detail_barang.all_lokasi?.lokasi) || [];
  const unitBrgByLoc =
    useSelector((state) => state.barang.unit_barang_by_loc?.data) || [];
  const allUser = useSelector((state) => state.user.all_user?.data) || [];
  const barangPindah = useSelector((state) => state.barang.pemindahan);
  const [alertShow, setAlertShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { setLoading } = useContext(LoadingContext);
  const [inputDataPindah, setInputDataPindah] = useState({
    barangUnitId: "",
    desc: "",
    from: "",
    to: "",
    tgl_pindah: "",
    userId: "",
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
      barangUnitId: "",
      desc: "",
      from: "",
      to: "",
      tgl_pindah: "",
    });
  };

  const handleShow = () => setShow(true);

  // FUNTION
  const deleteDataPenempatan = async (id) => {
    try {
      const response = await axios.delete(`${url}/pindah/del/${id}`);
      if (response.status === 200) {
        alert(response.data.msg);
        dispatch(getDataPemindahan(inputQuery));
        handleCloseDelete();
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
        setAlertShow(true);
        setTimeout(() => {
          setAlertShow(false);
        }, 2000);
        dispatch(getDataPemindahan(inputQuery));
        dispatch(getAllBarang());

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
    dispatch(getAllBarang());
    dispatch(getAllLokasi());
    dispatch(getAllUser(inputDataPindah.to));
    dispatch(updatePenyusutanBrgPindah());
    dispatch(getUnitBarangByLoc(inputDataPindah.from));
  }, [
    dispatch,
    inputQuery.page,
    inputQuery.limit,
    inputQuery.search,
    inputDataPindah.to,
    inputDataPindah.from,
    show,
  ]);

  useEffect(() => {
    if (barangPindah.data) {
      setBrgPindah(barangPindah.data);
    }
  }, [barangPindah.data, barangPindah.isSuccess]);

  const pdfDocument = useMemo(() => {
    return <LaporanPenempatan data={brgPindah && brgPindah.pindah} />;
  }, [brgPindah.pindah]);

  // MAIN
  return (
    <div className="w-100 pe-3">
      {pindahId && (
        <ModalEditComponent
          handleCloseEdit={handleCloseDelete}
          modalTitle="Konfirmasi"
          body={<p>Yakin ingin menghapus data penempatan inventaris?</p>}
          btnTitle="Hapus"
          submit={() => deleteDataPenempatan(pindahId)}
        />
      )}
      <AlertNotify
        alertMsg="Berhasil menambah data penempatan"
        showAlert={alertShow}
        variantAlert={"success"}
      />
      <h4>
        {user && user.role === "admin"
          ? "DATA PENEMPATAN INVENTARIS"
          : `DATA INVENTARIS RUANG ${user.loc_user?.name ?? "-"}`}
      </h4>
      <div className="mt-4  ">
        {user && user.role === "admin" && (
          <div>
            <ModalComponent
              btntTitle="Tambah"
              show={show}
              handleClose={handleClose}
              handleShow={handleShow}
              handleSubmit={addBarangPindah}
              modalTitle="Tambah Data Pemindahan Inventaris"
              inputField={
                <>
                  <p className="m-0">Asal Barang</p>
                  <select
                    value={inputDataPindah.from || ""}
                    className="form-select"
                    onChange={(e) => {
                      setInputDataPindah({
                        ...inputDataPindah,
                        from: e.target.value,
                      });
                    }}
                  >
                    <option value="">--Pilih Asal Barang--</option>
                    {dataLokasi.map((e) => {
                      return (
                        <option value={e.id} key={e.id}>
                          {e.name}
                        </option>
                      );
                    })}
                  </select>
                  <p className="m-0 mt-3">Nama Barang</p>
                  <select
                    className="form-select"
                    onChange={(e) =>
                      setInputDataPindah({
                        ...inputDataPindah,
                        barangUnitId: e.target.value,
                      })
                    }
                  >
                    <option value="">--Barang--</option>
                    {unitBrgByLoc.map((e) => {
                      return (
                        <option value={e.id} key={e.id}>
                          {`${e?.kode_barang ?? "-"} ${e.barang.name}`}
                        </option>
                      );
                    })}
                  </select>

                  <p className="m-0 mt-3">Tujuan Pindah</p>
                  <select
                    className="form-select"
                    onChange={(e) => {
                      setInputDataPindah({
                        ...inputDataPindah,
                        to: e.target.value,
                      });
                    }}
                  >
                    <option value="">--Pilih Tujuan Barang--</option>
                    {dataLokasi.map((e) => {
                      return (
                        <option value={e.id} key={e.id}>
                          {e.name}
                        </option>
                      );
                    })}
                  </select>
                  <p className="m-0 mt-3">Penerima</p>
                  <select
                    className="form-select"
                    onChange={(e) => {
                      setInputDataPindah({
                        ...inputDataPindah,
                        userId: e.target.value,
                      });
                    }}
                  >
                    <option value="">--Pilih Penerima--</option>
                    {allUser.map((e) => {
                      return (
                        <option value={e.id} key={e.id}>
                          {e.username}
                        </option>
                      );
                    })}
                  </select>
                  <p className="m-0 mt-3">Keterangan</p>
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
                  <p className="m-0 mt-3">Tanggal Pemindahan</p>
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
            {brgPindah.pindah && brgPindah.pindah.length > 0 ? (
              <PDFButton document={brgPindah && pdfDocument} />
            ) : null}
          </div>
        )}
      </div>

      <div className="card shadow-lg mb-4 mt-2 w-100">
        <div className="d-flex justify-content-between">
          <div className="w-100">
            <SearchBarComponent
              submit={handleSearchBarang}
              placeHolder="Cari data penempatan..."
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
            {barangPindah.isLoading ? (
              <SpinnerLoading />
            ) : (
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>No</th>
                    <th>Kode Unit</th>
                    <th>Nama</th>
                    {user && user.role === "admin" && <th>Asal Barang</th>}
                    {user && user.role === "admin" ? (
                      <th>Tujuan Penempatan</th>
                    ) : (
                      <th>Penempatan</th>
                    )}

                    <th>Penerima</th>
                    <th>Keterangan</th>
                    <th>Tanggal Pemindahan</th>
                    {user && user.role === "admin" && <th>Aksi</th>}
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
                          <td>{e.barang_unit?.kode_barang ?? "-"}</td>
                          <td>{e.barang_unit?.barang?.name ?? "-"}</td>

                          {user && user.role === "admin" && (
                            <td>{e.pindah_from?.name ?? "-"}</td>
                          )}
                          <td>{e.pindah_to?.name ?? "-"}</td>
                          <td>{e.user?.username ?? "-"}</td>
                          <td>{e?.desc ?? "-"}</td>
                          <td>{e.tgl_pindah?.slice(0, 10) ?? "-"}</td>
                          {user && user.role === "admin" && (
                            <td>
                              <button
                                className="btn btn-danger ms-1"
                                onClick={() => setPindahId(e.id)}
                              >
                                {<BsTrash3 />}
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
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

export default Penempatan;
