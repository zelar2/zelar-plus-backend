/* ZELAR+ — Como funciona (slides) */

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll("#progresso .dot");
const btnProximo = document.getElementById("btn-proximo");
const pular = document.getElementById("pular");

let atual = 0;

function mostrar(indice) {
  slides.forEach((s, i) => s.classList.toggle("ativo", i === indice));
  dots.forEach((d, i) => {
    d.classList.toggle("ativo", i === indice);
    d.classList.toggle("feito", i < indice);
  });
  btnProximo.textContent = indice === slides.length - 1 ? "Começar" : "Próximo";
}

function concluir() {
  localStorage.setItem("zelar_viu_explicacao", "1");
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = "../3-selecionar-atendimento/index.html";
  }, 350);
}

btnProximo.addEventListener("click", () => {
  if (atual < slides.length - 1) {
    atual++;
    mostrar(atual);
  } else {
    concluir();
  }
});

pular.addEventListener("click", (e) => {
  e.preventDefault();
  concluir();
});

mostrar(0);