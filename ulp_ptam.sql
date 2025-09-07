-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 07, 2025 at 06:53 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ulp_ptam`
--

-- --------------------------------------------------------

--
-- Table structure for table `barang`
--

CREATE TABLE `barang` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `qty` int DEFAULT NULL,
  `tgl_beli` datetime DEFAULT NULL,
  `harga` int DEFAULT NULL,
  `kondisi` varchar(255) DEFAULT NULL,
  `merk` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `kategori` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `umur_ekonomis` double DEFAULT NULL,
  `biaya_penyusutan` double DEFAULT NULL,
  `penyusutan_berjalan` double DEFAULT '0',
  `nilai_buku` double DEFAULT NULL,
  `lokasi_barang` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `barang_unit`
--

CREATE TABLE `barang_unit` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `kode_barang` varchar(255) DEFAULT NULL,
  `barangId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `tgl_beli` datetime DEFAULT NULL,
  `harga` int DEFAULT NULL,
  `kondisi` varchar(255) DEFAULT NULL,
  `riwayat_pemeliharaan` double DEFAULT NULL,
  `kategori` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `umur_ekonomis` double DEFAULT NULL,
  `biaya_penyusutan` double DEFAULT NULL,
  `penyusutan_berjalan` double DEFAULT '0',
  `nilai_buku` double DEFAULT NULL,
  `lokasi_barang` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `lokasi_asal` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `sebab_kerusakan` varchar(255) DEFAULT NULL,
  `status_perbaikan` varchar(255) DEFAULT NULL,
  `status` enum('rusak','baik') DEFAULT 'baik',
  `status_penghapusan` enum('null','diusul','disetujui','ditolak') DEFAULT 'null',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brg_rusak`
--

CREATE TABLE `brg_rusak` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `riwayat_pemeliharaan` double DEFAULT NULL,
  `sebab_kerusakan` varchar(255) DEFAULT NULL,
  `status_perbaikan` varchar(255) DEFAULT NULL,
  `sisa_stok` int DEFAULT NULL,
  `barangUnitId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `detail_kerusakan`
--

CREATE TABLE `detail_kerusakan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `pengurang` int DEFAULT NULL,
  `kategoriKerusakanId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `detail_kerusakan`
--

INSERT INTO `detail_kerusakan` (`id`, `desc`, `pengurang`, `kategoriKerusakanId`, `createdAt`, `updatedAt`) VALUES
('0b1367d3-0e97-493e-8a4d-61e6b7fc2a91', 'Pemasangan oleh bukan teknisi', 20, '53f66133-262d-4cc6-b2fa-3ec557ad8e32', '2025-08-14 04:29:08', '2025-08-14 04:29:08'),
('0f6a48d1-ef18-4f16-9d99-bea89f5cd861', 'Tidak pernah dibersihkan', 10, '2df94fb0-9c77-4bf1-aac3-2d4629a2e3e7', '2025-08-14 04:28:22', '2025-08-14 04:28:22'),
('233a41de-6e8b-4ba0-83c9-87380becf647', 'Tidak ada catatan perawatan', 10, '2df94fb0-9c77-4bf1-aac3-2d4629a2e3e7', '2025-08-14 04:28:32', '2025-08-14 04:28:32'),
('2be33330-4099-46bb-a805-7bab98a5e04f', '<10 Tahun', 10, '5b9dc0c3-46c0-4794-93f6-73c0f2ad6e8c', '2025-08-14 04:27:57', '2025-08-14 04:27:57'),
('33a03546-68e4-49c9-8bc4-350117821382', 'Salah prosedur instalasi', 15, '53f66133-262d-4cc6-b2fa-3ec557ad8e32', '2025-08-14 04:28:51', '2025-08-14 04:28:51'),
('42592c37-1a3f-42c8-94bb-fbcc58be6650', 'Tidak pernah dicek rutin', 15, '2df94fb0-9c77-4bf1-aac3-2d4629a2e3e7', '2025-08-14 04:28:27', '2025-08-14 04:28:27'),
('7ab4e882-604a-48dc-8445-8cd3d9b9b744', '>10 Tahun', 20, '5b9dc0c3-46c0-4794-93f6-73c0f2ad6e8c', '2025-08-14 04:28:05', '2025-08-14 04:28:05'),
('83bf6641-55e4-472c-b4ac-9874a01510af', 'Tanpa uji coba setelah instalasi', 10, '53f66133-262d-4cc6-b2fa-3ec557ad8e32', '2025-08-14 04:29:12', '2025-08-14 04:29:12'),
('e07181d1-235d-4fa8-85f8-83d8444fd8e8', 'Kurang perawatan', 13, '97af9d00-8a09-4b48-89d3-c5a8fe397d10', '2025-09-01 14:38:24', '2025-09-01 14:38:24'),
('f32b59f4-7371-46ae-944d-d3457b8a283f', '<5 Tahun', 0, '5b9dc0c3-46c0-4794-93f6-73c0f2ad6e8c', '2025-08-14 04:27:50', '2025-08-14 04:27:50');

-- --------------------------------------------------------

--
-- Table structure for table `kategori_brg`
--

CREATE TABLE `kategori_brg` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `masa_ekonomis` double DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kategori_brg`
--

INSERT INTO `kategori_brg` (`id`, `name`, `desc`, `masa_ekonomis`, `createdAt`, `updatedAt`) VALUES
('069aa31c-5685-49c7-a221-f28f23ccc846', 'Alat Bengkel Bermesin', '-', 10, '2025-09-01 14:23:47', '2025-09-01 14:23:47'),
('6575ceb7-2001-4a6d-bc13-08138a345f25', 'Meja dan Kursi Kerja ', '-', 5, '2025-08-14 04:21:26', '2025-08-14 04:21:26'),
('74a32fcd-0ae7-426a-ad8b-61c7bb7f5289', 'Alat Komunikasi Perusahaan', '-', 10, '2025-08-28 21:05:12', '2025-09-07 08:50:31'),
('858ec54e-82e3-422e-bc4d-91efdb9eafa9', 'Alat Komunikasi', '-', 5, '2025-08-14 04:21:47', '2025-08-14 04:21:47'),
('8eb1443d-5ea3-4b7c-9872-99673dc23545', 'Alat Angkutan Darat Bermotor', '-', 5, '2025-08-14 04:20:57', '2025-08-14 04:20:57'),
('ad7e433e-e9b5-46a2-9423-d4c5931bc130', 'Alat Kantor', '-', 5, '2025-08-14 04:21:08', '2025-08-14 04:21:08'),
('db6707a6-60cd-44a5-b3fc-ae287e771380', 'Peralatan Komputer', '-', 4, '2025-08-14 04:21:16', '2025-08-14 04:21:16'),
('fb064ee4-ac02-4f03-ba70-b973a1dc5614', 'Peralatan Pemancar', '-', 10, '2025-08-14 04:21:35', '2025-08-14 04:21:35');

-- --------------------------------------------------------

--
-- Table structure for table `kategori_kerusakan`
--

CREATE TABLE `kategori_kerusakan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `jenis` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kategori_kerusakan`
--

INSERT INTO `kategori_kerusakan` (`id`, `jenis`, `createdAt`, `updatedAt`) VALUES
('2df94fb0-9c77-4bf1-aac3-2d4629a2e3e7', 'Tidak Ada Riwayat Pemeliharaan', '2025-08-14 04:25:53', '2025-09-07 13:41:22'),
('53f66133-262d-4cc6-b2fa-3ec557ad8e32', 'Kesalahan Instalasi/Pemasangan', '2025-08-14 04:26:02', '2025-08-14 04:26:02'),
('5b9dc0c3-46c0-4794-93f6-73c0f2ad6e8c', 'Usia Pemakaian Terlalu Lama', '2025-08-14 04:25:48', '2025-09-07 13:53:13'),
('97af9d00-8a09-4b48-89d3-c5a8fe397d10', 'Kesalahan Pengguna', '2025-09-01 14:38:11', '2025-09-01 14:38:11');

-- --------------------------------------------------------

--
-- Table structure for table `lokasi_unit`
--

CREATE TABLE `lokasi_unit` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `desc` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `lokasi_unit`
--

INSERT INTO `lokasi_unit` (`id`, `name`, `desc`, `createdAt`, `updatedAt`) VALUES
('08e98841-aba8-4e65-9f8d-e5f81b8f33ad', 'ASET & PERLENGKAPAN', 'ASET', '2025-08-14 04:22:53', '2025-08-14 04:22:53'),
('330dec8d-45e3-4ad1-9a1c-2743df79365f', 'SEKRETARIAT, TI & PENGELOLAAN DATA', 'TI', '2025-08-14 04:22:18', '2025-08-14 04:22:18'),
('39b2fe3f-a93c-42f0-8556-10ee49b879ac', 'CABANG II', 'CAB. II', '2025-08-14 04:23:36', '2025-08-14 04:23:36'),
('4a7afc69-9d46-4591-8586-ae0402517b88', 'PRODUKSI', 'PRODUKSI', '2025-08-14 04:23:00', '2025-08-14 04:23:00'),
('697d3f3c-4c4b-462e-957d-324fdda7a53a', 'CABANG III', 'CAB. III', '2025-08-14 04:23:44', '2025-08-14 04:23:44'),
('6d54ef4d-8bc2-4d3b-b4a0-0dfb78917af0', 'CABANG I', 'CAB. I', '2025-08-14 04:23:29', '2025-08-14 04:23:29'),
('757d5692-34f3-4a1f-bc74-444f311120f1', 'SATUAN PENGAWAS INTERNAL', 'SPI', '2025-08-14 04:22:03', '2025-08-25 12:21:08'),
('b7736599-0c84-4056-ab3d-41c66f05d0c2', 'SUMBER DAYA MANUSIA', 'SDM', '2025-08-14 04:22:35', '2025-08-14 04:22:35'),
('b787b2b1-bc96-48c5-8bb1-068ca154cfe8', 'HUBUNGAN LANGGANAN', 'HUBLANG', '2025-08-14 04:22:43', '2025-08-14 04:22:43'),
('b8ff9c0e-a8a1-4cfc-a7c6-8ae30ff1c827', 'TRANSMISI & DISTRIBUSI', 'TRANDIS', '2025-08-14 04:23:10', '2025-08-14 04:23:10'),
('cff817ef-5e5e-45bc-a519-b0944a6d19ef', 'KEUANGAN', 'ruang keuangan', '2025-08-14 04:22:25', '2025-08-25 12:20:31'),
('fd952db7-5fb6-4a88-8b9e-cf7afcda4ead', 'PERENCANAAN', 'PERENCANAAN', '2025-08-14 04:23:19', '2025-08-14 04:23:19');

-- --------------------------------------------------------

--
-- Table structure for table `merk_brg`
--

CREATE TABLE `merk_brg` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `desc` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `merk_brg`
--

INSERT INTO `merk_brg` (`id`, `name`, `desc`, `createdAt`, `updatedAt`) VALUES
('4362966f-121c-49cd-81ab-28850bb52a88', 'shimizu', 'merk pompa air', '2025-09-07 10:54:16', '2025-09-07 10:54:16'),
('59eff4b9-b3a5-4dd7-b5cd-85dc86e57715', 'honda', 'merk kendaraan', '2025-09-07 10:54:23', '2025-09-07 10:54:23'),
('6d91288d-b6e5-4335-aa57-ae4ee59477d0', 'TP-Link', 'merk access point', '2025-09-07 10:54:43', '2025-09-07 10:54:43'),
('f6486686-9bb1-4e2d-9488-3d29d83e65f5', 'Asus', 'merk komputer', '2025-09-07 10:54:33', '2025-09-07 10:54:33');

-- --------------------------------------------------------

--
-- Table structure for table `pemindahan`
--

CREATE TABLE `pemindahan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `from` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `to` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `tgl_pindah` datetime DEFAULT NULL,
  `barangUnitId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengajuan`
--

CREATE TABLE `pengajuan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `qty` int DEFAULT NULL,
  `file` varchar(50) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pengajuan`
--

INSERT INTO `pengajuan` (`id`, `name`, `desc`, `qty`, `file`, `url`, `createdAt`, `updatedAt`, `userId`) VALUES
('a835cec4-fd5d-4de6-85c1-c4a757505b46', 'ups', 'UPS kantor keuangan..', 1, 'file_1757224098611.docx', 'https://okpppngdlvnsnmysnxlz.supabase.co/storage/v1/object/public/product/file_1757224098611.docx', '2025-09-07 12:48:19', '2025-09-07 12:48:19', '1c8d7222-152e-4207-b1de-3c7c0ada7cd9');

-- --------------------------------------------------------

--
-- Table structure for table `penghapusan`
--

CREATE TABLE `penghapusan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `desc` varchar(255) DEFAULT NULL,
  `barangUnitId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `tgl_hapus` datetime DEFAULT NULL,
  `sisa_stok` int DEFAULT NULL,
  `status` enum('diusul','disetujui','ditolak') DEFAULT 'diusul',
  `file` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permintaan`
--

CREATE TABLE `permintaan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `barangId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `qty` int DEFAULT NULL,
  `status` enum('disetujui','belum disetujui','ditolak') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`sid`, `expires`, `data`, `createdAt`, `updatedAt`) VALUES
('IeZxIlUOGaa4vfngJwQe81hM7h26gbx8', '2025-09-07 21:53:13', '{\"cookie\":{\"originalMaxAge\":28800000,\"expires\":\"2025-09-07T14:12:46.704Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"uid\":\"582f30a6-2a4a-46f4-9f06-de40cb739142\"}', '2025-09-07 13:12:46', '2025-09-07 13:53:13'),
('TG8i1Axfqfv4n1iPp56efS3mQ_H4SDoW', '2025-09-07 21:38:43', '{\"cookie\":{\"originalMaxAge\":28800000,\"expires\":\"2025-09-07T14:35:34.400Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"uid\":\"582f30a6-2a4a-46f4-9f06-de40cb739142\"}', '2025-09-07 13:35:34', '2025-09-07 13:38:43');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nip` varchar(50) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `lokasiId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `role` enum('admin','user') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nip`, `username`, `password`, `lokasiId`, `role`, `createdAt`, `updatedAt`) VALUES
('1c8d7222-152e-4207-b1de-3c7c0ada7cd9', '15119999', 'user-keuangan', '$argon2id$v=19$m=65536,t=3,p=4$8PhX3wiGqXpsrMxQnym51Q$iCFH4DIL5/Jkq7AUk+BP7RwbLNJJqtcRsT8X6Epd4rI', 'cff817ef-5e5e-45bc-a519-b0944a6d19ef', 'user', '2025-09-07 12:46:49', '2025-09-07 12:46:49'),
('582f30a6-2a4a-46f4-9f06-de40cb739142', '15112001', 'admin', '$argon2id$v=19$m=65536,t=3,p=4$5GaZzuJF1e8uNpIzwb5V7Q$c9P9F6FvnMovFTD68LVwbOqMR2r+1GPc8GvAu1+WVAc', '330dec8d-45e3-4ad1-9a1c-2743df79365f', 'admin', '2025-08-14 04:18:55', '2025-09-03 07:07:32'),
('6bbb80eb-b9d7-41d6-8fc3-0a9391308ca2', '15110001', 'user-perencanaan', '$argon2id$v=19$m=65536,t=3,p=4$vcHbRo678CJsNJRaPmF1mQ$ugWPHCGk8H/KG05z57wkolamFZvJiZ8QPJN0z6feSDc', 'fd952db7-5fb6-4a88-8b9e-cf7afcda4ead', 'user', '2025-09-02 07:24:19', '2025-09-02 07:24:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `merk` (`merk`),
  ADD KEY `kategori` (`kategori`),
  ADD KEY `lokasi_barang` (`lokasi_barang`);

--
-- Indexes for table `barang_unit`
--
ALTER TABLE `barang_unit`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_barang` (`kode_barang`),
  ADD UNIQUE KEY `kode_barang_2` (`kode_barang`),
  ADD KEY `barangId` (`barangId`),
  ADD KEY `kategori` (`kategori`),
  ADD KEY `lokasi_barang` (`lokasi_barang`),
  ADD KEY `lokasi_asal` (`lokasi_asal`);

--
-- Indexes for table `brg_rusak`
--
ALTER TABLE `brg_rusak`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barangUnitId` (`barangUnitId`);

--
-- Indexes for table `detail_kerusakan`
--
ALTER TABLE `detail_kerusakan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kategoriKerusakanId` (`kategoriKerusakanId`);

--
-- Indexes for table `kategori_brg`
--
ALTER TABLE `kategori_brg`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kategori_kerusakan`
--
ALTER TABLE `kategori_kerusakan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lokasi_unit`
--
ALTER TABLE `lokasi_unit`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `merk_brg`
--
ALTER TABLE `merk_brg`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pemindahan`
--
ALTER TABLE `pemindahan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `from` (`from`),
  ADD KEY `to` (`to`),
  ADD KEY `barangUnitId` (`barangUnitId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `pengajuan`
--
ALTER TABLE `pengajuan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `penghapusan`
--
ALTER TABLE `penghapusan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barangUnitId` (`barangUnitId`);

--
-- Indexes for table `permintaan`
--
ALTER TABLE `permintaan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `barangId` (`barangId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`sid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD KEY `lokasiId` (`lokasiId`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `barang`
--
ALTER TABLE `barang`
  ADD CONSTRAINT `barang_ibfk_4` FOREIGN KEY (`merk`) REFERENCES `merk_brg` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `barang_ibfk_5` FOREIGN KEY (`kategori`) REFERENCES `kategori_brg` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `barang_ibfk_6` FOREIGN KEY (`lokasi_barang`) REFERENCES `lokasi_unit` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `barang_unit`
--
ALTER TABLE `barang_unit`
  ADD CONSTRAINT `barang_unit_ibfk_5` FOREIGN KEY (`barangId`) REFERENCES `barang` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `barang_unit_ibfk_6` FOREIGN KEY (`kategori`) REFERENCES `kategori_brg` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `barang_unit_ibfk_7` FOREIGN KEY (`lokasi_barang`) REFERENCES `lokasi_unit` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `barang_unit_ibfk_8` FOREIGN KEY (`lokasi_asal`) REFERENCES `lokasi_unit` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `brg_rusak`
--
ALTER TABLE `brg_rusak`
  ADD CONSTRAINT `brg_rusak_ibfk_1` FOREIGN KEY (`barangUnitId`) REFERENCES `barang_unit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `detail_kerusakan`
--
ALTER TABLE `detail_kerusakan`
  ADD CONSTRAINT `detail_kerusakan_ibfk_1` FOREIGN KEY (`kategoriKerusakanId`) REFERENCES `kategori_kerusakan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `pemindahan`
--
ALTER TABLE `pemindahan`
  ADD CONSTRAINT `pemindahan_ibfk_5` FOREIGN KEY (`from`) REFERENCES `lokasi_unit` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `pemindahan_ibfk_6` FOREIGN KEY (`to`) REFERENCES `lokasi_unit` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `pemindahan_ibfk_7` FOREIGN KEY (`barangUnitId`) REFERENCES `barang_unit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pemindahan_ibfk_8` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `pengajuan`
--
ALTER TABLE `pengajuan`
  ADD CONSTRAINT `pengajuan_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `penghapusan`
--
ALTER TABLE `penghapusan`
  ADD CONSTRAINT `penghapusan_ibfk_1` FOREIGN KEY (`barangUnitId`) REFERENCES `barang_unit` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `permintaan`
--
ALTER TABLE `permintaan`
  ADD CONSTRAINT `permintaan_ibfk_3` FOREIGN KEY (`barangId`) REFERENCES `barang` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `permintaan_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`lokasiId`) REFERENCES `lokasi_unit` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
