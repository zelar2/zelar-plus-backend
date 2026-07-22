// ZELAR+ — Controller de atendimentos
import AtendimentoService from "../services/AtendimentoService.js";

export const AtendimentoController = {
  async criar(req, res) {
    try {
      const resultado = await AtendimentoService.criar(req.body || {});
      res.status(201).json({ mensagem: "Atendimento solicitado.", ...resultado });
    } catch (erro) {
      res.status(erro.status || 500).json({ mensagem: erro.message || "Erro ao criar atendimento." });
    }
  },

  async listar(req, res) {
    try {
      const { usuario_id, profissional_id } = req.query;
      const lista = await AtendimentoService.listar({ usuario_id, profissional_id });
      res.json(lista);
    } catch (erro) {
      res.status(500).json({ mensagem: "Erro ao listar atendimentos." });
    }
  },

  async atualizarStatus(req, res) {
    try {
      const { status } = req.body || {};
      const resultado = await AtendimentoService.atualizarStatus(req.params.id, status);
      res.json({ mensagem: "Status atualizado.", ...resultado });
    } catch (erro) {
      res.status(erro.status || 500).json({ mensagem: erro.message || "Erro ao atualizar status." });
    }
  }
};

export default AtendimentoController;