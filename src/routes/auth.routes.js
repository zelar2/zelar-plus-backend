// ZELAR+ — Rotas de autenticação
import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();

router.post("/cadastro", AuthController.cadastro);
router.post("/login", AuthController.login);
router.post("/recuperar-senha", AuthController.recuperarSenha);

export default router;