import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import InputComponents from "../components/InputComponents";
import ModalComponent from "../components/ModalComponent";
import { getDataBarang } from "../features/barangSlice";

const Barang = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const barang = useSelector((state) => state.barang);
  const user = useSelector((state) => state.auth);
  const [satuanBarang, setSatuanBarang] = useState([]);
  const [kategoriBarang, setKategoriBarang] = useState([]);
  const [merkBarang, setMerkBarang] = useState([]);
  const [inputDataBarang, setInputDataBarang] = useState({
    name: "",
    desc: "",
    qty: "",
    tgl_beli: "",
    harga: 0,
    kondisi: "",
    riwayat_pemeliharaan: "",
    satuan: "",
    merk: "",
    kategori: "",
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
  };
  const handleShow = () => setShow(true);

  // function

  const getDetailBarang = async () => {
    try {
      const satuanResponse = await axios.get(`${url}/satuan/all`);
      const merkResponse = await axios.get(`${url}/merk/all`);
      const kategoriResponse = await axios.get(`${url}/kategori/all`);
      if (
        satuanResponse.status === 200 ||
        merkResponse.status === 200 ||
        kategoriResponse.status === 200
      ) {
        setSatuanBarang(satuanResponse.data);
        setKategoriBarang(kategoriResponse.data);
        setMerkBarang(merkResponse.data);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      }
      console.error(error);
    }
  };

  const addBarang = (e) => {
    console.log(inputDataBarang);
  };

  // PAGE CHANGE REACT PAGINATION
  const handlePageClick = ({ selected }) => {
    setInputQuery({ ...inputQuery, page: selected });
  };

  useEffect(() => {
    dispatch(getDataBarang(inputQuery));
    if (user.data.role === "admin") {
      getDetailBarang();
    }
  }, [dispatch, inputQuery]);

  useEffect(() => {
    if (barang.data) {
      setNewBarang(barang.data);
    }
  }, [barang.data]);

  return (
    <div className="w-100 pe-3">
      <h3>DATA STOK BARANG</h3>
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
                  <InputComponents type="file" classStyle="w-100 p-2" />
                  <p className="m-0">Nama Barang</p>
                  <InputComponents
                    type="text"
                    classStyle="w-100 p-2"
                    placeHolder="Nama Barang"
                  />
                  <p className="m-0 mt-2">Keterangan</p>
                  <InputComponents
                    type="text"
                    classStyle="w-100 p-2"
                    placeHolder="Keterangan"
                  />
                  <p className="m-0 mt-2">Jumlah</p>
                  <InputComponents
                    type="number"
                    classStyle="w-100 p-2"
                    placeHolder="Jumlah"
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
                  />
                </div>
                <div className="w-50 ms-1">
                  <p className="m-0 mt-2">Kondisi Barang</p>
                  <InputComponents
                    type="text"
                    classStyle="w-100 p-2"
                    placeHolder="Kondisi Barang"
                  />
                  <p className="m-0 mt-2">Riwayat Pemeliharaan</p>
                  <InputComponents
                    type="text"
                    classStyle="w-100 p-2"
                    placeHolder="Riwayat Pemeliharaan"
                  />
                  <p className="m-0 mt-2">Merk</p>
                  <select className="form-select">
                    <option value="">Pilih Merk</option>;
                    {merkBarang.map((item) => {
                      return (
                        <option value={item.name} key={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                  <p className="m-0 mt-2">Kategori</p>
                  <select className="form-select">
                    <option value="">Pilih Kategori</option>;
                    {kategoriBarang.map((item) => {
                      return (
                        <option value={item.name} key={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                  <p className="m-0 mt-2">Satuan</p>
                  <select
                    className="form-select"
                    onChange={(e) => console.log(e.target.value)}
                  >
                    <option value="">Pilih Satuan</option>;
                    {satuanBarang.map((item) => {
                      return (
                        <option value={item.name} key={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            }
          />
          <button className="btn btn-primary ms-1">Cetak Laporan</button>
        </div>
      )}
      <div className="card shadow-lg mb-4 mt-4">
        <div className="mt-3 me-3 d-flex">
          <select
            className="py-2 px-1 ms-auto"
            onChange={(e) =>
              setInputQuery({ page: 0, limit: e.target.value, search: "" })
            }
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="card-body">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Keterangan</th>
                <th>Jumlah</th>
                <th>Tanggal Pembelian</th>
                <th>Harga</th>
                <th>Merk</th>
                <th>Kategori</th>
                <th>Kondisi</th>
                <th>Riwayat Pemeliharaan</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {newBarang.barang &&
                newBarang.barang.map((e, index) => {
                  return (
                    <tr key={e.id}>
                      <td>{index + 1}</td>
                      <td>{e.name}</td>
                      <td>{e.desc}</td>
                      <td>{e.qty}</td>
                      <td>{e.tgl_beli}</td>
                      <td>{e.harga}</td>
                      <td>{e.merk_brg ? e.merk_brg : "-"}</td>
                      <td>{e.kategori_brg ? e.kategori_brg : "-"}</td>
                      <td>{e.kondisi}</td>
                      <td>{e.riwayat_pemeliharaan}</td>
                      <td>
                        <img
                          src={e.url}
                          alt="gambar aset"
                          style={{ width: "100px" }}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
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
