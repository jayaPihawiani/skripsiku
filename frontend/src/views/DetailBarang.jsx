import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import AlertNotify from "../components/Alert";
import InputComponents from "../components/InputComponents";
import { formatTahunBulan } from "../components/kriteriaPengurangEstimasi";
import ModalEditComponent from "../components/ModalEditComponent";
import SearchBarComponent from "../components/SearchBarComponent";
import { LoadingContext } from "../context/Loading";
import { getBarangUnit } from "../features/barangSlice";
import { updatePenyusutanBarang } from "../features/penyusutanSlice";

const DetailBarang = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const [locId, setLocId] = useState(null);
  const [locHapusId, setLocHapusId] = useState(null);
  const handleCloseEdit = (closeUseState) => closeUseState(null);
  const dispatch = useDispatch();
  const barangUnitState =
    useSelector((state) => state.barang.barang_unit?.data) || {};
  const dataBarangUnit = barangUnitState?.result || [];
  const [show, setShow] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputLokasiEdit, setInputLokasiEdit] = useState({
    name: "",
    desc: "",
  });
  const [inputQuery, setInputQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
  });
  const { setLoading } = useContext(LoadingContext);

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setInputLokasi({ name: "", desc: "" });
  };

  // function

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
    dispatch(updatePenyusutanBarang());
  }, [dispatch, inputQuery.page, inputQuery.limit, inputQuery.search]);

  // MAIN
  return (
    <>
      {locId && (
        <ModalEditComponent
          handleCloseEdit={() => handleCloseEdit(setLocId)}
          modalTitle="Ubah Data Lokasi"
          submit={updateDataLokasi}
          body={
            <>
              <p className="m-0 mb-2">Nama Lokasi</p>
              <InputComponents
                placeHolder="Nama Lokasi"
                classStyle="w-100 p-2"
                val={inputLokasiEdit.name}
                change={(e) =>
                  setInputLokasiEdit({
                    ...inputLokasiEdit,
                    name: e.target.value,
                  })
                }
              />
              <p className="m-0 my-2">Keterangan Lokasi</p>
              <InputComponents
                placeHolder="Nama Lokasi"
                classStyle="w-100 p-2"
                val={inputLokasiEdit.desc}
                change={(e) =>
                  setInputLokasiEdit({
                    ...inputLokasiEdit,
                    desc: e.target.value,
                  })
                }
              />
            </>
          }
        />
      )}
      {locHapusId && (
        <ModalEditComponent
          modalTitle="Hapus Data Lokasi"
          body={<p>Yakin ingin hapus data lokasi?</p>}
          btnTitle="Hapus"
          submit={() => deleteDataLokasi(locHapusId)}
          handleCloseEdit={() => {
            handleCloseEdit(setLocHapusId);
          }}
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
                        <td>{item.barang.name}</td>
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
                          <button className="btn btn-primary">Ubah</button>
                          <button
                            className="btn btn-danger ms-1"
                            onClick={() => setLocHapusId(item.id)}
                          >
                            Hapus
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
