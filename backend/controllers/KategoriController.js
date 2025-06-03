import Kategori from "../models/KategoriBarang.js";
import BaseService from "./BaseService.js";

class KategoriController extends BaseService {
  constructor() {
    super({
      model: Kategori,
      isExistMsg: "Data kategori sudah ada!",
      isEmptyMsg: "Data kategori tidak ditemukan!",
      subName: "Kategori",
    });
  }
}

export default KategoriController;
