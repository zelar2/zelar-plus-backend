// ZELAR+ — Controller de autenticação
import AuthService from "../services/AuthService.js";

export const AuthController = {
  async cadastro(req, res) {
    try {
      const resultado = await AuthService.cadastrar(req.body || {});
      res.status(201).json({ mensagem: "Cadastro realizado com sucesso.", ...resultado });
    } catch (erro) {
      res.status(erro.status || 500).json({ mensagem: erro.message || "Erro ao cadastrar." });
    }
  },

  async login(req, res) {
    try {
      const resultado = await AuthService.entrar(req.body || {});
      res.json({ mensagem: "Login realizado com sucesso.", ...resultado });
    } catch (erro) {
      res.status(erro.status || 500).json({ mensagem: erro.message || "Erro ao entrar." });
    }
  },

  async recuperarSenha(req, res) {
    try {
      const { email } = req.body || {};
      if (!email) return res.status(400).json({ mensagem: "Informe o e-mail." });
      const resultado = await AuthService.solicitarRecuperacao(email);
      res.json({ mensagem: "Se o e-mail estiver cadastrado, você receberá o link de redefinição.", ...resultado });
    } catch (erro) {
      res.status(500).json({ mensagem: "Erro ao processar a recuperação." });
    }
  }
};

export default AuthController;