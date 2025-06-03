import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authStateReset, userInfo } from "../features/authSlice";
import { getDataBarang } from "../features/barangSlice";

const Barang = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.auth);
  const barang = useSelector((state) => state.barang);
  const [newBarang, setNewBarang] = useState([]);
  // function
  useEffect(() => {
    dispatch(userInfo());
    dispatch(getDataBarang());
  }, [dispatch]);

  useEffect(() => {
    if (barang.data) {
      setNewBarang(barang.data);
    }
  }, [barang.data]);

  useEffect(() => {
    if (!state.data && state.isError) {
      navigate("/login");
      dispatch(authStateReset());
    }
  }, [state, navigate, dispatch]);

  return (
    <div className="w-100 pe-3">
      <div className="card shadow-lg">
        <div className="card-body">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Jumlah</th>
                <th>Harga</th>
                <th>Kondisi</th>
                <th>Riwayat Pemeliharaan</th>
                <th>Image</th>
                <th>Merk</th>
              </tr>
            </thead>
            <tbody>
              {newBarang &&
                newBarang.map((e, index) => {
                  return (
                    <tr key={e.id}>
                      <td>{index + 1}</td>
                      <td>{e.name}</td>
                      <td>{e.qty}</td>
                      <td>{e.harga}</td>
                      <td>{e.kondisi}</td>
                      <td>{e.riwayat_pemeliharaan}</td>
                      <td>
                        <img
                          src={e.url}
                          alt="gambar aset"
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td>
                        {e.merk_brg && e.merk_brg.name ? e.merk_brg.name : "-"}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Barang;
