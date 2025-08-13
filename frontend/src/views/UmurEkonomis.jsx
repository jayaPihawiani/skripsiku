import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import InputComponents from "../components/InputComponents";
import { formatTahunBulan } from "../components/kriteriaPengurangEstimasi";
import ModalEditComponent from "../components/ModalEditComponent";
import SearchBarComponent from "../components/SearchBarComponent";
import { getBarangUnit } from "../features/barangSlice";
import { updatePenyusutanBarang } from "../features/penyusutanSlice";

const UmurEkonomis = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [barangId, setBarangId] = useState("");
  const handleCloseEdit = () => setBarangId("");
  const [dataPenyusutanUpdate, setDataPenyusutanUpdate] = useState({
    masa_ekonomis_baru: "",
    nilai_buku_manual: "",
  });
  const brgStateStatus = useSelector((state) => state.barang.barang?.data);
  const brgUnitState =
    useSelector((state) => state.barang.barang_unit?.data) || {};
  const dataBarangUnit = brgUnitState?.result || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [inputQuery, setInputQuery] = useState({
    search: "",
    page: 0,
    limit: 10,
  });

  // function
  const handleSearch = (e) => {
    e.preventDefault();
    setInputQuery({ ...inputQuery, search: searchQuery, page: 0 });
  };

  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected, search: "" });
  };

  // useeffect
  useEffect(() => {
    dispatch(getBarangUnit(inputQuery));
    // dispatch(updatePenyusutanBarang());
  }, [dispatch, inputQuery]);

  return (
    <>
      {barangId && (
        <ModalEditComponent
          handleCloseEdit={handleCloseEdit}
          modalTitle="Ubah Masa Manfaat Inventaris"
          submit={updatePenyusutanByAdmin}
          body={
            <>
              <p className="m-0 mb-2">Masa Manfaat Baru</p>
              <InputComponents
                classStyle="w-100 p-2"
                placeHolder="Masa Manfaat (Tahun)"
                type="number"
                change={(e) =>
                  setDataPenyusutanUpdate({
                    ...dataPenyusutanUpdate,
                    masa_ekonomis_baru: e.target.value,
                  })
                }
              />
              <p className="mb-2 mt-3">Masa Manfaat Baru</p>
              <InputComponents
                classStyle="w-100 p-2"
                placeHolder="Masa Manfaat (Tahun)"
                type="number"
                change={(e) =>
                  setDataPenyusutanUpdate({
                    ...dataPenyusutanUpdate,
                    nilai_buku_manual: e.target.value,
                  })
                }
              />
            </>
          }
        />
      )}
      <h4>USIA EKONOMIS PAKAI INVENTARIS</h4>
      <div className="card m-0 me-3 mt-4">
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
          <div className="overflow-auto">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>No</th>
                  <th>Id Unit</th>
                  <th>Nama Inventaris</th>
                  <th>Kategori</th>
                  <th>Tanggal Beli</th>
                  <th>Harga Beli / unit</th>
                  <th>Kondisi</th>
                  <th>Usia Ekonomis Pakai</th>
                  <th>Nilai Buku</th>
                  <th>Lokasi Barang</th>
                </tr>
              </thead>
              <tbody>
                {dataBarangUnit &&
                  dataBarangUnit.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1 + inputQuery.page * inputQuery.limit}</td>
                      <td>{item.id.split("-").pop()}</td>
                      <td>{item.barang.name}</td>
                      <td>{item.kategori_brg?.name ?? "-"}</td>
                      <td>{item.barang.tgl_beli.slice(0, 10)}</td>
                      <td>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.barang.harga)}
                      </td>
                      <td>{item.kondisi}</td>
                      <td>{formatTahunBulan(item.umur_ekonomis)}</td>
                      <td>
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(item.nilai_buku)}
                      </td>
                      <td>{item.loc_barang?.name ?? "-"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {dataBarangUnit && dataBarangUnit.length === 0 && (
              <p>Data tidak ditemukan!</p>
            )}
            {brgUnitState && (
              <p className="text-end">
                Total row: <strong>{brgUnitState.count}</strong> page{" "}
                <strong>
                  {brgUnitState.count ? brgUnitState.page + 1 : 0}
                </strong>{" "}
                of <strong>{brgUnitState.totalPage}</strong>
              </p>
            )}
            <nav key={(brgUnitState && brgUnitState.count) || 0}>
              {brgUnitState && brgUnitState.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={brgUnitState ? brgUnitState.totalPage : 0}
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

export default UmurEkonomis;
