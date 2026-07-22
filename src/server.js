// ZELAR+ — Servidor da API
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { obterDB } from "./config/database.js";
import AuthService from "./services/AuthService.js";

import authRoutes from "./routes/auth.routes.js";
import profissionaisRoutes from "./routes/profissionais.routes.js";
import atendimentosRoutes from "./routes/atendimentos.routes.js";
import solicitacoesRoutes from "./routes/solicitacoes.routes.js";
import documentosRoutes from "./routes/documentos.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos (painel/status)
app.use(express.static(path.join(__dirname, "..", "public")));

/* ---------------- Rotas modulares da API ---------------- */
app.use("/api", authRoutes);                      // /api/login, /api/cadastro, /api/recuperar-senha
app.use("/api/profissionais", profissionaisRoutes);
app.use("/api/atendimentos", atendimentosRoutes);
app.use("/api/solicitacoes", solicitacoesRoutes);
app.use("/api/documentos", documentosRoutes);
app.use("/api/admin", adminRoutes);

/* ---------------- Rotas base ---------------- */

// Status da API
app.get("/api", (req, res) => {
  res.json({
    nome: "API ZELAR+",
    versao: "1.0.0",
    status: "online",
    horario: new Date().toISOString()
  });
});

// Usuários
app.get("/api/usuarios", async (req, res) => {
  try {
    const db = await obterDB();
    const usuarios = await db.all(
      "SELECT id, nome, email, cpf, telefone, tipo, criado_em FROM usuarios ORDER BY criado_em DESC"
    );
    res.json(usuarios);
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao listar usuários." });
  }
});

app.post("/api/usuarios", async (req, res) => {
  try {
    const resultado = await AuthService.cadastrar(req.body || {});
    res.status(201).json({ mensagem: "Usuário criado.", ...resultado });
  } catch (erro) {
    res.status(erro.status || 500).json({ mensagem: erro.message || "Erro ao criar usuário." });
  }
});

// Rotas de autenticação (compatibilidade, sem o prefixo /api)
app.post("/login", async (req, res) => {
  try {
    const resultado = await AuthService.entrar(req.body || {});
    res.json({ mensagem: "Login realizado com sucesso.", ...resultado });
  } catch (erro) {
    res.status(erro.status || 500).json({ mensagem: erro.message || "Erro ao entrar." });
  }
});

app.post("/cadastro", async (req, res) => {
  try {
    const resultado = await AuthService.cadastrar(req.body || {});
    res.status(201).json({ mensagem: "Cadastro realizado com sucesso.", ...resultado });
  } catch (erro) {
    res.status(erro.status || 500).json({ mensagem: erro.message || "Erro ao cadastrar." });
  }
});

app.post("/recuperar-senha", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ mensagem: "Informe o e-mail." });
    const resultado = await AuthService.solicitarRecuperacao(email);
    res.json({ mensagem: "Se o e-mail estiver cadastrado, você receberá o link de redefinição.", ...resultado });
  } catch (erro) {
    res.status(500).json({ mensagem: "Erro ao processar a recuperação." });
  }
});

// Tratamento de erros (multer e demais)
app.use((erro, req, res, next) => {
  if (erro) {
    return res.status(400).json({ mensagem: erro.message || "Erro na requisição." });
  }
  next();
});

// Inicialização
(async () => {
  try {
    await obterDB();
    app.listen(PORT, () => {
      console.log(`API ZELAR+ rodando em http://localhost:${PORT}/api`);
    });
  } catch (erro) {
    console.error("Falha ao iniciar o banco de dados:", erro);
    process.exit(1);
  }
})();