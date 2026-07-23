// ZELAR+ — Serviço de profissionais
import { obterDB } from "../config/database.js";

export const ProfissionalService = {
  async criar(dados) {
    const {
      nome, cpf = null, telefone = null, categoria,
      conselho = null, conselho_numero = null, uf = null,
      banco = null, agencia = null, conta = null, pix = null,
      usuario_id = null
    } = dados;

    if (!nome || !categoria) {
      const erro = new Error("Nome e categoria são obrigatórios.");
      erro.status = 400;
      throw erro;
    }

    const db = await obterDB();
    const resultado = await db.run(
      `INSERT INTO profissionais
       (usuario_id, nome, cpf, telefone, categoria, conselho, conselho_numero, uf, banco, agencia, conta, pix)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [usuario_id, nome, cpf, telefone, categoria, conselho, conselho_numero, uf, banco, agencia, conta, pix]
    );
    return { id: resultado.lastID, status: "pendente" };
  },

  async listar({ categoria = null, status = null } = {}) {
    const db = await obterDB();
    let sql = "SELECT * FROM profissionais WHERE 1=1";
    const params = [];
    if (categoria) { sql += " AND categoria = ?"; params.push(categoria); }
    if (status) { sql += " AND status = ?"; params.push(status); }
    sql += " ORDER BY criado_em DESC";
    return db.all(sql, params);
  },

  async obter(id) {
    const db = await obterDB();
    return db.get("SELECT * FROM profissionais WHERE id = ?", [id]);
  },

  async atualizarStatus(id, status) {
    if (!["pendente", "aprovado", "recusado"].includes(status)) {
      const erro = new Error("Status inválido.");
      erro.status = 400;
      throw erro;
    }
    const db = await obterDB();
    await db.run("UPDATE profissionais SET status = ? WHERE id = ?", [status, id]);
    return { id: Number(id), status };
  }
};

export default ProfissionalService;