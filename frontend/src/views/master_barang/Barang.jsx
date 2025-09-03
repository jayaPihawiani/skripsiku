import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { BsPencilSquare, BsTrash3 } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import AlertNotify from "../../components/Alert";
import InputComponents from "../../components/InputComponents";
import { kondisiBarang } from "../../components/kriteriaPengurangEstimasi";
import ModalComponent from "../../components/ModalComponent";
import ModalEditComponent from "../../components/ModalEditComponent";
import SearchBarComponent from "../../components/SearchBarComponent";
import SpinnerLoading from "../../components/SpinnerLoading";
import { LoadingContext } from "../../context/Loading";
import { getDataBarang } from "../../features/barangSlice";
import {
  getAllKategori,
  getAllLokasi,
  getAllMerk,
} from "../../features/detailBarang";
import { updatePenyusutanBarang } from "../../features/penyusutanSlice";

const Barang = () => {
  // VARIABEL
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const [hapusBrgId, setHapusBrgId] = useState(null);
  const handleCloseHapus = () => setHapusBrgId(null);
  const [ubahBrgId, setUbahBrgId] = useState(null);
  const handleCloseEdit = () => setUbahBrgId(null);
  const barang = useSelector((state) => state.barang?.barang);
  const user = useSelector((state) => state.auth);
  const allLokasi =
    useSelector((state) => state.detail_barang.all_lokasi?.lokasi) || [];
  const kategoriBarang =
    useSelector((state) => state.detail_barang.all_kategori?.kategori) || [];
  const merkBarang =
    useSelector((state) => state.detail_barang.all_merk?.merk) || [];
  const [alertShow, setAlertShow] = useState(false);
  const [fileImage, setFileImage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { setLoading, loading } = useContext(LoadingContext);
  const [inputDataBarang, setInputDataBarang] = useState({
    name: "",
    desc: "",
    qty: "",
    tgl_beli: "",
    harga: "",
    kondisi: "",
    merk: "",
    kategori: "",
    lokasi_barang: "",
  });
  const [inputEditBarang, setInputEditBarang] = useState({
    name: "",
    desc: "",
  });

  const [inputQuery, setInputQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
  });
  const [newBarang, setNewBarang] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setInputDataBarang({
      name: "",
      desc: "",
      qty: "",
      tgl_beli: "",
      harga: 0,
      kondisi: "",
      merk: "",
      kategori: "",
      lokasi_barang: "",
    });
    setFileImage("");
  };
  const handleShow = () => setShow(true);

  // function

  const deleteDataBarang = async (id) => {
    try {
      const response = await axios.delete(`${url}/barang/del/${id}`);
      if (response.status === 200) {
        alert(response.data.msg);
        dispatch(getDataBarang(inputQuery));
        handleCloseHapus();
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      }
      console.error(error);
    }
  };

  const updateDataBarang = async (id) => {
    try {
      const response = await axios.patch(
        `${url}/barang/update/${id}`,
        inputEditBarang
      );
      if (response.status === 200) {
        alert(response.data.msg);
        dispatch(getDataBarang(inputQuery));
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

  // CARI INVENTARIS
  const handleSearchBarang = (e) => {
    e.preventDefault();
    setInputQuery({ ...inputQuery, page: 0, search: searchQuery });
  };

  // TAMBAH DATA BARANG BARU
  const setFileUpload = (e) => {
    try {
      const image = e.target.files[0];
      setFileImage(image);
    } catch (error) {
      console.error(error);
    }
  };

  const addBarang = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", inputDataBarang.name);
      formData.append("desc", inputDataBarang.desc);
      formData.append("qty", inputDataBarang.qty);
      formData.append("tgl_beli", inputDataBarang.tgl_beli);
      formData.append("harga", inputDataBarang.harga);
      formData.append("kondisi", inputDataBarang.kondisi);
      formData.append("lokasi_barang", inputDataBarang.lokasi_barang);
      formData.append("merk", inputDataBarang.merk);
      formData.append("kategori", inputDataBarang.kategori);
      formData.append("file", fileImage);

      const response = await axios.post(`${url}/barang/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 201) {
        // setInputQuery({ ...inputQuery, page: 0 });
        dispatch(getDataBarang(inputQuery));
        setInputDataBarang({
          name: "",
          desc: "",
          qty: "",
          tgl_beli: "",
          harga: 0,
          kondisi: "",
          merk: "",
          kategori: "",
        });
        setFileImage("");
        setLoading(false);
        handleClose();
        setAlertShow(true);
        setTimeout(() => {
          setAlertShow(false);
        }, 2000);
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

  // print laporan
  const printLaporan = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/print/barang`, {
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

  // PAGE CHANGE REACT PAGINATION
  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected });
  };

  // USEEFFECT
  useEffect(() => {
    dispatch(getDataBarang(inputQuery));
    dispatch(updatePenyusutanBarang());
    dispatch(getAllLokasi());
    dispatch(getAllKategori());
    dispatch(getAllMerk());
  }, [dispatch, inputQuery.limit, inputQuery.page, inputQuery.search]);

  useEffect(() => {
    if (barang.data) {
      setNewBarang(barang.data);
    }
  }, [barang.data]);

  // MAIN

  return (
    <div className="w-100 pe-3">
      {hapusBrgId && (
        <ModalEditComponent
          modalTitle="Konfirmasi"
          handleCloseEdit={handleCloseHapus}
          btnTitle="Hapus"
          submit={() => deleteDataBarang(hapusBrgId)}
          body={<p>Yakin ingin menghapus data barang?</p>}
        />
      )}
      {ubahBrgId && (
        <ModalEditComponent
          modalTitle="Ubah Data Barang"
          handleCloseEdit={handleCloseEdit}
          submit={() => updateDataBarang(ubahBrgId)}
          body={
            <>
              <p className="m-0 mb-2">Nama Barang</p>
              <InputComponents
                val={inputEditBarang.name || ""}
                type="text"
                classStyle="w-100 p-2"
                placeHolder="Nama Barang"
                change={(e) =>
                  setInputEditBarang({
                    ...inputEditBarang,
                    name: e.target.value,
                  })
                }
              />
              <p className="m-0 my-2">Keterangan</p>
              <InputComponents
                val={inputEditBarang.desc}
                type="text"
                classStyle="w-100 p-2"
                placeHolder="Keterangan barang"
                change={(e) =>
                  setInputEditBarang({
                    ...inputEditBarang,
                    desc: e.target.value,
                  })
                }
              />
            </>
          }
        />
      )}
      <AlertNotify
        alertMsg="Berhasil menambah data Barang."
        showAlert={alertShow}
        variantAlert="success"
      />
      <h4>DATA STOK INVENTARIS BARANG</h4>
      <div className="mt-2 d-flex">
        {user.data && user.data.role === "admin" && (
          <div className="mt-3">
            <ModalComponent
              btntTitle="Tambah Data Barang"
              show={show}
              handleClose={handleClose}
              handleShow={handleShow}
              handleSubmit={addBarang}
              modalTitle="Tambah Data Barang"
              inputField={
                <div className="d-flex">
                  <div className="w-50 me-1">
                    <p className="m-0">Unggah Gambar Aset</p>
                    <InputComponents
                      type="file"
                      classStyle="w-100 p-2"
                      change={setFileUpload}
                    />
                    <p className="m-0">Nama Barang</p>
                    <InputComponents
                      type="text"
                      classStyle="w-100 p-2"
                      placeHolder="Nama Barang"
                      change={(e) =>
                        setInputDataBarang({
                          ...inputDataBarang,
                          name: e.target.value,
                        })
                      }
                    />
                    <p className="m-0 mt-2">Keterangan</p>
                    <InputComponents
                      type="text"
                      classStyle="w-100 p-2"
                      placeHolder="Keterangan"
                      change={(e) =>
                        setInputDataBarang({
                          ...inputDataBarang,
                          desc: e.target.value,
                        })
                      }
                    />
                    <p className="m-0 mt-2">Jumlah</p>
                    <InputComponents
                      type="number"
                      classStyle="w-100 p-2"
                      placeHolder="Jumlah"
                      change={(e) =>
                        setInputDataBarang({
                          ...inputDataBarang,
                          qty: e.target.value,
                        })
                      }
                    />
                    <p className="m-0 mt-2">Tanggal Beli</p>
                    <InputComponents
                      type="date"
                      classStyle="w-100 p-2"
                      placeHolder="Tanggal Beli"
                      change={(e) =>
                        setInputDataBarang({
                          ...inputDataBarang,
                          tgl_beli: e.target.value,
                        })
                      }
                    />
                    <p className="m-0 mt-2">Harga Pembelian</p>
                    <InputComponents
                      type="number"
                      classStyle="w-100 p-2"
                      placeHolder="Harga Pembelian"
                      change={(e) =>
                        setInputDataBarang({
                          ...inputDataBarang,
                          harga: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="w-50 ms-1">
                    <p className="m-0 mt-2">Kondisi Barang</p>
                    <select
                      className="form-select"
                      onChange={(e) =>
                        setInputDataBarang({
                          ...inputDataBarang,
                          kondisi: e.target.value,
                        })
                      }
                    >
                      <option value="">--Pilih--</option>
                      {kondisiBarang.map((e, index) => (
                        <option key={index} value={e.jenis}>
                          {e.jenis}
                        </option>
                      ))}
                    </select>
                    <p className="m-0 mt-2">Merk</p>
                    <select
                      className="form-select m-0 mt-2"
                      onChange={(e) =>
                        setInputDataBarang({
                          ...inputDataBarang,
                          merk: e.target.value,
                        })
                      }
                    >
                      <option value="">--Pilih Merk--</option>;
                      {merkBarang.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                    <p className="m-0 mt-2">Kategori</p>
                    <select
                      className="form-select"
                      onChange={(e) =>
                        setInputDataBarang({
                          ...inputDataBarang,
                          kategori: e.target.value,
                        })
                      }
                    >
                      <option value="">--Pilih Kategori--</option>;
                      {kategoriBarang.map((item) => {
                        return (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                    <p className="m-0 mt-2">Lokasi Barang</p>
                    <select
                      className="form-select"
                      onChange={(e) =>
                        setInputDataBarang({
                          ...inputDataBarang,
                          lokasi_barang: e.target.value,
                        })
                      }
                    >
                      <option value="">--Pilih Lokasi--</option>;
                      {allLokasi &&
                        allLokasi.map((item) => {
                          return (
                            <option value={item.id} key={item.id}>
                              {item.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
              }
            />
          </div>
        )}
        <button className="btn btn-primary ms-1 mt-3" onClick={printLaporan}>
          Cetak Laporan
        </button>
      </div>
      <div className="card shadow-lg mb-4 mt-2 w-100">
        <div className="d-flex justify-content-between">
          <div className="w-100">
            <SearchBarComponent
              submit={handleSearchBarang}
              placeHolder="Cari data inventaris barang..."
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
          <div className="overflow-x-scroll">
            {barang.isLoading ? (
              <SpinnerLoading />
            ) : (
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>No</th>
                    <th>Nama</th>
                    <th>Keterangan</th>
                    <th>Jumlah</th>
                    <th>Tanggal Beli</th>
                    <th>Harga / unit</th>
                    <th>Merk</th>
                    <th>Kategori</th>
                    <th>Kondisi</th>
                    <th>Foto</th>
                    <th style={{ width: "18%" }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {newBarang.barang &&
                    newBarang.barang.map((e, index) => {
                      return (
                        <tr key={e.id}>
                          <td>
                            {index + 1 + inputQuery.page * inputQuery.limit}
                          </td>
                          <td>{e.name}</td>
                          <td>{e.desc}</td>
                          <td>{e.qty} pcs</td>
                          <td>{e.tgl_beli?.slice(0, 10)}</td>
                          <td>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(e.harga)}
                          </td>
                          <td>{(e.merk_brg && e.merk_brg.name) || "-"}</td>
                          <td>
                            {(e.kategori_brg && e.kategori_brg.name) || "-"}
                          </td>
                          <td>{e.kondisi}</td>
                          <td>
                            <img
                              src={e.url}
                              alt="gambar aset"
                              style={{ width: "100px" }}
                            />
                          </td>
                          <td>
                            {user.data.role === "admin" ? (
                              <>
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    setUbahBrgId(e.id);
                                    setInputEditBarang({
                                      name: e.name,
                                      desc: e.desc,
                                    });
                                  }}
                                >
                                  {<BsPencilSquare />}
                                </button>
                                <button
                                  className="btn btn-danger ms-1"
                                  onClick={() => setHapusBrgId(e.id)}
                                >
                                  {<BsTrash3 />}
                                </button>
                              </>
                            ) : (
                              <button className="btn btn-primary">Minta</button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
          {newBarang.barang && newBarang.barang.length === 0 && (
            <p>Data tidak ditemukan!</p>
          )}
          {newBarang && (
            <p className="text-end">
              Total row: <strong>{newBarang.count}</strong> page{" "}
              <strong>{newBarang.count ? newBarang.page + 1 : 0}</strong> of{" "}
              <strong>{newBarang.totalPage}</strong>
            </p>
          )}
          <nav key={newBarang && newBarang.count}>
            {newBarang && newBarang.totalPage > 0 && (
              <ReactPaginate
                previousLabel={"<<"}
                nextLabel={">>"}
                breakLabel={"..."}
                pageCount={newBarang ? newBarang.totalPage : 0}
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

export default Barang;
