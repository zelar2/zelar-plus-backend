// ZELAR+ — Rotas de profissionais
import { Router } from "express";
import ProfissionalController from "../controllers/ProfissionalController.js";

const router = Router();

router.post("/", ProfissionalController.criar);
router.get("/", ProfissionalController.listar);
router.get("/:id", ProfissionalController.obter);
router.patch("/:id/status", ProfissionalController.atualizarStatus);

export default router;