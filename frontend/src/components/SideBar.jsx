import React from "react";
import {
  BsArrowsFullscreen,
  BsBoxArrowInDown,
  BsBoxArrowUp,
  BsBoxSeamFill,
  BsBuildingFill,
  BsCaretDownFill,
  BsClipboardCheckFill,
  BsExclamationTriangleFill,
  BsGraphUpArrow,
  BsGrid1X2Fill,
  BsGridFill,
  BsMapFill,
  BsPersonBadgeFill,
  BsTagsFill,
  BsTrash3Fill,
  BsTruck,
} from "react-icons/bs";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../css/sidebar.css";

const SideBar = ({ children }) => {
  const state = useSelector((state) => state.auth);

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
            {state.data && state.data.role === "user" && (
              <Link to="/barang" className="nav-link">
                <span className="icons">
                  <BsBoxSeamFill />
                </span>
                <span className="side-desc">Data Barang</span>
              </Link>
            )}
            {/* dropdown menu */}
            {state.data && state.data.role === "admin" && (
              <Link
                className="nav-link d-flex justify-content-between"
                data-bs-toggle="collapse"
                data-bs-target="#submenu"
                aria-expanded="true"
                aria-controls="submenu"
              >
                <span className="side-desc">MASTER BARANG</span>
                <span className="icon-down">
                  <BsCaretDownFill />
                </span>
              </Link>
            )}
            {/* dropdown menu */}
            {/* menu */}
            <div className="collapse side-bar-style" id="submenu">
              <Link to="/barang" className="nav-link">
                <span className="icons">
                  <BsBoxSeamFill />
                </span>
                <span className="side-desc">Data Barang</span>
              </Link>

              <Link to="/merk" className="nav-link">
                <span className="icons">
                  <BsTagsFill />
                </span>
                <span className="side-desc">Data Merk</span>
              </Link>

              <Link to="/satuan" className="nav-link">
                <span className="icons">
                  <BsArrowsFullscreen />
                </span>
                <span className="side-desc">Data Satuan</span>
              </Link>
              {/* kategori */}
              <Link to="/kategori" className="nav-link">
                <span className="icons">
                  <BsGridFill />
                </span>
                <span className="side-desc">Data Kategori</span>
              </Link>
            </div>
            {/* menu */}
            {/* dropdown menu */}
            <Link
              className="nav-link d-flex justify-content-between"
              data-bs-toggle="collapse"
              data-bs-target="#menu-transaksi"
              aria-expanded="true"
              aria-controls="menu-transaksi"
            >
              <span className="side-desc">TRANSAKSI</span>
              <span className="icon-down">
                <BsCaretDownFill />
              </span>
            </Link>

            {/* dropdown menu */}
            {/* menu */}
            <div className="collapse side-bar-style" id="menu-transaksi">
              <Link to="/masuk" className="nav-link">
                <span className="icons">
                  <BsBoxArrowInDown />
                </span>
                <span className="side-desc">Barang Masuk</span>
              </Link>

              <Link to="/pindah" className="nav-link">
                <span className="icons">
                  <BsBoxArrowUp />
                </span>
                <span className="side-desc">Pemindahan</span>
              </Link>

              <Link to="/kerusakan" className="nav-link">
                <span className="icons">
                  <BsExclamationTriangleFill />
                </span>
                <span className="side-desc">Kerusakan</span>
              </Link>
              {state.data && state.data.role === "admin" && (
                <Link to="/penghapusan" className="nav-link">
                  <span className="icons">
                    <BsTrash3Fill />
                  </span>
                  <span className="side-desc">Penghapusan</span>
                </Link>
              )}
            </div>
            {/* menu */}
            {/* permintaan */}
            {state.data && state.data.role === "admin" && (
              <Link to="/ekonomis" className="nav-link">
                <span className="icons">
                  <BsGraphUpArrow />
                </span>
                <span className="side-desc">Masa Ekonomis </span>
              </Link>
            )}
            <Link to="/distribusi" className="nav-link">
              <span className="icons">
                <BsTruck />
              </span>
              <span className="side-desc">Distribusi Barang</span>
            </Link>
            {/* lokasi */}
            <Link to="/permintaan" className="nav-link">
              <span className="icons">
                <BsClipboardCheckFill />
              </span>
              <span className="side-desc">Permintaan</span>
            </Link>
            {state.data && state.data.role === "admin" && (
              <>
                {/* lokasi */}
                <Link to="/lokasi" className="nav-link">
                  <span className="icons">
                    <BsMapFill />
                  </span>
                  <span className="side-desc">Lokasi</span>
                </Link>
                {/* divisi */}
                <Link to="/divisi" className="nav-link">
                  <span className="icons">
                    <BsBuildingFill />
                  </span>
                  <span className="side-desc">Divisi</span>
                </Link>
                {/* user */}
                <Link to="/user" className="nav-link">
                  <span className="icons">
                    <BsPersonBadgeFill />
                  </span>
                  <span className="side-desc">User</span>
                </Link>
              </>
            )}
          </React.Fragment>
        </nav>
        <p className="text-light text-center mt-3" style={{ fontSize: "12px" }}>
          &copy; 2025 STMIK Banjarbaru
        </p>
      </div>
      <section className="body-page">{children}</section>
    </React.Fragment>
  );
};

export default SideBar;
