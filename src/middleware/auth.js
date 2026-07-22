// ZELAR+ — Middleware de autenticação (JWT)
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "zelar_plus_chave_secreta_dev";

export function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || "";
  const token = cabecalho.startsWith("Bearer ") ? cabecalho.slice(7) : null;

  if (!token) {
    return res.status(401).json({ mensagem: "Token não informado." });
  }

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch (erro) {
    return res.status(401).json({ mensagem: "Token inválido ou expirado." });
  }
}

export default autenticar;