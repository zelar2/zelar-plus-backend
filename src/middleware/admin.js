// ZELAR+ — Middleware de autorização de administrador

export function exigirAdmin(req, res, next) {
  if (!req.usuario || req.usuario.tipo !== "admin") {
    return res.status(403).json({ mensagem: "Acesso restrito a administradores." });
  }
  next();
}

export default exigirAdmin;