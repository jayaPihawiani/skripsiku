import React from "react";
import {
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
  BsTools,
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
              <>
                <Link to="/barang" className="nav-link">
                  <span className="icons">
                    <BsBoxSeamFill />
                  </span>
                  <span className="side-desc">Data Barang</span>
                </Link>{" "}
                <Link to="/unit_barang" className="nav-link">
                  <span className="icons">
                    <BsBoxSeamFill />
                  </span>
                  <span className="side-desc">Data Unit Barang</span>
                </Link>
              </>
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
              <Link to="/merk" className="nav-link">
                <span className="icons">
                  <BsTagsFill />
                </span>
                <span className="side-desc">Data Merk</span>
              </Link>

              {/* kategori */}
              <Link to="/kategori" className="nav-link">
                <span className="icons">
                  <BsGridFill />
                </span>
                <span className="side-desc">Data Kategori</span>
              </Link>
              <Link to="/lokasi" className="nav-link">
                <span className="icons">
                  <BsMapFill />
                </span>
                <span className="side-desc">Data Lokasi</span>
              </Link>
              <Link to="/k/kerusakan" className="nav-link">
                <span className="icons">
                  <BsBuildingFill />
                </span>
                <span className="side-desc">Kategori Kerusakan</span>
              </Link>
              <Link to="/barang" className="nav-link">
                <span className="icons">
                  <BsBoxSeamFill />
                </span>
                <span className="side-desc">Data Barang</span>
              </Link>
              <Link to="/unit_barang" className="nav-link">
                <span className="icons">
                  <BsBoxSeamFill />
                </span>
                <span className="side-desc">Data Unit Barang</span>
              </Link>
            </div>
            {/* menu */}
            {/* dropdown menu */}

            {state.data && state.data.role === "admin" && (
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
            )}

            {/* dropdown menu */}
            {/* menu */}
            <div className="collapse side-bar-style" id="menu-transaksi">
              <Link to="/penempatan" className="nav-link">
                <span className="icons">
                  <BsBoxArrowUp />
                </span>
                <span className="side-desc">Penempatan</span>
              </Link>
              <Link to="/kerusakan" className="nav-link">
                <span className="icons">
                  <BsExclamationTriangleFill />
                </span>
                <span className="side-desc">Kerusakan</span>
              </Link>
              <Link to="/penghapusan" className="nav-link">
                <span className="icons">
                  <BsTrash3Fill />
                </span>
                <span className="side-desc">Penghapusan</span>
              </Link>
            </div>
            {/* menu */}
            {/* permintaan */}
            {state.data && state.data.role === "admin" && (
              <>
                <Link to="/usia_pakai" className="nav-link">
                  <span className="icons">
                    <BsGraphUpArrow />
                  </span>
                  <span className="side-desc">Data Usia Pakai</span>
                </Link>
                {/* user */}
                <Link to="/user" className="nav-link">
                  <span className="icons">
                    <BsPersonBadgeFill />
                  </span>
                  <span className="side-desc">Data User</span>
                </Link>
              </>
            )}

            {/* penempatan (user) */}
            {state.data && state.data.role === "user" && (
              <Link to="/penempatan" className="nav-link">
                <span className="icons">
                  <BsBoxArrowUp />
                </span>
                <span className="side-desc">Penempatan</span>
              </Link>
            )}
            {/* lokasi */}
            <Link to="/pengajuan" className="nav-link">
              <span className="icons">
                <BsClipboardCheckFill />
              </span>
              <span className="side-desc">Pengajuan</span>
            </Link>
            <Link to="/permintaan" className="nav-link">
              <span className="icons">
                <BsClipboardCheckFill />
              </span>
              <span className="side-desc">Permintaan</span>
            </Link>
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
