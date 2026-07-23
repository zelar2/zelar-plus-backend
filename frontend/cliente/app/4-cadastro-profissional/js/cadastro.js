/* ZELAR+ — Cadastro profissional: utilidades compartilhadas
   Persistência em localStorage, máscaras, validação de CPF, navegação. */

const ZelarCadastro = {
  CHAVE: "zelar_cadastro_profissional",

  ler() {
    try {
      return JSON.parse(localStorage.getItem(this.CHAVE)) || {};
    } catch (e) {
      return {};
    }
  },

  salvar(dados) {
    const atual = this.ler();
    localStorage.setItem(this.CHAVE, JSON.stringify({ ...atual, ...dados }));
  },

  limpar() {
    localStorage.removeItem(this.CHAVE);
  },

  ir(destino) {
    document.body.classList.add("fade-out");
    setTimeout(() => (window.location.href = destino), 350);
  },

  toast(mensagem, tipo = "") {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = mensagem;
    toast.className = "toast visivel" + (tipo ? " " + tipo : "");
    clearTimeout(this._t);
    this._t = setTimeout(() => (toast.className = "toast"), 3000);
  },

  mascaraCPF(campo) {
    campo.addEventListener("input", () => {
      let v = campo.value.replace(/\D/g, "").slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      campo.value = v;
    });
  },

  mascaraTelefone(campo) {
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
  },

  cpfValido(cpf) {
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
  },

  marcar(campo, erroId, valido) {
    campo.classList.toggle("valido", valido);
    campo.classList.toggle("invalido", campo.value.length > 0 && !valido);
    const erro = document.getElementById(erroId);
    if (erro) erro.classList.toggle("visivel", campo.value.length > 0 && !valido);
  }
};

// Expõe globalmente (efeito colateral — evita tree-shaking no build)
window.ZelarCadastro = ZelarCadastro;