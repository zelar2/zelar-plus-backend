// ZELAR+ — Rotas de atendimentos
import { Router } from "express";
import AtendimentoController from "../controllers/AtendimentoController.js";

const router = Router();

router.post("/", AtendimentoController.criar);
router.get("/", AtendimentoController.listar);
router.patch("/:id/status", AtendimentoController.atualizarStatus);

export default router;