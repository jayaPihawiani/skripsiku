import Lokasi from "../models/LokasiModel.js";
import BaseService from "./BaseService.js";

class LokasiController extends BaseService {
  constructor() {
    super({
      model: Lokasi,
      isExistMsg: "Data lokasi sudah ada!",
      isEmptyMsg: "Data lokasi tidak ditemukan!",
      subName: "Lokasi",
    });
  }
}

export default LokasiController;
