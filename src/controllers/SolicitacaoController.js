// ZELAR+ — Controller de solicitações
import SolicitacaoService from "../services/SolicitacaoService.js";

export const SolicitacaoController = {
  async criar(req, res) {
    try {
      const resultado = await SolicitacaoService.criar(req.body || {});
      res.status(201).json({ mensagem: "Solicitação registrada.", ...resultado });
    } catch (erro) {
      res.status(erro.status || 500).json({ mensagem: erro.message || "Erro ao registrar solicitação." });
    }
  },

  async listar(req, res) {
    try {
      const { status } = req.query;
      const lista = await SolicitacaoService.listar({ status });
      res.json(lista);
    } catch (erro) {
      res.status(500).json({ mensagem: "Erro ao listar solicitações." });
    }
  },

  async atualizarStatus(req, res) {
    try {
      const { status } = req.body || {};
      const resultado = await SolicitacaoService.atualizarStatus(req.params.id, status);
      res.json({ mensagem: "Status atualizado.", ...resultado });
    } catch (erro) {
      res.status(erro.status || 500).json({ mensagem: erro.message || "Erro ao atualizar status." });
    }
  }
};

export default SolicitacaoController;