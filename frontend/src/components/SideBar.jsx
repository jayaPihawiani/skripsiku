import React from "react";
import {
  BsArrowsMove,
  BsCalendarXFill,
  BsCaretDownFill,
  BsDoorOpenFill,
  BsEnvelopePaperFill,
  BsFileEarmarkPersonFill,
  BsGeoAltFill,
  BsGrid1X2Fill,
  BsInboxesFill,
  BsTagsFill,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../css/sidebar.css";
import { logoutUser, authStateReset } from "../features/authSlice";

const SideBar = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    if (state.isLogout) {
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      dispatch(authStateReset());
    }
  };

  return (
    <React.Fragment>
      <div className="sidebar">
        <nav className="nav flex-column">
          <React.Fragment>
            {/* dashboard */}
            <Link to="/dashboard" className="nav-link">
              <span className="icons">
                <BsGrid1X2Fill />
              </span>
              <span className="side-desc">Beranda</span>
            </Link>
            {/* dropdown menu */}
            <Link
              className="nav-link"
              data-bs-toggle="collapse"
              data-bs-target="#submenu"
              aria-expanded="true"
              aria-controls="submenu"
            >
              <span className="icon-down">
                <BsCaretDownFill />
              </span>
              <span className="side-desc">Master Barang</span>
            </Link>
            {/* dropdown menu */}
            {/* menu */}
            <div className="collapse side-bar-style" id="submenu">
              <Link to="/barang" className="nav-link">
                <span className="icons">
                  <BsInboxesFill />
                </span>
                <span className="side-desc">Data Barang</span>
              </Link>

              <Link to="/merk" className="nav-link">
                <span className="icons">
                  <BsCalendarXFill />
                </span>
                <span className="side-desc">Data Merk</span>
              </Link>

              <Link to="/satuan" className="nav-link">
                <span className="icons">
                  <BsArrowsMove />
                </span>
                <span className="side-desc">Data Satuan</span>
              </Link>
              {/* kategori */}
              <Link to="/kategori" className="nav-link">
                <span className="icons">
                  <BsArrowsMove />
                </span>
                <span className="side-desc">Data Kategori</span>
              </Link>
            </div>
            {/* menu */}
            {/* permintaan */}
            <Link to="/permintaan" className="nav-link">
              <span className="icons">
                <BsEnvelopePaperFill />
              </span>
              <span className="side-desc">Masa Ekonomis </span>
            </Link>
            {/* dropdown menu */}
            <Link
              className="nav-link"
              data-bs-toggle="collapse"
              data-bs-target="#menu-transaksi"
              aria-expanded="true"
              aria-controls="menu-transaksi"
            >
              <span className="icon-down">
                <BsCaretDownFill />
              </span>
              <span className="side-desc">Transaksi</span>
            </Link>
            {/* dropdown menu */}
            {/* menu */}
            <div className="collapse side-bar-style" id="menu-transaksi">
              <Link to="/stock" className="nav-link">
                <span className="icons">
                  <BsInboxesFill />
                </span>
                <span className="side-desc">Barang Masuk</span>
              </Link>

              <Link to="/penghapusan" className="nav-link">
                <span className="icons">
                  <BsCalendarXFill />
                </span>
                <span className="side-desc">Barang Keluar</span>
              </Link>

              <Link to="/pindah" className="nav-link">
                <span className="icons">
                  <BsArrowsMove />
                </span>
                <span className="side-desc">Kerusakan</span>
              </Link>
              <Link to="/pindah" className="nav-link">
                <span className="icons">
                  <BsArrowsMove />
                </span>
                <span className="side-desc">Penghapusan</span>
              </Link>
            </div>
            {/* menu */}
            {/* kategori */}
            <Link to="/kategory" className="nav-link">
              <span className="icons">
                <BsTagsFill />
              </span>
              <span className="side-desc">Distribusi Barang</span>
            </Link>
            {/* lokasi */}
            <Link to="/lokasi" className="nav-link">
              <span className="icons">
                <BsGeoAltFill />
              </span>
              <span className="side-desc">Permintaan</span>
            </Link>
            {/* user */}
            <Link to="/user" className="nav-link">
              <span className="icons">
                <BsFileEarmarkPersonFill />
              </span>
              <span className="side-desc">User</span>
            </Link>
            {/* lokasi */}
            <Link to="/user" className="nav-link">
              <span className="icons">
                <BsFileEarmarkPersonFill />
              </span>
              <span className="side-desc">Lokasi</span>
            </Link>
            {/* logout */}
            <button to="/user" className="nav-link" onClick={handleLogout}>
              <span className="icons">
                <BsDoorOpenFill />
              </span>
              <span className="side-desc">Log out</span>
            </button>
          </React.Fragment>
        </nav>
      </div>
      <section className="body-page">{children}</section>
    </React.Fragment>
  );
};

// const SideLink = ({ linkTo, icon, classname }) => {
//   return (
//     <Link to={linkTo} className={classname}>
//       <span className="icons">{icon}</span>
//       <span className="side-desc">Dashboard</span>
//     </Link>
//   );
// };

export default SideBar;
