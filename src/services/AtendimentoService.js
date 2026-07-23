// ZELAR+ — Serviço de atendimentos
import { obterDB } from "../config/database.js";

export const AtendimentoService = {
  async criar(dados) {
    const {
      usuario_id = null, profissional_id = null, servico, categoria = null,
      tipo = "presencial", endereco = null, data = null, hora = null, valor = null
    } = dados;

    if (!servico) {
      const erro = new Error("O serviço é obrigatório.");
      erro.status = 400;
      throw erro;
    }

    const db = await obterDB();
    const resultado = await db.run(
      `INSERT INTO atendimentos (usuario_id, profissional_id, servico, categoria, tipo, endereco, data, hora, valor)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [usuario_id, profissional_id, servico, categoria, tipo, endereco, data, hora, valor]
    );
    return { id: resultado.lastID, status: "solicitado" };
  },

  async listar({ usuario_id = null, profissional_id = null } = {}) {
    const db = await obterDB();
    let sql = "SELECT * FROM atendimentos WHERE 1=1";
    const params = [];
    if (usuario_id) { sql += " AND usuario_id = ?"; params.push(usuario_id); }
    if (profissional_id) { sql += " AND profissional_id = ?"; params.push(profissional_id); }
    sql += " ORDER BY criado_em DESC";
    return db.all(sql, params);
  },

  async atualizarStatus(id, status) {
    if (!["solicitado", "confirmado", "concluido", "cancelado"].includes(status)) {
      const erro = new Error("Status inválido.");
      erro.status = 400;
      throw erro;
    }
    const db = await obterDB();
    await db.run("UPDATE atendimentos SET status = ? WHERE id = ?", [status, id]);
    return { id: Number(id), status };
  }
};

export default AtendimentoService;