import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AlertNotify from "../../components/Alert";
import InputComponents from "../../components/InputComponents";
import ModalComponent from "../../components/ModalComponent";
import SearchBarComponent from "../../components/SearchBarComponent";
import { LoadingContext } from "../../context/Loading";
import { getAllBarang, getDataPenghapusan } from "../../features/barangSlice";

const PenghapusanPage = () => {
  // variabel
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dataBarang =
    useSelector((state) => state.barang.all_barang?.data) || [];
  const penghapusanState = useSelector((state) => state.barang.penghapusan);
  const [dataPenghapusan, setDataPenghapusan] = useState([]);
  const [file, setFile] = useState("");
  const [show, setShow] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [inputPenghapusan, setInputPenghapusan] = useState({
    desc: "",
    qty: 0,
    tgl_hapus: "",
    barangId: "",
  });
  const [inputQuery, setInputQuery] = useState({
    page: 0,
    limit: 10,
    search: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const { setLoading } = useContext(LoadingContext);
  const handleClose = () => {
    setShow(false);
    setInputPenghapusan({ desc: "", qty: 0, tgl_hapus: "", barangId: "" });
    setFile("");
  };
  const handleShow = () => setShow(true);

  // FUNCTION
  const deleteDataPenghapusan = async (id) => {
    try {
      const response = await axios.delete(`${url}/penghapusan/del/${id}`);
      if (response.status === 200) {
        alert("Berhasil menghapus data kerusakan.");
        dispatch(getDataPenghapusan(inputQuery));
        setInputQuery({ ...inputQuery, page: 0 });
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
      formData.append("qty", inputPenghapusan.qty);
      formData.append("tgl_hapus", inputPenghapusan.tgl_hapus);
      formData.append("barangId", inputPenghapusan.barangId);
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
    dispatch(getAllBarang());
  }, [dispatch, inputQuery.page, inputQuery.limit, inputQuery.search]);

  useEffect(() => {
    if (penghapusanState.data && penghapusanState.isSuccess) {
      setDataPenghapusan(penghapusanState.data);
    }
  }, [penghapusanState.data, penghapusanState.isSuccess]);

  // MAIN
  return (
    <>
      <AlertNotify
        alertMsg={"Berhasil menambah data penghapusan"}
        showAlert={alertShow}
        variantAlert={"success"}
      />
      <h4>DATA PENGHAPUSAN INVENTARIS BARANG</h4>
      <ModalComponent
        handleSubmit={addDataPenghapusan}
        classStyle="mt-3"
        btntTitle="Tambah Data"
        show={show}
        handleShow={handleShow}
        handleClose={handleClose}
        modalTitle="Tambah Data Penghapusan Inventaris"
        inputField={
          <>
            <p className="m-0">Nama Inventaris Barang</p>
            <select
              className="form-select"
              onChange={(e) =>
                setInputPenghapusan({
                  ...inputPenghapusan,
                  barangId: e.target.value,
                })
              }
            >
              <option value="">Pilih</option>
              {dataBarang &&
                dataBarang.map((item) => {
                  return (
                    <option value={item.id} key={item.id}>
                      {item.name} - qty: {item.qty}
                    </option>
                  );
                })}
            </select>
            <p className="m-0">Keterangan</p>
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
            <p className="m-0">Jumlah Penghapusan</p>
            <InputComponents
              type="number"
              placeHolder="Jumlah"
              classStyle="w-100 p-2"
              change={(e) =>
                setInputPenghapusan({
                  ...inputPenghapusan,
                  qty: e.target.value,
                })
              }
            />
            <p className="m-0">Tanggal Penghapusan</p>
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
            <p className="m-0">Unggah file</p>
            <InputComponents
              type="file"
              placeHolder="Jumlah"
              classStyle="w-100 p-2"
              change={setFileUpload}
            />
          </>
        }
      />

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
                  <td>Nama Inventaris Barang</td>
                  <td>Jumlah Penghapusan</td>
                  <td>Sisa Inventaris Barang</td>
                  <td>Tanggal Hapus</td>
                  <td>Keterangan</td>
                  <td style={{ width: "15%" }}>Aksi</td>
                </tr>
              </thead>
              <tbody>
                {dataPenghapusan.penghapusan &&
                  dataPenghapusan.penghapusan.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td>
                          {index + 1 + inputQuery.page * inputQuery.limit}
                        </td>
                        <td>{item.barang.name}</td>
                        <td>{item.qty}</td>
                        <td>{item.sisa_stok ?? "-"}</td>
                        <td>{item.tgl_hapus?.slice(0, 10)}</td>
                        <td>{item.desc}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-primary"
                            onClick={() => navigate(`edit/${item.id}`)}
                          >
                            Ubah
                          </button>
                          <button
                            className="btn btn-danger ms-1"
                            onClick={() => deleteDataPenghapusan(item.id)}
                          >
                            Hapus
                          </button>
                          <button
                            className="btn btn-primary ms-1"
                            onClick={() => window.open(item.url, "_blank")}
                            disabled={!item.url}
                          >
                            Unduh
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {dataPenghapusan.penghapusan &&
              dataPenghapusan.penghapusan.length === 0 &&
              "Data tidak ditemukan!"}
            {dataPenghapusan.penghapusan && (
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
                  pageCount={
                    dataPenghapusan.penghapusan ? dataPenghapusan.totalPage : 0
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

export default PenghapusanPage;
