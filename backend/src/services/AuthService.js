// ZELAR+ — Serviço de autenticação
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { obterDB } from "../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "zelar_plus_chave_secreta_dev";
const JWT_EXPIRA = process.env.JWT_EXPIRA || "7d";

export const AuthService = {
  async cadastrar({ nome, email, senha, cpf = null, telefone = null, tipo = "cliente" }) {
    if (!nome || !email || !senha) {
      const erro = new Error("Nome, e-mail e senha são obrigatórios.");
      erro.status = 400;
      throw erro;
    }
    const db = await obterDB();
    const existente = await db.get("SELECT id FROM usuarios WHERE email = ?", [email]);
    if (existente) {
      const erro = new Error("E-mail já cadastrado.");
      erro.status = 409;
      throw erro;
    }
    const senha_hash = await bcrypt.hash(senha, 10);
    const resultado = await db.run(
      "INSERT INTO usuarios (nome, email, senha_hash, cpf, telefone, tipo) VALUES (?, ?, ?, ?, ?, ?)",
      [nome, email, senha_hash, cpf, telefone, tipo]
    );
    const usuario = { id: resultado.lastID, nome, email, tipo };
    const token = jwt.sign(usuario, JWT_SECRET, { expiresIn: JWT_EXPIRA });
    return { ...usuario, token };
  },

  async entrar({ email, senha }) {
    if (!email || !senha) {
      const erro = new Error("Informe e-mail e senha.");
      erro.status = 400;
      throw erro;
    }
    const db = await obterDB();
    const usuario = await db.get("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (!usuario) {
      const erro = new Error("E-mail ou senha incorretos.");
      erro.status = 401;
      throw erro;
    }
    const confere = await bcrypt.compare(senha, usuario.senha_hash);
    if (!confere) {
      const erro = new Error("E-mail ou senha incorretos.");
      erro.status = 401;
      throw erro;
    }
    const payload = { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRA });
    return { ...payload, token };
  },

  async solicitarRecuperacao(email) {
    const db = await obterDB();
    const usuario = await db.get("SELECT id FROM usuarios WHERE email = ?", [email]);
    // Não revela se o e-mail existe
    if (!usuario) return { enviado: true };
    const token = crypto.randomBytes(24).toString("hex");
    const expira = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    await db.run("INSERT INTO recuperacoes (email, token, expira_em) VALUES (?, ?, ?)", [email, token, expira]);
    // Em produção, o token seria enviado por e-mail (nodemailer)
    return { enviado: true, token_dev: token };
  }
};

export default AuthService;