// ZELAR+ — Controller de profissionais
import ProfissionalService from "../services/ProfissionalService.js";

export const ProfissionalController = {
  async criar(req, res) {
    try {
      const resultado = await ProfissionalService.criar(req.body || {});
      res.status(201).json({ mensagem: "Cadastro de profissional recebido.", ...resultado });
    } catch (erro) {
      res.status(erro.status || 500).json({ mensagem: erro.message || "Erro ao cadastrar profissional." });
    }
  },

  async listar(req, res) {
    try {
      const { categoria, status } = req.query;
      const lista = await ProfissionalService.listar({ categoria, status });
      res.json(lista);
    } catch (erro) {
      res.status(500).json({ mensagem: "Erro ao listar profissionais." });
    }
  },

  async obter(req, res) {
    try {
      const profissional = await ProfissionalService.obter(req.params.id);
      if (!profissional) return res.status(404).json({ mensagem: "Profissional não encontrado." });
      res.json(profissional);
    } catch (erro) {
      res.status(500).json({ mensagem: "Erro ao obter profissional." });
    }
  },

  async atualizarStatus(req, res) {
    try {
      const { status } = req.body || {};
      const resultado = await ProfissionalService.atualizarStatus(req.params.id, status);
      res.json({ mensagem: "Status atualizado.", ...resultado });
    } catch (erro) {
      res.status(erro.status || 500).json({ mensagem: erro.message || "Erro ao atualizar status." });
    }
  }
};

export default ProfissionalController;