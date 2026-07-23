// ZELAR+ — Controller de documentos (upload)
import { obterDB } from "../config/database.js";

export const DocumentoController = {
  async enviar(req, res) {
    try {
      const { profissional_id, tipo } = req.body || {};
      if (!profissional_id || !tipo) {
        return res.status(400).json({ mensagem: "profissional_id e tipo são obrigatórios." });
      }
      if (!req.file) {
        return res.status(400).json({ mensagem: "Nenhum arquivo enviado." });
      }
      const db = await obterDB();
      const resultado = await db.run(
        "INSERT INTO documentos (profissional_id, tipo, arquivo) VALUES (?, ?, ?)",
        [profissional_id, tipo, req.file.filename]
      );
      res.status(201).json({ mensagem: "Documento enviado.", id: resultado.lastID, arquivo: req.file.filename });
    } catch (erro) {
      res.status(500).json({ mensagem: "Erro ao enviar documento." });
    }
  },

  async listar(req, res) {
    try {
      const { profissional_id } = req.query;
      const db = await obterDB();
      let sql = "SELECT id, profissional_id, tipo, arquivo, criado_em FROM documentos";
      const params = [];
      if (profissional_id) { sql += " WHERE profissional_id = ?"; params.push(profissional_id); }
      sql += " ORDER BY criado_em DESC";
      const lista = await db.all(sql, params);
      res.json(lista);
    } catch (erro) {
      res.status(500).json({ mensagem: "Erro ao listar documentos." });
    }
  }
};

export default DocumentoController;