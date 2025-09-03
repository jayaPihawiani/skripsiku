import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BsPencilSquare, BsTrash3 } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import AlertNotify from "../../components/Alert";
import InputComponents from "../../components/InputComponents";
import { formatTahunBulan } from "../../components/kriteriaPengurangEstimasi";
import ModalComponent from "../../components/ModalComponent";
import ModalEditComponent from "../../components/ModalEditComponent";
import SearchBarComponent from "../../components/SearchBarComponent";
import { LoadingContext } from "../../context/Loading";
import {
  getAllBarang,
  getBrgRusak,
  getBrgRusakByLoc,
} from "../../features/barangSlice";
import { getAllLokasi } from "../../features/detailBarang";
import { getAllKategoriKerusakan } from "../../features/kategoriRusak";

const KerusakanPage = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [rusakId, setRusakId] = useState(null);
  const handleCloseEdit = () => setRusakId(null);
  const [hapusRusakId, setHapusRusakId] = useState(null);
  const handleCloseDelete = () => setHapusRusakId(null);
  const kategoriRusakState =
    useSelector((state) => state.kategori_rusak.all_kategori_kerusakan?.data) ||
    [];
  const [detailKerusakan, setDetailKerusakan] = useState([]);
  const [statusPerbaikanEdit, setStatusPerbaikanEdit] = useState("");
  const rusakState = useSelector((state) => state.barang.barang_rusak);
  const dataBrgRusak = rusakState?.data || [];
  const allLokasi =
    useSelector((state) => state.detail_barang.all_lokasi?.lokasi) || [];
  const barangByLoc =
    useSelector((state) => state.barang.barang_rusak_by_loc?.data) || [];
  const userState = useSelector((state) => state.auth);
  const [alertShow, SetAlertShow] = useState(false);
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputKerusakan, setInputKerusakan] = useState({
    desc: "",
    barangUnitId: "",
    riwayat_pemeliharaan: "",
    sebab_kerusakan: "",
    status_perbaikan: "",
  });
  const [inputQuery, setInputQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
    lokasi: "",
    status_perbaikan: "",
  });
  const { setLoading, loading } = useContext(LoadingContext);
  const handleClose = () => {
    setShow(false);
    setInputKerusakan({ desc: "", barangUnitId: "" });
  };
  const handleShow = () => setShow(true);

  // FUNCTION

  const addDataKerusakan = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${url}/rusak/create`, inputKerusakan);

      if (response.status === 201) {
        SetAlertShow(true);
        setTimeout(() => {
          SetAlertShow(false);
        }, 2000);
        setInputKerusakan({ desc: "", barangUnitId: "" });
        dispatch(getBrgRusak(inputQuery));
        dispatch(getAllBarang());
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

  // update
  const updateStatusPerbaikan = async () => {
    if (!statusPerbaikanEdit) {
      alert("Data tidak boleh kosong!");
      return;
    }
    try {
      const resonse = await axios.patch(`${url}/rusak/update/${rusakId}`, {
        status_perbaikan: statusPerbaikanEdit,
      });

      if (resonse.status === 200) {
        alert("Berhasil update data status.");
        dispatch(getBrgRusak(inputQuery));
        handleCloseEdit();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.error(error);
      }
    }
  };

  const deleteDataKerusakan = async () => {
    try {
      const response = await axios.delete(`${url}/rusak/del/${hapusRusakId}`);
      if (response.status === 200) {
        alert("Berhasil menghapus data kerusakan.");
        dispatch(getBrgRusak(inputQuery));
        setInputQuery({ ...inputQuery, page: 0 });
        handleCloseDelete();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      }
      console.error(error);
    }
  };

  // print laporan
  const printLaporan = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/print/rusak`, {
        responseType: "blob",
      });

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl);
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
    dispatch(getBrgRusak(inputQuery));
    dispatch(getAllBarang());
    dispatch(getAllLokasi());
    dispatch(getBrgRusakByLoc(inputKerusakan.locBarang));
  }, [
    dispatch,
    inputQuery.page,
    inputQuery.limit,
    inputQuery.search,
    inputQuery.lokasi,
    inputQuery.status_perbaikan,
    inputKerusakan.locBarang,
  ]);

  useEffect(() => {
    dispatch(getAllKategoriKerusakan());
  }, [dispatch]);

  // MAIN
  return (
    <>
      {hapusRusakId && (
        <ModalEditComponent
          modalTitle="Konfirmasi"
          handleCloseEdit={handleCloseDelete}
          submit={deleteDataKerusakan}
          body={<p>Yakin ingin menghapus data kerusakan?</p>}
          btnTitle="Hapus"
        />
      )}
      {rusakId && (
        <ModalEditComponent
          modalTitle="Ubah Status Perbaikan"
          handleCloseEdit={handleCloseEdit}
          submit={updateStatusPerbaikan}
          body={
            <>
              <select
                value={statusPerbaikanEdit || ""}
                className="form-select"
                onChange={(e) => setStatusPerbaikanEdit(e.target.value)}
              >
                <option value="">--Pilih--</option>
                <option value="SELESAI DIPERBAIKI BISA DIGUNAKAN">
                  SELESAI DIPERBAIKI BISA DIGUNAKAN
                </option>
                <option value="SELESAI DIPERBAIKI TIDAK BISA DIGUNAKAN">
                  SELESAI DIPERBAIKI TIDAK BISA DIGUNAKAN
                </option>
                <option value="SEDANG DIPERBAIKI">SEDANG DIPERBAIKI</option>
                <option value="BELUM DIPERBAIKI">BELUM DIPERBAIKI</option>
                <option value="TIDAK BISA DIPERBAIKI">
                  TIDAK BISA DIPERBAIKI
                </option>
              </select>
            </>
          }
        />
      )}

      <AlertNotify
        alertMsg={"Berhsil menambah data kerusakan"}
        showAlert={alertShow}
        variantAlert={"success"}
      />

      <h4>DATA KERUSAKAN INVENTARIS BARANG</h4>
      <div className="m-0">
        {userState.data && userState.data.role === "admin" && (
          <ModalComponent
            handleSubmit={addDataKerusakan}
            classStyle="mt-3"
            btntTitle="Tambah Data"
            show={show}
            handleShow={handleShow}
            handleClose={handleClose}
            modalTitle="Tambah Data Inventaris Barang Rusak"
            inputField={
              <>
                <p className="m-0">Lokasi Inventaris</p>
                <select
                  className="form-select"
                  onChange={(e) =>
                    setInputKerusakan({
                      ...inputKerusakan,
                      locBarang: e.target.value,
                    })
                  }
                >
                  <option value="">Pilih</option>
                  {allLokasi &&
                    allLokasi.map((item) => {
                      return (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
                <p className="m-0 mt-2">Nama Inventaris Barang</p>
                <select
                  className="form-select"
                  onChange={(e) =>
                    setInputKerusakan({
                      ...inputKerusakan,
                      barangUnitId: e.target.value,
                    })
                  }
                >
                  <option value="">Pilih</option>
                  {barangByLoc &&
                    barangByLoc.map((item) => {
                      return (
                        <option value={item.id} key={item.id}>
                          {`${item?.kode_barang ?? "-"} --- ${
                            item.barang.name
                          }`}
                        </option>
                      );
                    })}
                </select>

                <p className="mt-2 m-0">Sebab Kerusakan</p>
                <select
                  className="form-select"
                  onChange={(e) => {
                    const value = e.target.value;

                    // Simpan sebab kerusakan yang dipilih
                    setInputKerusakan({
                      ...inputKerusakan,
                      sebab_kerusakan: value,
                    });

                    // Cari kategori yang cocok lalu ambil detail_kerusakans-nya
                    const selectedCategory = kategoriRusakState.find(
                      (item) => item.jenis === value
                    );

                    setDetailKerusakan(
                      selectedCategory ? selectedCategory.detail_kerusakans : []
                    );
                  }}
                >
                  <option value="">--Pilih--</option>
                  {kategoriRusakState.map((item) => (
                    <option value={item.jenis} key={item.id}>
                      {item.jenis}
                    </option>
                  ))}
                </select>

                <p className="m-0 mt-2">Detail Kerusakan</p>
                <select
                  className="form-select"
                  onChange={(e) =>
                    setInputKerusakan({
                      ...inputKerusakan,
                      riwayat_pemeliharaan: e.target.value,
                    })
                  }
                >
                  <option value="">--Pilih--</option>
                  {detailKerusakan.map((item, index) => {
                    return (
                      <option value={item.pengurang} key={index}>
                        {item.desc}
                      </option>
                    );
                  })}
                </select>

                <p className="m-0 mt-2">Status Perbaikan</p>
                <select
                  className="form-select"
                  onChange={(e) =>
                    setInputKerusakan({
                      ...inputKerusakan,
                      status_perbaikan: e.target.value,
                    })
                  }
                >
                  <option value="">--Pilih--</option>
                  <option value="SELESAI DIPERBAIKI BISA DIGUNAKAN">
                    SELESAI DIPERBAIKI BISA DIGUNAKAN
                  </option>
                  <option value="SELESAI DIPERBAIKI TIDAK BISA DIGUNAKAN">
                    SELESAI DIPERBAIKI TIDAK BISA DIGUNAKAN
                  </option>
                  <option value="SEDANG DIPERBAIKI">SEDANG DIPERBAIKI</option>
                  <option value="BELUM DIPERBAIKI">BELUM DIPERBAIKI</option>
                  <option value="TIDAK BISA DIPERBAIKI">
                    TIDAK BISA DIPERBAIKI
                  </option>
                </select>
                <p className="m-0 mt-2">Rincian Kerusakan</p>
                <InputComponents
                  classStyle="w-100 p-2"
                  placeHolder="Rincian kerusakan"
                  change={(e) =>
                    setInputKerusakan({
                      ...inputKerusakan,
                      desc: e.target.value,
                    })
                  }
                />
              </>
            }
          />
        )}

        <button className="btn btn-primary ms-1 mt-3" onClick={printLaporan}>
          {loading ? "Loading..." : "Cetak Laporan Kerusakan"}
        </button>
      </div>

      <div className="card me-4 mt-2 mb-4 shadow-lg">
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
                setInputQuery({
                  ...inputQuery,
                  page: 0,
                  lokasi: e.target.value,
                })
              }
            >
              <option value="">lokasi</option>
              {allLokasi.map((e) => {
                return (
                  <option value={e.name} key={e.id}>
                    {e.name}
                  </option>
                );
              })}
            </select>
            <select
              className="py-2 px-1 ms-auto"
              onChange={(e) =>
                setInputQuery({
                  ...inputQuery,
                  page: 0,
                  status_perbaikan: e.target.value,
                })
              }
            >
              <option value="">status perbaikan</option>
              <option value="SELESAI DIPERBAIKI BISA DIGUNAKAN">
                SELESAI DIPERBAIKI BISA DIGUNAKAN
              </option>
              <option value="SELESAI DIPERBAIKI TIDAK BISA DIGUNAKAN">
                SELESAI DIPERBAIKI TIDAK BISA DIGUNAKAN
              </option>
              <option value="SEDANG DIPERBAIKI">SEDANG DIPERBAIKI</option>
              <option value="BELUM DIPERBAIKI">BELUM DIPERBAIKI</option>
              <option value="TIDAK BISA DIPERBAIKI">
                TIDAK BISA DIPERBAIKI
              </option>
            </select>
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
                  <td>Kode Unit</td>
                  <td>Nama Inventaris Barang</td>
                  <td>Sebab Kerusakan</td>
                  <td>Rincian Kerusakan</td>
                  <td>Status Perbaikan</td>
                  <td>Usia Ekonomis Pakai</td>
                  <td>Keterangan</td>
                  <td>Lokasi Barang</td>

                  {userState.data && userState.data.role === "admin" && (
                    <td style={{ width: "15%" }}>Aksi</td>
                  )}
                </tr>
              </thead>
              <tbody>
                {dataBrgRusak.result &&
                  dataBrgRusak.result.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {index + 1 + inputQuery.page * inputQuery.limit}
                        </td>
                        <td>{item.barang_unit?.kode_barang ?? "-"}</td>
                        <td>{item.barang_unit.barang?.name ?? "-"}</td>
                        <td>{item.sebab_kerusakan}</td>
                        <td>{item.desc}</td>
                        <td>{item.status_perbaikan}</td>
                        <td>
                          {item.status_perbaikan === "SEDANG DIPERBAIKI" ||
                          item.status_perbaikan === "BELUM DIPERBAIKI"
                            ? "Proses Hitung"
                            : formatTahunBulan(item.barang_unit.umur_ekonomis)}
                        </td>
                        <td>
                          {item.status_perbaikan === "SEDANG DIPERBAIKI" ||
                          item.status_perbaikan === "BELUM DIPERBAIKI"
                            ? "-"
                            : `Disusut ${item.riwayat_pemeliharaan} %`}
                        </td>
                        <td>{item.barang_unit.loc_barang?.name ?? "-"}</td>
                        {userState.data && userState.data.role === "admin" && (
                          <td className="text-center">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                setRusakId(item.id);
                                setStatusPerbaikanEdit(item.status_perbaikan);
                              }}
                            >
                              <BsPencilSquare />
                            </button>
                            <button
                              className="btn btn-danger ms-1"
                              onClick={() => setHapusRusakId(item.id)}
                            >
                              <BsTrash3 />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {dataBrgRusak.result && dataBrgRusak.result.length === 0 && (
              <p>Data tidak ditemukan!</p>
            )}
            {dataBrgRusak && (
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
                  pageCount={dataBrgRusak ? dataBrgRusak.totalPage : 0}
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
