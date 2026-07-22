// ZELAR+ — Rotas de solicitações
import { Router } from "express";
import SolicitacaoController from "../controllers/SolicitacaoController.js";

const router = Router();

router.post("/", SolicitacaoController.criar);
router.get("/", SolicitacaoController.listar);
router.patch("/:id/status", SolicitacaoController.atualizarStatus);

export default router;