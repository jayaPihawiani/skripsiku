import { useEffect, useState } from "react";
import {
  BsArrowLeftRight,
  BsBoxSeam,
  BsPercent,
  BsPersonBadgeFill,
  BsPersonLinesFill,
  BsTools,
  BsTrashFill,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardBeranda from "../components/CardBeranda";
import {
  getAllBarang,
  getAllBrgMasuk,
  getAllDistribusi,
  getAllPenghapusan,
  getAllPindah,
  getAllRusak,
} from "../features/barangSlice";
import {
  getAllKategori,
  getAllLokasi,
  getAllMerk,
  getAllSatuan,
} from "../features/detailBarang";
import { getAllPengajuan } from "../features/pengajuanSlice";
import { getAllUser } from "../features/UserSlice";

const Dashboard = () => {
  const state = useSelector((state) => state.auth);
  const barang = useSelector((state) => state.barang.all_barang?.data);
  const brgMasuk = useSelector((state) => state.barang.all_barang_masuk?.data);
  const brgPindah = useSelector((state) => state.barang.all_pemindahan?.data);
  const brgRusak = useSelector((state) => state.barang.all_barang_rusak?.data);
  const brgPenghapusan = useSelector(
    (state) => state.barang.all_penghapusan?.data
  );
  const detailState = useSelector((state) => state.detail_barang);
  const userState = useSelector((state) => state.user);
  const pengajuan = useSelector((state) => state.pengajuan.all_pengajuan?.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [brgDistribusi, setBrgDistribusi] = useState([]);
  const [merk, setMerk] = useState([]);
  const [satuan, setSatuan] = useState([]);
  const [lokasi, setLokasi] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [user, setUser] = useState([]);

  useEffect(() => {
    dispatch(getAllBarang());
    dispatch(getAllBrgMasuk());
    dispatch(getAllPindah());
    dispatch(getAllRusak());
    dispatch(getAllPenghapusan());
    dispatch(getAllMerk());
    dispatch(getAllSatuan());
    dispatch(getAllLokasi());
    dispatch(getAllKategori());
    dispatch(getAllUser(""));
    dispatch(getAllPengajuan());
    dispatch(getAllDistribusi());
  }, [dispatch]);

  useEffect(() => {
    if (detailState.all_merk && detailState.all_merk.isSuccess) {
      setMerk(detailState.all_merk.merk);
      setSatuan(detailState.all_satuan.satuan);
      setLokasi(detailState.all_lokasi.lokasi);
      setKategori(detailState.all_kategori.kategori);
    }
  }, [detailState.all_merk.merk, detailState.all_merk.isSuccess]);

  useEffect(() => {
    if (userState.all_user && userState.all_user.isSuccess) {
      setUser(userState.all_user.data);
    }
  }, [userState.all_user.data, userState.all_user.isSuccess]);

  return (
    <div className="me-4">
      <h4 className="mb-4">DASHBOARD</h4>
      <div className="row">
        <div className="col-lg-3 col-md-6 col-12">
          <CardBeranda
            toolTip="/barang"
            title="BARANG"
            classCard="bg-primary mb-2"
            qty={(barang && barang.length) || 0}
            icon={<BsBoxSeam className="text-light" size={40} />}
            action={() => navigate("/barang")}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          <CardBeranda
            title="BARANG MASUK"
            classCard="bg-primary mb-2"
            qty={(brgMasuk && brgMasuk.length) || 0}
            icon={<BsArrowLeftRight className="text-light" size={40} />}
            action={() => navigate("/masuk")}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          <CardBeranda
            title="PEMINDAHAN"
            classCard="bg-primary mb-2"
            qty={(brgPindah && brgPindah.length) || 0}
            icon={<BsArrowLeftRight className="text-light" size={40} />}
            action={() => navigate("/pindah")}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          <CardBeranda
            title="KERUSAKAN"
            classCard="bg-primary mb-2"
            qty={(brgRusak && brgRusak.length) || 0}
            icon={<BsTools className="text-light" size={40} />}
            action={() => navigate("/kerusakan")}
          />
        </div>
        {state.data && state.data.role === "admin" && (
          <>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                title="PENGHAPUSAN"
                classCard="bg-primary mb-2"
                qty={(brgPenghapusan && brgPenghapusan.length) || 0}
                icon={<BsTrashFill className="text-light" size={40} />}
                action={() => navigate("/penghapusan")}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                title="MERK BARANG"
                classCard="bg-primary mb-2"
                qty={(merk && merk.length) || 0}
                icon={<BsBoxSeam className="text-light" size={40} />}
                action={() => navigate("/merk")}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                title="SATUAN BARANG"
                classCard="bg-primary mb-2"
                qty={(satuan && satuan.length) || 0}
                icon={<BsBoxSeam className="text-light" size={40} />}
                action={() => navigate("/satuan")}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                title="LOKASI BARANG"
                classCard="bg-primary mb-2"
                qty={(lokasi && lokasi.length) || 0}
                icon={<BsBoxSeam className="text-light" size={40} />}
                action={() => navigate("/lokasi")}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                title="KATEGORI BARANG"
                classCard="bg-primary mb-2"
                qty={(kategori && kategori.length) || 0}
                icon={<BsBoxSeam className="text-light" size={40} />}
                action={() => navigate("/kategori")}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                title="USER"
                classCard="bg-primary mb-2"
                qty={(user && user.length) || 0}
                icon={<BsPersonLinesFill className="text-light" size={40} />}
                action={() => navigate("/user")}
              />
            </div>
            <div className="col-lg-3 col-md-6 col-12">
              <CardBeranda
                title="MASA EKONOMIS"
                classCard="bg-primary mb-2"
                qty={0}
                icon={<BsPercent className="text-light" size={40} />}
                action={() => navigate("/ekonomis")}
              />
            </div>
          </>
        )}
        <div className="col-lg-3 col-md-6 col-12">
          <CardBeranda
            title="PENGAJUAN USER"
            classCard="bg-primary mb-2"
            qty={(pengajuan && pengajuan.length) || 0}
            icon={<BsPersonBadgeFill className="text-light" size={40} />}
            action={() => navigate("/pengajuan")}
          />
        </div>
        <div className="col-lg-3 col-md-6 col-12">
          <CardBeranda
            title="DISTRIBUSI BARANG"
            classCard="bg-primary mb-2"
            qty={(brgDistribusi && brgDistribusi.length) || 0}
            icon={<BsPersonBadgeFill className="text-light" size={40} />}
            action={() => navigate("/distribusi")}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
