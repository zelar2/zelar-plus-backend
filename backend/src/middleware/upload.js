// ZELAR+ — Configuração de upload (multer)
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const destinos = {
  documento: path.join(__dirname, "..", "uploads", "documentos"),
  foto: path.join(__dirname, "..", "uploads", "fotos")
};

Object.values(destinos).forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const tipo = (req.body && req.body.tipo_upload) || "documento";
    cb(null, destinos[tipo] || destinos.documento);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname || "");
    const nome = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, nome);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter(req, file, cb) {
    const permitidos = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (permitidos.includes(file.mimetype)) return cb(null, true);
    cb(new Error("Tipo de arquivo não permitido. Use JPG, PNG, WEBP ou PDF."));
  }
});

export default upload;