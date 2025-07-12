import argon2 from "argon2";
import { Op, UniqueConstraintError } from "sequelize";
import Divisi from "../models/DivisiModel.js";
import User from "../models/UserModels.js";
import Lokasi from "../models/LokasiModel.js";

class UserController {
  // CREATE USER
  createUser = async (req, res) => {
    const { nip, username, password, divisi, role, lokasiId } = req.body;

    if (!nip || !username || !password || !role || !lokasiId) {
      return res
        .status(400)
        .json({ msg: "Data ada yang kosong! Harap isi semua data!" });
    }

    try {
      const checkUser = await User.findOne({ where: { username } });

      //   kondisi
      if (checkUser) {
        return res.status(400).json({
          msg: "Username sudah ada, silahkan gunakan username yang lain!",
        });
      }
      if (password.length < 8) {
        return res.status(400).json({
          msg: "Password terlalu pendek! Password panjang minimal 8 karakter!",
        });
      }

      const hashedPassword = await argon2.hash(password);
      await User.create({
        nip,
        username,
        password: hashedPassword,
        divisi,
        role,
        lokasiId,
      });

      res.status(201).json({ msg: "Akun user berhasil dibuat." });
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };

  //   GET USER
  getUser = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;
    const search = req.query.search || "";
    const offset = limit * page;
    let totalPage;
    try {
      const count = await User.count({
        where: {
          [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { nip: { [Op.like]: `%${search}%` } },
          ],
        },
      });

      totalPage = Math.ceil(count / limit);

      const user = await User.findAll({
        include: [
          {
            model: Divisi,
            attributes: ["name", "desc"],
          },
          {
            model: Lokasi,
            attributes: ["name", "desc"],
            as: "loc_user",
          },
        ],
        attributes: ["id", "nip", "username", "role", "createdAt", "updatedAt"],
        where: {
          [Op.or]: [
            { username: { [Op.like]: `%${search}%` } },
            { nip: { [Op.like]: `%${search}%` } },
          ],
        },
        limit,
        offset,
        order: [["createdAt", "ASC"]],
      });
      res.status(200).json({ limit, page, totalPage, count, user });
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };

  // Delete user
  deleteUser = async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ msg: "Data akun user tidak ditemukan!" });
      }

      await User.destroy({ where: { id: user.id } });

      res.status(200).json({ msg: "Berhasil menghapus akun user!" });
    } catch (error) {
      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  updateDataUser = async (req, res) => {
    const { username, divisi, password, confirmPassword, lokasiId } = req.body;
    let isDivisiNull;
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ msg: "Data user tidak ditemukan!" });
      }

      if (password.length < 8) {
        return res.status(400).json({
          msg: "Password terlalu pendek! Password panjang minimal 8 karakter!",
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ msg: "Konfirmasi password salah!" });
      }

      if (!isDivisiNull) {
        isDivisiNull = user.divisi;
      }

      const hashedPassword = await argon2.hash(password);

      await User.update(
        {
          username,
          password: hashedPassword,
          divisi: !divisi ? isDivisiNull : divisi,
          lokasiId,
        },
        { where: { id: user.id } }
      );

      res.status(200).json({ msg: "Berhasil mengubah data akun user." });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return res
          .status(400)
          .json({ msg: "Akun dengan username ini sudah digunakan!" });
      }

      res.status(500).json({ msg: "ERROR: " + error.message });
    }
  };

  getAllUser = async (req, res) => {
    try {
      const user = await User.findAll({
        include: { model: Divisi, attributes: ["name", "desc"] },
        attributes: ["id", "nip", "username", "role"],
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ msg: "ERROR" + error });
    }
  };
}

export default UserController;
