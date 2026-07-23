// ZELAR+ — Rotas administrativas
import { Router } from "express";
import AdminController from "../controllers/AdminController.js";
import autenticar from "../middleware/auth.js";
import exigirAdmin from "../middleware/admin.js";

const router = Router();

router.get("/painel", autenticar, exigirAdmin, AdminController.painel);
router.get("/usuarios", autenticar, exigirAdmin, AdminController.listarUsuarios);

export default router;