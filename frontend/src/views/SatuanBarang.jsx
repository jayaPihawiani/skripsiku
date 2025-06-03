// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import InputComponents from "../components/InputComponents";
// import ModalComponent from "../components/ModalComponent";
// import { authStateReset, userInfo } from "../features/authSlice";
// import { getSatuanBarang } from "../features/detailBarang";

// const SatuanBarang = () => {
//   const url = import.meta.env.VITE_API_URL;
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const state = useSelector((state) => state.auth);
//   const detailBarang = useSelector((state) => state.detail_barang);
//   const [satuanBarang, setSatuanBarang] = useState([]);
//   const [show, setShow] = useState(false);
//   const [showEdit, setShowEdit] = useState(false);
//   const [inputSatuan, setInputSatuan] = useState({ name: "", desc: "" });

//   const handleClose = () => {
//     setShow(false);
//     setInputSatuan({ name: "", desc: "" });
//   };
//   const handleShow = () => setShow(true);

//   const handleCloseEdit = () => {
//     setShowEdit(false);
//     setInputSatuan({ name: "", desc: "" });
//   };

//   const handleShowEdit = (dataEdit) => {
//     setInputSatuan(dataEdit);
//     setShowEdit(true);
//   };

//   // function
//   // USE effect
//   useEffect(() => {
//     dispatch(userInfo());
//     dispatch(getSatuanBarang());
//   }, [dispatch]);

//   useEffect(() => {
//     if (detailBarang.isSuccess || detailBarang.satuan) {
//       setSatuanBarang(detailBarang.satuan);
//     }
//   }, [detailBarang.satuan, detailBarang.isSuccess]);

//   useEffect(() => {
//     if (!state.data && state.isError) {
//       navigate("/login");
//       dispatch(authStateReset());
//     }
//   }, [state, navigate, dispatch]);
//   // USE effect

//   const createSatuanBarang = async () => {
//     if (!inputSatuan.name || !inputSatuan.desc) {
//       alert("Data ada yang kosong! Harap isi semua data!");
//       return;
//     }
//     try {
//       const response = await axios.post(`${url}/satuan/create`, inputSatuan);
//       if (response.status === 201) {
//         dispatch(getSatuanBarang());
//         handleClose();
//         alert("Berhasil menambah data satuan.");
//       }
//     } catch (error) {
//       console.error(error);
//       if (error.response && error.response.data) {
//         alert(error.response.data.msg);
//       } else {
//         alert("Terjadi kesalahan. Silakan coba lagi nanti.");
//       }
//     }
//   };

//   const deleteDataSatuan = async (id) => {
//     try {
//       const response = await axios.delete(`${url}/satuan/del/${id}`);
//       if (response.status === 200) {
//         dispatch(getSatuanBarang());
//         alert("Berhasil menghapus data.");
//       }
//     } catch (error) {
//       console.error(error.response.data.msg);
//     }
//   };

//   const handleEdit = async (id) => {
//     if (!inputSatuan.name || !inputSatuan.desc) {
//       alert("Data ada yang kosong! Harap isi semua data!");
//       return;
//     }
//     try {
//       const response = await axios.patch(
//         `${url}/satuan/update/${id}`,
//         inputSatuan
//       );
//       if (response.status === 200) {
//         dispatch(getSatuanBarang());
//         handleCloseEdit();
//       }
//     } catch (error) {
//       if (error.response) {
//         console.error(error.response.data.msg);
//         alert(error.response.data.msg);
//       }
//       console.log("Gagal mengubah data!");
//     }
//   };
//   return (
//     <>
//       <h3>DATA SATUAN BARANG</h3>
//       <ModalComponent
//         btntTitle="Tambah"
//         modalTitle="Tambah Data Satuan"
//         show={show}
//         handleClose={handleClose}
//         handleShow={handleShow}
//         handleSubmit={createSatuanBarang}
//         inputField={
//           <>
//             <InputComponents
//               classStyle="w-100 p-2"
//               placeHolder="Nama"
//               change={(e) =>
//                 setInputSatuan({ ...inputSatuan, name: e.target.value })
//               }
//               val={inputSatuan.name}
//             />
//             <InputComponents
//               classStyle="w-100 p-2 mt-2"
//               placeHolder="Keterangan"
//               change={(e) =>
//                 setInputSatuan({ ...inputSatuan, desc: e.target.value })
//               }
//               val={inputSatuan.desc}
//             />
//           </>
//         }
//       />
//       <div className="card me-4 mt-2 shadow-lg">
//         <div className="card-body">
//           <table className="table table-bordered table-striped">
//             <thead className="table-dark">
//               <tr>
//                 <td style={{ width: "5%" }}>No. </td>
//                 <td>Nama</td>
//                 <td>Keterangan</td>
//                 <td style={{ width: "15%" }}>Aksi</td>
//               </tr>
//             </thead>
//             <tbody>
//               {satuanBarang &&
//                 satuanBarang.map((item, index) => {
//                   return (
//                     <tr key={item.id}>
//                       <td>{index + 1}</td>
//                       <td>{item.name}</td>
//                       <td>{item.desc}</td>
//                       <td className="text-center">
//                         <ModalComponent
//                           modalTitle="Ubah Data Merk"
//                           btntTitle="Ubah"
//                           show={showEdit}
//                           handleShow={() =>
//                             handleShowEdit({ name: item.name, desc: item.desc })
//                           }
//                           handleClose={handleCloseEdit}
//                           handleSubmit={() => handleEdit(item.id)}
//                           inputField={
//                             <>
//                               <InputComponents
//                                 classStyle="w-100 p-2"
//                                 placeHolder="Nama"
//                                 change={(e) =>
//                                   setSatuanBarang({
//                                     ...dataMerk,
//                                     name: e.target.value,
//                                   })
//                                 }
//                                 val={inputSatuan.name}
//                               />
//                               <InputComponents
//                                 classStyle="w-100 p-2 mt-2"
//                                 placeHolder="Keterangan"
//                                 change={(e) =>
//                                   setSatuanBarang({
//                                     ...dataMerk,
//                                     desc: e.target.value,
//                                   })
//                                 }
//                                 val={inputSatuan.desc}
//                               />
//                             </>
//                           }
//                         />
//                         <button
//                           className="btn btn-danger ms-1"
//                           onClick={() => deleteDataSatuan(item.id)}
//                         >
//                           Hapus
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SatuanBarang;

import React from "react";

const SatuanBarang = () => {
  return <div>asas</div>;
};

export default SatuanBarang;
