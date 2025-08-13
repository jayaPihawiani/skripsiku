import argon2 from "argon2";
import Lokasi from "../models/LokasiModel.js";
import User from "../models/UserModels.js";

class AuthController {
  // LOGIN
  loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ msg: "Email atau password tidak boleh kosong!" });
    }

    try {
      const checkUser = await User.findOne({
        where: { username },
        include: {
          model: Lokasi,
          as: "loc_user",
          attributes: ["name", "desc"],
        },
      });
      if (!checkUser) {
        return res
          .status(404)
          .json({ msg: "Akun dengan username ini tidak ditemukan!" });
      }

      const matchPassword = await argon2.verify(checkUser.password, password);

      if (!matchPassword) {
        return res.status(400).json({ msg: "Password yang dimasukkan salah!" });
      }

      req.session.uid = checkUser.id;

      res.status(200).json({
        id: checkUser.id,
        username: checkUser.username,
        lokasi: checkUser.loc_user?.name,
        role: checkUser.role,
      });
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };

  // LOGOUT
  logoutUser = async (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ msg: "Gagal melakukan log out!" });
      res.clearCookie("connect.sid");
      res.status(200).json({ msg: "Berhasil log out." });
    });
  };

  // USER INFO
  userInfo = async (req, res) => {
    if (!req.session.uid) {
      return res
        .status(401)
        .json({ msg: "Sesi telah habis! Harap login kembali!" });
    }

    try {
      const user = await User.findByPk(req.session.uid, {
        attributes: ["username", "nip", "role"],
        include: [
          { model: Lokasi, as: "loc_user", attributes: ["name", "desc"] },
        ],
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ msg: "ERROR " + error.message });
    }
  };
}

export default AuthController;
