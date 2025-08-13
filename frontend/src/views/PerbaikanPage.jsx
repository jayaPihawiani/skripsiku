import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRusakDiperbaiki } from "../features/barangSlice";

const PerbaikanPage = () => {
  const dispatch = useDispatch();

  const brgRusak =
    useSelector((state) => state.barang.barang_rusak_diperbaiki?.data) || [];

  useEffect(() => {
    dispatch(getRusakDiperbaiki());
  }, []);

  return (
    <>
      <h4>DATA PERBAIKAN INVENTARIS</h4>
      <div className="card me-3 mt-4">
        <div className="card-body">
          <div className="overflow-auto">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>No</th>
                  <th>Nama Inventaris</th>
                  <th>Penyebab Kerusakan</th>
                  <th>Rincian Kerusakan</th>
                </tr>
              </thead>
              <tbody>
                {brgRusak.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.barang?.name}</td>
                    <td>{item.sebab_kerusakan}</td>
                    <td>{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerbaikanPage;
