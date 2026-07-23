/* ZELAR+ — Cadastro e Recuperação de senha
   Máscaras (CPF/telefone), validação real de CPF, integração com a API,
   estados de loading e persistência em localStorage. */

const API_URL = "https://zelar2-zelar-plus-backend.onrender.com";

/* ---------------- Utilidades ---------------- */

function mostrarToast(mensagem, tipo = "") {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = mensagem;
  toast.className = "toast visivel" + (tipo ? " " + tipo : "");
  clearTimeout(mostrarToast._t);
  mostrarToast._t = setTimeout(() => (toast.className = "toast"), 3200);
}

function emailValido(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());
}

function mascaraCPF(campo) {
  campo.addEventListener("input", () => {
    let v = campo.value.replace(/\D/g, "").slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    campo.value = v;
  });
}

function mascaraTelefone(campo) {
  campo.addEventListener("input", () => {
    let v = campo.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 6) {
      v = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3");
    } else if (v.length > 2) {
      v = v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else if (v.length > 0) {
      v = "(" + v;
    }
    campo.value = v;
  });
}

function cpfValido(cpf) {
  const numeros = cpf.replace(/\D/g, "");
  if (numeros.length !== 11 || /^(\d)\1{10}$/.test(numeros)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(numeros[i]) * (10 - i);
  let d1 = (soma * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(numeros[9])) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(numeros[i]) * (11 - i);
  let d2 = (soma * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === parseInt(numeros[10]);
}

function marcar(campo, erroEl, valido, preenchido) {
  campo.classList.toggle("valido", valido);
  campo.classList.toggle("invalido", preenchido && !valido);
  if (erroEl) erroEl.classList.toggle("visivel", preenchido && !valido);
}

/* ---------------- Cadastro ---------------- */

const formCadastro = document.getElementById("form-cadastro");
if (formCadastro) {
  const nome = document.getElementById("nome");
  const cpf = document.getElementById("cpf");
  const telefone = document.getElementById("telefone");
  const email = document.getElementById("email");
  const senha = document.getElementById("senha");
  const confirmar = document.getElementById("confirmar");
  const btn = document.getElementById("btn-cadastrar");
  const loading = document.getElementById("loading");

  mascaraCPF(cpf);
  mascaraTelefone(telefone);

  function validar() {
    const okNome = nome.value.trim().split(/\s+/).length >= 2;
    const okCpf = cpfValido(cpf.value);
    const okFone = telefone.value.replace(/\D/g, "").length >= 10;
    const okEmail = emailValido(email.value);
    const okSenha = senha.value.length >= 6;
    const okConf = confirmar.value === senha.value && okSenha;

    marcar(nome, document.getElementById("erro-nome"), okNome, nome.value.length > 0);
    marcar(cpf, document.getElementById("erro-cpf"), okCpf, cpf.value.length > 0);
    marcar(telefone, document.getElementById("erro-telefone"), okFone, telefone.value.length > 0);
    marcar(email, document.getElementById("erro-email"), okEmail, email.value.length > 0);
    marcar(senha, document.getElementById("erro-senha"), okSenha, senha.value.length > 0);
    marcar(confirmar, document.getElementById("erro-confirmar"), okConf, confirmar.value.length > 0);

    btn.disabled = !(okNome && okCpf && okFone && okEmail && okSenha && okConf);
  }

  [nome, cpf, telefone, email, senha, confirmar].forEach((c) => c.addEventListener("input", validar));

  formCadastro.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (btn.disabled) return;
    loading.classList.add("visivel");

    const dados = {
      nome: nome.value.trim(),
      cpf: cpf.value,
      telefone: telefone.value,
      email: email.value.trim(),
      senha: senha.value
    };

    try {
      const resposta = await fetch(`${API_URL}/cadastro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });
      const corpo = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(corpo.mensagem || "Não foi possível cadastrar.");

      localStorage.setItem("zelar_usuario", JSON.stringify({ nome: dados.nome, email: dados.email }));
      mostrarToast("Conta criada com sucesso!", "sucesso");
      setTimeout(() => {
        document.body.classList.add("fade-out");
        setTimeout(() => (window.location.href = "../2-explicacao/index.html"), 350);
      }, 700);
    } catch (erro) {
      if (erro.name === "TypeError" || /fetch|conex|network/i.test(erro.message)) {
        // Fallback offline (modo demonstração)
        localStorage.setItem("zelar_usuario", JSON.stringify({ nome: dados.nome, email: dados.email, demo: true }));
        mostrarToast("Conta criada (modo demonstração)", "sucesso");
        setTimeout(() => {
          document.body.classList.add("fade-out");
          setTimeout(() => (window.location.href = "../2-explicacao/index.html"), 350);
        }, 900);
      } else {
        mostrarToast(erro.message, "erro");
      }
    } finally {
      loading.classList.remove("visivel");
    }
  });
}

/* ---------------- Recuperar senha ---------------- */

const formRecuperar = document.getElementById("form-recuperar");
if (formRecuperar) {
  const email = document.getElementById("email");
  const btn = document.getElementById("btn-recuperar");
  const loading = document.getElementById("loading");

  email.addEventListener("input", () => {
    const ok = emailValido(email.value);
    marcar(email, document.getElementById("erro-email"), ok, email.value.length > 0);
    btn.disabled = !ok;
  });

  formRecuperar.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (btn.disabled) return;
    loading.classList.add("visivel");

    try {
      await fetch(`${API_URL}/recuperar-senha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value.trim() })
      }).catch(() => null);

      // Sempre mostra sucesso (não revela se o e-mail existe)
      document.getElementById("cartao-form").classList.add("oculto");
      document.getElementById("cartao-sucesso").classList.remove("oculto");
    } finally {
      loading.classList.remove("visivel");
    }
  });
}