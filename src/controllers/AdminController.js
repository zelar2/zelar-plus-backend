// ZELAR+ — Controller administrativo
import { obterDB } from "../config/database.js";

export const AdminController = {
  async painel(req, res) {
    try {
      const db = await obterDB();
      const [usuarios, profissionais, pendentes, atendimentos, solicitacoes] = await Promise.all([
        db.get("SELECT COUNT(*) AS total FROM usuarios"),
        db.get("SELECT COUNT(*) AS total FROM profissionais"),
        db.get("SELECT COUNT(*) AS total FROM profissionais WHERE status = 'pendente'"),
        db.get("SELECT COUNT(*) AS total FROM atendimentos"),
        db.get("SELECT COUNT(*) AS total FROM solicitacoes WHERE status = 'aberta'")
      ]);
      res.json({
        usuarios: usuarios.total,
        profissionais: profissionais.total,
        profissionais_pendentes: pendentes.total,
        atendimentos: atendimentos.total,
        solicitacoes_abertas: solicitacoes.total
      });
    } catch (erro) {
      res.status(500).json({ mensagem: "Erro ao carregar painel." });
    }
  },

  async listarUsuarios(req, res) {
    try {
      const db = await obterDB();
      const lista = await db.all(
        "SELECT id, nome, email, cpf, telefone, tipo, criado_em FROM usuarios ORDER BY criado_em DESC"
      );
      res.json(lista);
    } catch (erro) {
      res.status(500).json({ mensagem: "Erro ao listar usuários." });
    }
  }
};

export default AdminController;