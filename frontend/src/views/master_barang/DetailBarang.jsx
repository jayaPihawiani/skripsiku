import axios from "axios";
import { useEffect, useState } from "react";
import { BsPencilSquare, BsTrash3 } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import AlertNotify from "../../components/Alert";
import InputComponents from "../../components/InputComponents";
import { formatTahunBulan } from "../../components/kriteriaPengurangEstimasi";
import ModalEditComponent from "../../components/ModalEditComponent";
import SearchBarComponent from "../../components/SearchBarComponent";
import { getBarangUnit } from "../../features/barangSlice";
import { getAllKategori, getAllLokasi } from "../../features/detailBarang";
import { updatePenyusutanBarang } from "../../features/penyusutanSlice";

const DetailBarang = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const [brgId, setBrgId] = useState(null);
  const handleCloseEdit = () => setBrgId(null);
  const [brgHapusId, setBrgHapusId] = useState(null);
  const handleCloseDeleteConfirm = () => setBrgHapusId(null);
  const dataLokasi =
    useSelector((state) => state.detail_barang.all_lokasi?.lokasi) || [];
  const dataKategori =
    useSelector((state) => state.detail_barang.all_kategori?.kategori) || [];
  const dispatch = useDispatch();
  const barangUnitState =
    useSelector((state) => state.barang.barang_unit?.data) || {};
  const dataBarangUnit = barangUnitState?.result || [];
  const [alertShow, setAlertShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputQuery, setInputQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
    kategori: "",
    lokasi: "",
  });
  const [inputEditBrg, setInputEditBrg] = useState({
    kode_barang: "",
    tgl_beli: "",
    lokasi_barang: "",
    lokasi_asal: "",
  });

  // function

  const deleteBrg = async (id) => {
    try {
      const response = await axios.delete(
        `${url}/barang/c/barang_unit/del/${id}`
      );

      if (response.status === 200) {
        alert("Berhasil menghapus data unit barang.");
        dispatch(getBarangUnit(inputQuery));
        handleCloseDeleteConfirm();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.log(error);
      }
    }
  };

  const updateUnitBarang = async (id) => {
    try {
      const response = await axios.patch(
        `${url}/barang/c/barang_unit/update/${id}`,
        inputEditBrg
      );

      if (response.status === 200) {
        alert("Berhasil ubah data unit barang.");
        dispatch(updatePenyusutanBarang());
        dispatch(getBarangUnit(inputQuery));
        handleCloseEdit();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.log(error);
      }
    }
  };

  // PAGE CHANGE REACT PAGINATION
  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected });
  };

  // search
  const handleSearch = (e) => {
    e.preventDefault();
    setInputQuery({ ...inputQuery, search: searchQuery, page: 0 });
  };

  // useEffect
  useEffect(() => {
    dispatch(getBarangUnit(inputQuery));
  }, [
    dispatch,
    inputQuery.page,
    inputQuery.limit,
    inputQuery.search,
    inputQuery.lokasi,
    inputQuery.kategori,
  ]);

  useEffect(() => {
    dispatch(updatePenyusutanBarang());
    dispatch(getAllLokasi());
    dispatch(getAllKategori());
  }, [dispatch]);

  // MAIN
  return (
    <>
      {brgHapusId && (
        <ModalEditComponent
          handleCloseEdit={handleCloseDeleteConfirm}
          modalTitle="Konfirmasi"
          btnTitle="Hapus"
          submit={() => deleteBrg(brgHapusId)}
          body={<p>Yakin ingin menghapus data unit barang?</p>}
        />
      )}
      {brgId && (
        <ModalEditComponent
          handleCloseEdit={() => handleCloseEdit()}
          modalTitle="Ubah Data Barang"
          submit={() => updateUnitBarang(brgId)}
          body={
            <>
              <p className="m-0 mb-2">Kode Barang</p>
              <InputComponents
                val={inputEditBrg.kode_barang || ""}
                placeHolder="kode barang"
                classStyle="w-100 p-2"
                type="text"
                change={(e) =>
                  setInputEditBrg({
                    ...inputEditBrg,
                    kode_barang: e.target.value,
                  })
                }
              />
              <p className="m-0 my-2">Tanggal Beli</p>
              <InputComponents
                type="date"
                classStyle="w-100 p-2"
                val={inputEditBrg.tgl_beli || ""}
                change={(e) =>
                  setInputEditBrg({ ...inputEditBrg, tgl_beli: e.target.value })
                }
              />
              <p className="m-0 my-2">Asal Barang</p>
              <select
                className="form-select"
                onChange={(e) =>
                  setInputEditBrg({
                    ...inputEditBrg,
                    lokasi_asal: e.target.value,
                  })
                }
                value={inputEditBrg.lokasi_asal || ""}
              >
                <option value="">--Pilih--</option>
                {dataLokasi.map((e) => (
                  <option value={e.id} key={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <p className="m-0 my-2">Lokasi Saat Ini</p>
              <select
                className="form-select"
                onChange={(e) =>
                  setInputEditBrg({
                    ...inputEditBrg,
                    lokasi_barang: e.target.value,
                  })
                }
                value={inputEditBrg.lokasi_barang || ""}
              >
                <option value="">--Pilih--</option>
                {dataLokasi.map((e) => (
                  <option value={e.id} key={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </>
          }
        />
      )}
      <AlertNotify
        alertMsg={"Berhasil menambah data lokasi."}
        showAlert={alertShow}
        variantAlert={"success"}
      />
      <h4>DATA UNIT BARANG</h4>
      <div className="card me-4 mt-4 mb-4 shadow-lg">
        <div className="d-flex justify-content-between">
          <div className="w-100">
            <SearchBarComponent
              submit={handleSearch}
              placeHolder="Cari data barang..."
              btnTitle="Cari"
              inputChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mt-3 me-3 d-flex">
            {/* kategori */}
            <select
              className="py-2 px-1 ms-auto"
              onChange={(e) =>
                setInputQuery({
                  ...inputQuery,
                  page: 0,
                  kategori: e.target.value,
                })
              }
            >
              <option value="">Kategori</option>
              {dataKategori.map((e) => (
                <option key={e.id} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
            {/* lokasi */}
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
              <option value="">Lokasi</option>
              {dataLokasi.map((e) => (
                <option key={e.id} value={e.name}>
                  {e.name}
                </option>
              ))}
            </select>
            {/* limit */}
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
                  <td>Kode Barang</td>
                  <td>Nama Barang</td>
                  <td>Tanggal Beli</td>
                  <td>Kategori Barang</td>
                  <td>Kondisi</td>
                  <td>Usia Pakai EKonomis</td>
                  <td>Nilai Buku</td>
                  <td>Asal Barang</td>
                  <td>Lokasi Saat Ini</td>
                  <td style={{ width: "15%" }}>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {dataBarangUnit &&
                  dataBarangUnit.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {index + 1 + inputQuery.page * inputQuery.limit}
                        </td>
                        <td>{item?.kode_barang ?? "-"}</td>
                        <td>{item.barang.name}</td>
                        <td>{item?.tgl_beli.slice(0, 10) ?? "-"}</td>
                        <td>{item.kategori_brg?.name ?? "-"}</td>
                        <td>{item.kondisi}</td>
                        <td>{formatTahunBulan(item.umur_ekonomis)}</td>
                        <td>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.nilai_buku)}
                        </td>
                        <td>{item.loc_asal?.name ?? "-"}</td>
                        <td>{item.loc_barang?.name ?? "-"}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setBrgId(item.id);
                              setInputEditBrg({
                                kode_barang: item.kode_barang,
                                lokasi_barang: item.lokasi_barang,
                                lokasi_asal: item.lokasi_asal,
                                tgl_beli: item.tgl_beli.slice(0, 10),
                              });
                            }}
                          >
                            {<BsPencilSquare />}
                          </button>
                          <button
                            className="btn btn-danger ms-1"
                            onClick={() => setBrgHapusId(item.id)}
                          >
                            {<BsTrash3 />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {dataBarangUnit && dataBarangUnit.length === 0 && (
              <p>Data tidak ditemukan!</p>
            )}
            {barangUnitState && (
              <p className="text-end">
                Total row: <strong>{barangUnitState.count}</strong> page{" "}
                <strong>
                  {barangUnitState.count ? barangUnitState.page + 1 : 0}
                </strong>{" "}
                of <strong>{barangUnitState.totalPage}</strong>
              </p>
            )}
            <nav key={barangUnitState && barangUnitState.count}>
              {barangUnitState && barangUnitState.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={barangUnitState ? barangUnitState.totalPage : 0}
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

export default DetailBarang;
