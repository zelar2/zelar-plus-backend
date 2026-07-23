// ZELAR+ — Serviço de solicitações
import { obterDB } from "../config/database.js";

export const SolicitacaoService = {
  async criar(dados) {
    const { usuario_id = null, categoria, servico, endereco = null, detalhes = null } = dados;
    if (!categoria || !servico) {
      const erro = new Error("Categoria e serviço são obrigatórios.");
      erro.status = 400;
      throw erro;
    }
    const db = await obterDB();
    const resultado = await db.run(
      "INSERT INTO solicitacoes (usuario_id, categoria, servico, endereco, detalhes) VALUES (?, ?, ?, ?, ?)",
      [usuario_id, categoria, servico, endereco, detalhes]
    );
    return { id: resultado.lastID, status: "aberta" };
  },

  async listar({ status = null } = {}) {
    const db = await obterDB();
    let sql = "SELECT * FROM solicitacoes";
    const params = [];
    if (status) { sql += " WHERE status = ?"; params.push(status); }
    sql += " ORDER BY criado_em DESC";
    return db.all(sql, params);
  },

  async atualizarStatus(id, status) {
    if (!["aberta", "aceita", "recusada", "concluida"].includes(status)) {
      const erro = new Error("Status inválido.");
      erro.status = 400;
      throw erro;
    }
    const db = await obterDB();
    await db.run("UPDATE solicitacoes SET status = ? WHERE id = ?", [status, id]);
    return { id: Number(id), status };
  }
};

export default SolicitacaoService;