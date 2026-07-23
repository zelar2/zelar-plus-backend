/* ZELAR+ — Login
   Validação em tempo real, integração com API, estados de erro/loading,
   persistência em localStorage. */

const API_URL = "https://zelar2-zelar-plus-backend.onrender.com";

const form = document.getElementById("form-login");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const btnEntrar = document.getElementById("btn-entrar");
const erroEmail = document.getElementById("erro-email");
const erroSenha = document.getElementById("erro-senha");
const toast = document.getElementById("toast");
const loading = document.getElementById("loading");

// Se já estiver logado, vai direto
(function verificarSessao() {
  try {
    const usuario = JSON.parse(localStorage.getItem("zelar_usuario"));
    if (usuario && usuario.email) {
      const destino = localStorage.getItem("zelar_viu_explicacao")
        ? "../3-selecionar-atendimento/index.html"
        : "../2-explicacao/index.html";
      window.location.replace(destino);
    }
  } catch (e) {
    localStorage.removeItem("zelar_usuario");
  }
})();

function mostrarToast(mensagem, tipo = "") {
  toast.textContent = mensagem;
  toast.className = "toast visivel" + (tipo ? " " + tipo : "");
  clearTimeout(mostrarToast._t);
  mostrarToast._t = setTimeout(() => (toast.className = "toast"), 3200);
}

function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());
}

function validar() {
  const okEmail = emailValido(email.value);
  const okSenha = senha.value.length >= 6;

  email.classList.toggle("valido", okEmail);
  email.classList.toggle("invalido", email.value.length > 0 && !okEmail);
  erroEmail.classList.toggle("visivel", email.value.length > 0 && !okEmail);

  senha.classList.toggle("valido", okSenha);
  senha.classList.toggle("invalido", senha.value.length > 0 && !okSenha);
  erroSenha.classList.toggle("visivel", senha.value.length > 0 && !okSenha);

  btnEntrar.disabled = !(okEmail && okSenha);
}

email.addEventListener("input", validar);
senha.addEventListener("input", validar);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (btnEntrar.disabled) return;

  loading.classList.add("visivel");

  try {
    const resposta = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.value.trim(),
        senha: senha.value
      })
    });

    const dados = await resposta.json().catch(() => ({}));

    if (!resposta.ok) {
      throw new Error(dados.mensagem || "E-mail ou senha incorretos.");
    }

    // Persiste sessão
    localStorage.setItem(
      "zelar_usuario",
      JSON.stringify({
        id: dados.id || dados.usuario?.id || null,
        nome: dados.nome || dados.usuario?.nome || email.value.split("@")[0],
        email: email.value.trim(),
        token: dados.token || null
      })
    );

    mostrarToast("Login realizado com sucesso!", "sucesso");

    const destino = localStorage.getItem("zelar_viu_explicacao")
      ? "../3-selecionar-atendimento/index.html"
      : "../2-explicacao/index.html";

    setTimeout(() => {
      document.body.classList.add("fade-out");
      setTimeout(() => (window.location.href = destino), 350);
    }, 600);
  } catch (erro) {
    // Fallback offline: se a API estiver fora, entra em modo demonstração
    if (erro.name === "TypeError" || /fetch|conex|network/i.test(erro.message)) {
      localStorage.setItem(
        "zelar_usuario",
        JSON.stringify({ id: null, nome: email.value.split("@")[0], email: email.value.trim(), demo: true })
      );
      mostrarToast("Modo demonstração (sem conexão com o servidor)", "sucesso");
      setTimeout(() => {
        document.body.classList.add("fade-out");
        setTimeout(() => (window.location.href = "../2-explicacao/index.html"), 350);
      }, 900);
    } else {
      mostrarToast(erro.message || "Não foi possível entrar. Tente novamente.", "erro");
    }
  } finally {
    loading.classList.remove("visivel");
  }
});