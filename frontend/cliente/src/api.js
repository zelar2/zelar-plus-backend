// ZELAR+ — Cliente da API (compartilhado)

const API_URL = "https://zelar2-zelar-plus-backend.onrender.com";

export async function login(email, senha) {
  const resposta = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(dados.mensagem || "Falha no login");
  return dados;
}

export async function cadastro(dados) {
  const resposta = await fetch(`${API_URL}/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  });
  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) throw new Error(corpo.mensagem || "Falha no cadastro");
  return corpo;
}

export async function recuperarSenha(email) {
  const resposta = await fetch(`${API_URL}/recuperar-senha`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  return resposta.ok;
}

export async function listarUsuarios() {
  const resposta = await fetch(`${API_URL}/api/usuarios`);
  return resposta.json();
}

export default API_URL;