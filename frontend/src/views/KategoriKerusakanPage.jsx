import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import AlertNotify from "../components/Alert";
import InputComponents from "../components/InputComponents";
import ModalComponent from "../components/ModalComponent";
import ModalEditComponent from "../components/ModalEditComponent";
import SearchBarComponent from "../components/SearchBarComponent";
import { getKategoriKerusakan } from "../features/kategoriRusak";

const KategoriKerusakanPage = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [kategoriRusakId, setKategoriRusakId] = useState(null);
  const handleCloseTambahDetail = () => setKategoriRusakId(null);
  const [detailRusakId, setDetailRusakId] = useState(null);
  const handleCloseDeleteDetail = () => setDetailRusakId(null);
  const [alertShow, setAlertShow] = useState(false);
  const detailKerusakanState =
    useSelector((state) => state.kategori_rusak.kategori_kerusakan?.data) || {};
  const dataDetailKerusakan = detailKerusakanState?.response || [];
  const [inputQuery, setInputQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
  });
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setJenis("");
  };
  const handleShow = () => setShow(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [jenis, setJenis] = useState("");
  const [inputDetailKerusakan, setInputDetailKerusakan] = useState({
    desc: "",
    pengurang: "",
    kategoriKerusakanId: "",
  });

  // function
  const createJenisKerusakan = async () => {
    try {
      const response = await axios.post(`${url}/kategori_kerusakan/create`, {
        jenis,
      });

      if (response.status === 201) {
        setAlertShow(true);
        dispatch(getKategoriKerusakan(inputQuery));
        handleClose();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
        console.log(error);
      } else {
        console.error(error);
      }
    } finally {
      setTimeout(() => {
        setAlertShow(false);
      }, 3000);
    }
  };

  const createDetailKerusakan = async () => {
    try {
      const response = await axios.post(
        `${url}/detail_kerusakan/create`,
        inputDetailKerusakan
      );

      if (response.status === 201) {
        setAlertShow(true);
        dispatch(getKategoriKerusakan(inputQuery));
        handleCloseTambahDetail();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
        console.log(error);
      } else {
        console.error(error);
      }
    } finally {
      setTimeout(() => {
        setAlertShow(false);
      }, 3000);
    }
  };

  const deleteJenisKerusakan = async (id) => {
    try {
      const response = await axios.delete(
        `${url}/kategori_kerusakan/del/${id}`
      );

      if (response.status === 200) {
        alert("Berhasil menghapus data.");
        dispatch(getKategoriKerusakan(inputQuery));
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.error(error);
      }
    }
  };

  const deleteDetailKerusakan = async (id) => {
    try {
      const response = await axios.delete(`${url}/detail_kerusakan/del/${id}`);

      if (response.status === 200) {
        alert("Berhasil menghapus data.");
        dispatch(getKategoriKerusakan(inputQuery));
        handleCloseDeleteDetail();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      } else {
        console.error(error);
      }
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

  // useeffect
  useEffect(() => {
    dispatch(getKategoriKerusakan(inputQuery));
  }, [dispatch, inputQuery.page, inputQuery.limit, inputQuery.search]);

  return (
    <>
      {kategoriRusakId && (
        <ModalEditComponent
          handleCloseEdit={handleCloseTambahDetail}
          modalTitle="Tambah Data Detail Kerusakan"
          submit={createDetailKerusakan}
          body={
            <>
              <InputComponents
                placeHolder="Detail Kerusakan"
                classStyle="w-100 p-2 mt-2"
                change={(e) =>
                  setInputDetailKerusakan({
                    ...inputDetailKerusakan,
                    desc: e.target.value,
                  })
                }
              />
              <InputComponents
                placeHolder="Bobot"
                classStyle="w-100 p-2 mt-2"
                type="number"
                change={(e) =>
                  setInputDetailKerusakan({
                    ...inputDetailKerusakan,
                    pengurang: e.target.value,
                  })
                }
              />
            </>
          }
        />
      )}
      {detailRusakId && (
        <ModalEditComponent
          handleCloseEdit={handleCloseDeleteDetail}
          modalTitle="Hapus Detail Kerusakan"
          submit={() => deleteDetailKerusakan(detailRusakId)}
          body={<p>Yakin ingin menghapus detail kerusakan?</p>}
          btnTitle="Hapus"
        />
      )}
      <AlertNotify
        alertMsg="Berhasil menambah data kategori"
        showAlert={alertShow}
        variantAlert="success"
      />
      <h4>DATA KATEGORI KERUSAKAN</h4>
      <ModalComponent
        classStyle="mt-3"
        btntTitle="Tambah"
        modalTitle="Tambah Data Kategori Kerusakan"
        show={show}
        handleClose={handleClose}
        handleShow={handleShow}
        handleSubmit={createJenisKerusakan}
        inputField={
          <>
            <InputComponents
              placeHolder="Jenis Kategori"
              classStyle="w-100 p-2"
              change={(e) => setJenis(e.target.value)}
            />
          </>
        }
      />
      <div className="card me-4 mt-2 mb-4 shadow-lg">
        <div className="d-flex justify-content-between">
          <div className="w-100">
            <SearchBarComponent
              submit={handleSearch}
              placeHolder="Cari data kategori barang..."
              btnTitle="Cari"
              inputChange={(e) => {
                setSearchQuery(e.target.value);
              }}
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
          <div className="overflow-x-scroll">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <td style={{ width: "5%" }}>No. </td>
                  <td>Jenis Kategori Kerusakan</td>
                  <td>Detail</td>
                  <td style={{ width: "15%" }}>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {dataDetailKerusakan &&
                  dataDetailKerusakan.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {index + 1 + inputQuery.page * inputQuery.limit}
                        </td>
                        <td>{item.jenis}</td>
                        <td className="d-flex justify-content-between align-items-center">
                          <div>
                            {item.detail_kerusakans.length > 0
                              ? item.detail_kerusakans.map((e, index) => (
                                  <div className="d-flex" key={e.id}>
                                    <p>
                                      - {e.desc} (bobot {e.pengurang}%)
                                    </p>
                                    <div className="ms-3" key={index}>
                                      <button
                                        onClick={() => setDetailRusakId(e.id)}
                                      >
                                        x
                                      </button>
                                    </div>
                                  </div>
                                ))
                              : "-"}
                          </div>
                          <div>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                setKategoriRusakId(item.id);
                                setInputDetailKerusakan({
                                  ...inputDetailKerusakan,
                                  kategoriKerusakanId: item.id,
                                });
                              }}
                            >
                              Tambah
                            </button>
                          </div>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              setKategoriId(item.id);
                              setInputKategoriEdit({
                                name: item.name,
                                desc: item.desc,
                                masa_ekonomis: item.masa_ekonomis,
                              });
                            }}
                          >
                            Ubah
                          </button>
                          <button
                            className="btn btn-danger ms-1"
                            onClick={() => deleteJenisKerusakan(item.id)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {dataDetailKerusakan && dataDetailKerusakan.length === 0 && (
              <p>Data tidak ditemukan!</p>
            )}
            {detailKerusakanState && (
              <p className="text-end">
                Total row: <strong>{detailKerusakanState.count}</strong> page{" "}
                <strong>
                  {detailKerusakanState.count
                    ? detailKerusakanState.page + 1
                    : 0}
                </strong>{" "}
                of <strong>{detailKerusakanState.totalPage}</strong>
              </p>
            )}
            <nav key={detailKerusakanState && detailKerusakanState.count}>
              {detailKerusakanState && detailKerusakanState.totalPage > 0 && (
                <ReactPaginate
                  previousLabel={"<<"}
                  nextLabel={">>"}
                  breakLabel={"..."}
                  pageCount={
                    detailKerusakanState ? detailKerusakanState.totalPage : 0
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

export default KategoriKerusakanPage;
