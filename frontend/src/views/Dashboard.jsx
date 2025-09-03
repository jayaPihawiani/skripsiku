import { useEffect } from "react";
import { BsBoxSeam } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import CardBeranda from "../components/CardBeranda";
import {
  getBarangUnit,
  getBrgRusak,
  getDataBarang,
  getDataPemindahan,
  getDataPenghapusan,
} from "../features/barangSlice";
import {
  getDataLokasi,
  getKategoriBarang,
  getMerkBarang,
} from "../features/detailBarang";
import { useNavigate } from "react-router-dom";
import { getKategoriKerusakan } from "../features/kategoriRusak";
import { getDataUser } from "../features/UserSlice";
import { getPengajuan } from "../features/pengajuanSlice";
import { getPermintaan } from "../features/permintaanSlice";

const Dashboard = () => {
  // variabel
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputQuery = {
    page: 0,
    limit: 10,
    search: "",
    lokasi: "",
    kategori: "",
    status_perbaikan: "",
  };

  const user = useSelector((state) => state.auth?.data) || {};
  const barang = useSelector((state) => state.barang);
  const detailBrg = useSelector((state) => state.detail_barang);
  const dataUser = useSelector((state) => state.user.user);
  const pengajuan = useSelector((state) => state.pengajuan.pengajuan);
  const permintaan = useSelector((state) => state.permintaan.permintaan);
  const kategoriRusak = useSelector(
    (state) => state.kategori_rusak.kategori_kerusakan
  );

  // useEffect
  useEffect(() => {
    dispatch(getDataBarang(inputQuery));
    dispatch(getBarangUnit(inputQuery));
    dispatch(getMerkBarang(inputQuery));
    dispatch(getDataLokasi(inputQuery));
    dispatch(getKategoriBarang(inputQuery));
    dispatch(getDataPemindahan(inputQuery));
    dispatch(getBrgRusak(inputQuery));
    dispatch(getKategoriKerusakan(inputQuery));
    dispatch(getDataPenghapusan(inputQuery));
    dispatch(getDataUser(inputQuery));
    dispatch(getPengajuan(inputQuery));
    dispatch(getPermintaan(inputQuery));
  }, [dispatch]);

  return (
    <div className="me-4">
      <h4 className="mb-4">DASHBOARD</h4>
      {/* <p className="">
        Selamat datang <strong>{user.username}</strong> di dashboard Aplikasi
        Pengelolaan Inventaris Barang PT. Air Minum Intan Banjar
      </p> */}
      <div className="row">
        {user.role === "admin" && (
          <>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                toolTip="/merk"
                title="DATA MERK"
                classCard="bg-primary mb-2"
                qty={detailBrg.merk.merk?.count || 0}
                icon={<BsBoxSeam className="text-light" size={40} />}
                action={() => navigate("/merk")}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                toolTip="/kategori"
                title="DATA KATEGORI"
                classCard="bg-primary mb-2"
                qty={detailBrg.kategori.kategori?.count || 0}
                icon={<BsBoxSeam className="text-light" size={40} />}
                action={() => navigate("/kategori")}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                toolTip="/lokasi"
                title="DATA LOKASI"
                classCard="bg-primary mb-2"
                qty={detailBrg.lokasi.lokasi?.count || 0}
                icon={<BsBoxSeam className="text-light" size={40} />}
                action={() => navigate("/lokasi")}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                toolTip="/kategori_kerusakan"
                title="KATEGORI KERUSAKAN"
                classCard="bg-primary mb-2"
                qty={kategoriRusak.data?.count || 0}
                icon={<BsBoxSeam className="text-light" size={40} />}
                action={() => navigate("/k/kerusakan")}
              />
            </div>
          </>
        )}
        <div className="col-lg-3 col-md-6 col-12">
          <CardBeranda
            toolTip="/barang"
            title="BARANG"
            classCard="bg-primary mb-2  "
            qty={barang.barang.data?.count || 0}
            icon={<BsBoxSeam className="text-light" size={40} />}
            action={() => navigate("/barang")}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          <CardBeranda
            toolTip="/unit-barang"
            title="UNIT BARANG"
            classCard="bg-primary mb-2"
            qty={barang.barang_unit.data?.count || 0}
            icon={<BsBoxSeam className="text-light" size={40} />}
            action={() => navigate("/unit_barang")}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          <CardBeranda
            toolTip="/penempatan"
            title="PENEMPATAN"
            classCard="bg-primary mb-2"
            qty={barang.pemindahan.data?.count || 0}
            icon={<BsBoxSeam className="text-light" size={40} />}
            action={() => navigate("/penempatan")}
          />
        </div>
        {user.role === "admin" && (
          <>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                toolTip="/kerusakan"
                title="KERUSAKAN"
                classCard="bg-primary mb-2"
                qty={barang.barang_rusak.data?.count || 0}
                icon={<BsBoxSeam className="text-light" size={40} />}
                action={() => navigate("/kerusakan")}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                toolTip="/penghapusan"
                title="PENGHAPUSAN"
                classCard="bg-primary mb-2"
                qty={barang.penghapusan.data?.count || 0}
                icon={<BsBoxSeam className="text-light" size={40} />}
                action={() => navigate("/penghapusan")}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                toolTip="/usia_pakai"
                title="DATA USIA PAKAI"
                classCard="bg-primary mb-2"
                qty={barang.barang_unit.data?.count || 0}
                icon={<BsBoxSeam className="text-light" size={40} />}
                action={() => navigate("/usia_pakai")}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                toolTip="/user"
                title="DATA USER"
                classCard="bg-primary mb-2"
                qty={dataUser.data?.count || 0}
                icon={<BsBoxSeam className="text-light" size={40} />}
                action={() => navigate("/user")}
              />
            </div>
          </>
        )}
        <div className="col-lg-3 col-md-6 col-12">
          <CardBeranda
            toolTip="/pengajuan"
            title="PENGAJUAN"
            classCard="bg-primary mb-2"
            qty={pengajuan.data?.count || 0}
            icon={<BsBoxSeam className="text-light" size={40} />}
            action={() => navigate("/pengajuan")}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          <CardBeranda
            toolTip="/permintaan"
            title="PERMINTAAN"
            classCard="bg-primary mb-2"
            qty={permintaan.data?.count || 0}
            icon={<BsBoxSeam className="text-light" size={40} />}
            action={() => navigate("/permintaan")}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
