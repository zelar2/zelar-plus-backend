/* ZELAR+ — Selecionar atendimento
   Saudação personalizada, seleção de categoria e navegação com transição. */

const toast = document.getElementById("toast");

function mostrarToast(mensagem, tipo = "") {
  toast.textContent = mensagem;
  toast.className = "toast visivel" + (tipo ? " " + tipo : "");
  clearTimeout(mostrarToast._t);
  mostrarToast._t = setTimeout(() => (toast.className = "toast"), 3000);
}

// Saudação com o nome do usuário salvo no login
(function saudacao() {
  try {
    const usuario = JSON.parse(localStorage.getItem("zelar_usuario"));
    if (usuario && usuario.nome) {
      const primeiro = String(usuario.nome).trim().split(" ")[0];
      document.getElementById("saudacao").textContent = `Olá, ${primeiro}! Qual profissional você precisa?`;
    }
  } catch (e) { /* segue com o texto padrão */ }
})();

document.querySelectorAll(".cartao-opcao").forEach((cartao) => {
  cartao.addEventListener("click", () => {
    const categoria = cartao.dataset.categoria;
    const url = cartao.dataset.url;
    localStorage.setItem("zelar_categoria", categoria);
    document.body.classList.add("fade-out");
    setTimeout(() => (window.location.href = url), 300);
  });
});

document.getElementById("falar-suporte").addEventListener("click", (e) => {
  e.preventDefault();
  mostrarToast("Suporte: contato@zelarplus.com.br", "sucesso");
});