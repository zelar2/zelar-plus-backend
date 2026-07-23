// ZELAR+ — Servidor estático do frontend (desenvolvimento)
// Serve as telas de frontend/cliente/app e faz proxy simples de /api.

const express = require("express");
const path = require("path");

const app = express();
const PORTA = process.env.PORT || 5173;

app.use(express.json());
app.use(express.static(path.join(__dirname, "cliente", "app")));

// Stub de login para desenvolvimento sem o backend completo
app.post("/login", (req, res) => {
  const { email, senha } = req.body || {};
  if (!email || !senha) {
    return res.status(400).json({ mensagem: "Informe e-mail e senha." });
  }
  return res.json({
    mensagem: "Login realizado (modo desenvolvimento)",
    nome: String(email).split("@")[0],
    email,
    token: "dev-token"
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "cliente", "app", "index.html"));
});

app.listen(PORTA, () => {
  console.log(`Frontend ZELAR+ em http://localhost:${PORTA}`);
});