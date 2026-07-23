// ZELAR+ — Rotas de documentos
import { Router } from "express";
import DocumentoController from "../controllers/DocumentoController.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post("/upload", upload.single("arquivo"), DocumentoController.enviar);
router.get("/", DocumentoController.listar);

export default router;