import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BsPencilSquare, BsTrash3 } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import AlertNotify from "../../components/Alert";
import InputComponents from "../../components/InputComponents";
import ModalEditComponent from "../../components/ModalEditComponent";
import SearchBarComponent from "../../components/SearchBarComponent";
import { formatTahunBulan } from "../../components/kriteriaPengurangEstimasi";
import { LoadingContext } from "../../context/Loading";
import {
  getAllBarang,
  getDataPenghapusan,
  getUnitBarangByLoc,
} from "../../features/barangSlice";
import { getAllLokasi } from "../../features/detailBarang";
import { updatePenyusutanBarang } from "../../features/penyusutanSlice";

const PenghapusanPage = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [brgId, setBrgid] = useState(null);
  const [hapusId, setHapusId] = useState("");
  const [statusPenghapusan, setStatusPenghapusan] = useState("");
  const [penghapusanDeleteId, setPenghapusanDeleteId] = useState(null);
  const handleClosePenghapusanDelete = () => setPenghapusanDeleteId(null);
  const handleClosePenghapusan = () => setBrgid(null);
  const handleCloseStatus = () => setHapusId(null);
  const [isLoading, setIsLoading] = useState(false);
  const dataBarang =
    useSelector((state) => state.barang.unit_barang_by_loc?.data) || [];
  const dataPenghapusan =
    useSelector((state) => state.barang.penghapusan?.data) || {};
  const [file, setFile] = useState("");
  const [alertShow, setAlertShow] = useState(false);
  const [inputPenghapusan, setInputPenghapusan] = useState({
    desc: "",
    tgl_hapus: "",
    barangUnitId: "",
  });
  const [inputQuery, setInputQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
    // kategori: "",
    // lokasi: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { setLoading } = useContext(LoadingContext);

  // FUNCTION
  const deleteDataPenghapusan = async (id) => {
    try {
      const response = await axios.delete(`${url}/penghapusan/del/${id}`);

      if (response.status === 200) {
        alert(response.data.msg);
        dispatch(getDataPenghapusan(inputQuery));
        setInputQuery({ ...inputQuery, page: 0 });

        handleClosePenghapusanDelete();
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

  // HANDLE UPLOAD
  const setFileUpload = (e) => {
    try {
      const file = e.target.files[0];
      setFile(file);
    } catch (error) {
      console.error(error);
    }
  };

  const addDataPenghapusan = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("desc", inputPenghapusan.desc);
      formData.append("tgl_hapus", inputPenghapusan.tgl_hapus);
      formData.append("barangUnitId", inputPenghapusan.barangUnitId);
      formData.append("file", file);

      const response = await axios.post(`${url}/penghapusan/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        setAlertShow(true);
        setTimeout(() => {
          setAlertShow(false);
        }, 2000);
        dispatch(getDataPenghapusan(inputQuery));
        dispatch(getAllBarang());
        setInputQuery({ ...inputQuery, page: 0 });
        handleClosePenghapusan();
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

  const updateStatusPenghapusan = async (id) => {
    try {
      const response = await axios.patch(`${url}/penghapusan/update/${id}`, {
        status: statusPenghapusan,
      });
      if (response.status === 200) {
        dispatch(getDataPenghapusan(inputQuery));
        alert(response.data.msg);
        handleCloseStatus();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.error(error);
      }
    }
  };

  // print laporan
  const printLaporan = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${url}/print/hapus`, {
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
      setIsLoading(false);
    }
  };

  // search
  const handleSearch = (e) => {
    e.preventDefault();
    setInputQuery({ ...inputQuery, search: searchQuery, page: 0 });
  };

  // useEffect
  useEffect(() => {
    dispatch(getDataPenghapusan(inputQuery));
    dispatch(getAllLokasi());
    dispatch(getUnitBarangByLoc(""));
  }, [dispatch, inputQuery.page, inputQuery.limit, inputQuery.search]);

  useEffect(() => {
    dispatch(updatePenyusutanBarang());
  }, [dispatch]);

  // MAIN
  return (
    <>
      {penghapusanDeleteId && (
        <ModalEditComponent
          handleCloseEdit={handleClosePenghapusanDelete}
          submit={() => deleteDataPenghapusan(penghapusanDeleteId)}
          modalTitle="Konfirmasi"
          body={<p>Yakin ingin menghapus data penghapusan?</p>}
          btnTitle="Hapus"
        />
      )}
      {hapusId && (
        <ModalEditComponent
          handleCloseEdit={handleCloseStatus}
          submit={() => updateStatusPenghapusan(hapusId)}
          modalTitle="Status Penghapusan"
          body={
            <>
              <select
                className="form-select"
                value={statusPenghapusan || ""}
                onChange={(e) => setStatusPenghapusan(e.target.value)}
              >
                <option value="">--Pilih--</option>
                <option value="diusul">diusul</option>
                <option value="disetujui">disetujui</option>
                <option value="ditolak">ditolak</option>
              </select>
            </>
          }
        />
      )}
      {brgId && (
        <ModalEditComponent
          handleCloseEdit={handleClosePenghapusan}
          modalTitle="Ajukan Penghapusan"
          submit={addDataPenghapusan}
          body={
            <>
              <p className="m-0 mb-2">Nama Barang</p>
              <select
                className="form-select"
                value={inputPenghapusan.barangUnitId || ""}
                disabled={true}
              >
                {dataBarang.map((e) => (
                  <option value={e.id} key={e.id}>
                    {`${e?.kode_barang ?? "-"} - ${e.barang?.name ?? "-"}`}
                  </option>
                ))}
              </select>
              <p className="m-0 my-2">Alasan Penghapusan</p>
              <InputComponents
                type="text"
                placeHolder="Keterangan"
                classStyle="w-100 p-2"
                change={(e) =>
                  setInputPenghapusan({
                    ...inputPenghapusan,
                    desc: e.target.value,
                  })
                }
              />
              <p className="m-0 my-2">Tanggal Penghapusan</p>
              <InputComponents
                type="date"
                placeHolder="Jumlah"
                classStyle="w-100 p-2"
                change={(e) =>
                  setInputPenghapusan({
                    ...inputPenghapusan,
                    tgl_hapus: e.target.value,
                  })
                }
              />
              <p className="m-0 mt-2">Unggah file</p>
              <InputComponents
                type="file"
                placeHolder="Jumlah"
                classStyle="w-100 p-2"
                change={setFileUpload}
              />
            </>
          }
        />
      )}
      <AlertNotify
        alertMsg={"Berhasil menambah data penghapusan"}
        showAlert={alertShow}
        variantAlert={"success"}
      />
      <h4>DATA INVENTARIS MASUK DAFTAR PENGHAPUSAN</h4>

      <button className="btn btn-primary mt-3 ms-1" onClick={printLaporan}>
        {isLoading ? "Loading..." : " Cetak Laporan Penghapusan"}
      </button>

      <div className="card me-4 mt-2 mb-4 shadow-lg">
        <div className="d-flex justify-content-between">
          <div className="w-100">
            <SearchBarComponent
              btnTitle="Cari"
              placeHolder="Cari data penghapusan inventaris barang..."
              inputChange={(e) => setSearchQuery(e.target.value)}
              submit={handleSearch}
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
                  <td>Nama Barang</td>
                  <td>Kode Barang</td>
                  <td>Asal Ruangan</td>
                  <td>Usia Ekonomis Pakai</td>
                  <td>Nilai Buku</td>
                  <td>Tanggal Hapus</td>
                  <td>Alasan Hapus</td>
                  <td>Status</td>
                  <td style={{ width: "15%" }}>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {dataPenghapusan.result &&
                  dataPenghapusan.result.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {index + 1 + inputQuery.page * inputQuery.limit}
                        </td>
                        <td>{item.barang?.name ?? "-"}</td>
                        <td>{item?.kode_barang ?? "-"}</td>
                        <td>{item.loc_barang?.name ?? "-"}</td>
                        <td>{formatTahunBulan(item.umur_ekonomis)}</td>
                        <td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.nilai_buku)}
                        </td>
                        <td>
                          {item.penghapusan?.tgl_hapus.slice(0, 10) ?? "-"}
                        </td>
                        <td>{item.penghapusan?.desc ?? "-"}</td>
                        <td>
                          {item.penghapusan?.status ?? "-"}
                          {item.penghapusan?.id && (
                            <button
                              className="btn btn-success ms-1"
                              onClick={() => {
                                setHapusId(item.penghapusan.id);
                                setStatusPenghapusan(
                                  item.penghapusan?.status ?? ""
                                );
                              }}
                            >
                              <BsPencilSquare />
                            </button>
                          )}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-primary"
                            disabled={item.penghapusan}
                            onClick={() => {
                              setBrgid(item.id);
                              setInputPenghapusan({
                                ...inputPenghapusan,
                                barangUnitId: item.id,
                              });
                            }}
                          >
                            Ajukan Penghapusan
                          </button>
                          {item.penghapusan?.status === "disetujui" && (
                            <button
                              className="btn btn-danger ms-1"
                              onClick={() =>
                                setPenghapusanDeleteId(item.penghapusan.id)
                              }
                            >
                              <BsTrash3 />
                            </button>
                          )}
                          {/* <button
                            className="btn btn-primary ms-1"
                            onClick={() => window.open(item.url, "_blank")}
                            disabled={!item.url}
                          >
                            Unduh
                          </button> */}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {dataPenghapusan.result &&
              dataPenghapusan.result.length === 0 &&
              "Data tidak ditemukan!"}
            {dataPenghapusan && (
              <p className="text-end">
                Total row: <strong>{dataPenghapusan.count}</strong> page{" "}
                <strong>
                  {dataPenghapusan.count ? dataPenghapusan.page + 1 : 0}
                </strong>{" "}
                of <strong>{dataPenghapusan.totalPage}</strong>
              </p>
            )}
            <nav key={dataPenghapusan && dataPenghapusan.count}>
              {dataPenghapusan && dataPenghapusan.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={dataPenghapusan ? dataPenghapusan.totalPage : 0}
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

export default PenghapusanPage;
