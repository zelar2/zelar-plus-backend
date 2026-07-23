// ===== DADOS MOCK =====
const atendimentosMock = [
  {
    id: 1,
    servico: "Consulta Médica Domiciliar",
    categoria: "Médico",
    status: "concluido",
    data: "2026-07-20",
    hora: "14:30",
    endereco: "Rua das Flores, 123 - Centro",
    profissional: { nome: "Dr. Carlos Silva", categoria: "Clínico Geral", avatar: "CS" },
    valor: 450.00,
    tipo: "presencial",
    avaliacao: 5,
    relatorio: "Paciente estável. Medicação ajustada. Retorno em 30 dias."
  },
  {
    id: 2,
    servico: "Teleconsulta Médica",
    categoria: "Médico",
    status: "concluido",
    data: "2026-07-15",
    hora: "10:00",
    endereco: "Online (Vídeo)",
    profissional: { nome: "Dra. Ana Paula", categoria: "Cardiologista", avatar: "AP" },
    valor: 300.00,
    tipo: "video",
    avaliacao: 4,
    relatorio: "Eletrocardiograma normal. Manter medicação atual."
  },
  {
    id: 3,
    servico: "Higiene e Conforto do Paciente",
    categoria: "Auxiliar de Enfermagem",
    status: "andamento",
    data: "2026-07-23",
    hora: "16:00",
    endereco: "Av. Brasil, 500 - Jardim",
    profissional: { nome: "Maria Oliveira", categoria: "Auxiliar de Enfermagem", avatar: "MO" },
    valor: 60.00,
    tipo: "presencial",
    avaliacao: null,
    relatorio: null
  },
  {
    id: 4,
    servico: "Avaliação Fonoaudiológica",
    categoria: "Fonoaudiólogo",
    status: "agendado",
    data: "2026-07-25",
    hora: "09:00",
    endereco: "Rua do Sol, 78 - Vila Nova",
    profissional: { nome: "João Pedro", categoria: "Fonoaudiólogo", avatar: "JP" },
    valor: 160.00,
    tipo: "presencial",
    avaliacao: null,
    relatorio: null
  },
  {
    id: 5,
    servico: "Troca de Curativos Simples",
    categoria: "Auxiliar de Enfermagem",
    status: "cancelado",
    data: "2026-07-10",
    hora: "11:00",
    endereco: "Rua das Palmeiras, 45 - Centro",
    profissional: { nome: "Luciana Costa", categoria: "Auxiliar de Enfermagem", avatar: "LC" },
    valor: 70.00,
    tipo: "presencial",
    avaliacao: null,
    relatorio: null
  }
];

// ===== ESTADO =====
let filtroAtual = "todos";
let atendimentos = [];

// ===== CONSTANTES =====
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const STATUS_LABELS = {
  concluido: "Concluído",
  cancelado: "Cancelado",
  andamento: "Em andamento",
  agendado: "Agendado"
};

const STORAGE_KEY = "zelar_historico";

// ===== INICIALIZAÇÃO =====
document.addEventListener("DOMContentLoaded", () => {
  carregarDados();
  setupFiltros();
  setupModal();
});

// ===== CARREGAMENTO DE DADOS =====
function carregarDados() {
  const dadosLocais = localStorage.getItem(STORAGE_KEY);
  if (dadosLocais) {
    try {
      atendimentos = JSON.parse(dadosLocais);
    } catch {
      atendimentos = [...atendimentosMock];
    }
  } else {
    atendimentos = [...atendimentosMock];
    salvar();
  }
  renderizar();
}

// ===== RENDERIZAÇÃO =====
function renderizar() {
  const filtrados = filtroAtual === "todos"
    ? atendimentos
    : atendimentos.filter(a => a.status === filtroAtual);
  atualizarStats();
  renderizarLista(filtrados);
}

function atualizarStats() {
  const total = atendimentos.length;
  const concluidos = atendimentos.filter(a => a.status === "concluido").length;
  const gasto = atendimentos
    .filter(a => a.status === "concluido")
    .reduce((soma, a) => soma + a.valor, 0);

  const elTotal = document.getElementById("stat-total");
  const elConcluidos = document.getElementById("stat-concluidos");
  const elGasto = document.getElementById("stat-gasto");

  if (elTotal) elTotal.textContent = total;
  if (elConcluidos) elConcluidos.textContent = concluidos;
  if (elGasto) elGasto.textContent = `R$ ${gasto.toLocaleString("pt-BR")}`;
}

function renderizarLista(lista) {
  const container = document.getElementById("lista-atendimentos");
  if (!container) return;

  if (lista.length === 0) {
    container.innerHTML = renderVazio();
    return;
  }

  const grupos = agruparPorMes(lista);
  let html = "";

  for (const [mes, items] of Object.entries(grupos)) {
    html += `<div class="secao-titulo">${mes}</div>`;
    items.forEach(a => { html += renderCard(a); });
  }

  container.innerHTML = html;
}

function renderVazio() {
  const filtroTexto = filtroAtual !== "todos" ? "com este filtro" : "";
  return `
    <div class="vazio-glass">
      <svg class="icone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      <h3>Nenhum atendimento encontrado</h3>
      <p>Você ainda não tem atendimentos ${filtroTexto}.</p>
      <a href="../3-selecionar-atendimento/index.html" class="botao pq" style="width:auto;display:inline-block;">Solicitar atendimento</a>
    </div>
  `;
}

function agruparPorMes(lista) {
  const grupos = {};
  const ordenada = [...lista].sort((a, b) => new Date(b.data) - new Date(a.data));

  ordenada.forEach(a => {
    const d = new Date(a.data + "T12:00:00");
    const chave = `${MESES[d.getMonth()]} ${d.getFullYear()}`;
    if (!grupos[chave]) grupos[chave] = [];
    grupos[chave].push(a);
  });

  return grupos;
}

function renderCard(a) {
  const dataFmt = new Date(a.data + "T12:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short"
  });

  const stars = a.avaliacao
    ? "★".repeat(a.avaliacao) + "☆".repeat(5 - a.avaliacao)
    : "";

  return `
    <div class="card-lista status-${a.status}" onclick="abrirDetalhes(${a.id})">
      <div class="card-topo">
        <div class="card-titulo">${a.servico}</div>
        <span class="card-badge">${STATUS_LABELS[a.status]}</span>
      </div>
      <div class="card-detalhes">
        <div class="info-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          ${dataFmt} às ${a.hora}
        </div>
        <div class="info-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          ${a.endereco}
        </div>
        <div class="prof-row">
          <div class="avatar-mini">${a.profissional.avatar}</div>
          <div class="prof-info-mini">
            <div class="nome">${a.profissional.nome}</div>
            <div class="cat">${a.profissional.categoria}</div>
          </div>
          <div class="card-valor">R$ ${formatarValor(a.valor)}</div>
        </div>
        ${a.avaliacao ? `<div class="info-row estrelas">${stars}</div>` : ""}
      </div>
    </div>
  `;
}

// ===== FILTROS =====
function setupFiltros() {
  document.querySelectorAll(".filtro-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filtro-pill").forEach(b => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      filtroAtual = btn.dataset.filtro;
      renderizar();
    });
  });
}

// ===== MODAL =====
function setupModal() {
  const modal = document.getElementById("modal-detalhes");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("visivel");
      }
    });
  }
}

function abrirDetalhes(id) {
  const a = atendimentos.find(x => x.id === id);
  if (!a) return;

  const dataFmt = new Date(a.data + "T12:00:00").toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  const botoes = renderBotoesModal(a);

  const modalBody = document.getElementById("modal-body");
  if (modalBody) {
    modalBody.innerHTML = `
      <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:4px;">${a.servico}</div>
      <div style="font-size:13px;color:var(--texto-suave);margin-bottom:20px;">${STATUS_LABELS[a.status]} • ${dataFmt}</div>

      <div class="detalhe-bloco">
        <div class="detalhe-label">Profissional</div>
        <div class="detalhe-box">
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="avatar-mini" style="width:44px;height:44px;font-size:16px;">${a.profissional.avatar}</div>
            <div>
              <div style="font-weight:600;color:#fff;">${a.profissional.nome}</div>
              <div style="font-size:13px;color:var(--texto-desabilitado);">${a.profissional.categoria}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="detalhe-bloco">
        <div class="detalhe-label">Data e hora</div>
        <div class="detalhe-valor">${dataFmt} às ${a.hora}</div>
      </div>

      <div class="detalhe-bloco">
        <div class="detalhe-label">Endereço</div>
        <div class="detalhe-valor">${a.endereco}</div>
      </div>

      <div class="detalhe-bloco">
        <div class="detalhe-label">Valor</div>
        <div class="detalhe-valor" style="font-size:20px;font-weight:700;color:var(--acento);">
          R$ ${formatarValor(a.valor)}
        </div>
      </div>

      ${a.relatorio ? `
      <div class="detalhe-bloco">
        <div class="detalhe-label">Relatório médico</div>
        <div class="detalhe-box">
          <div class="detalhe-valor">${a.relatorio}</div>
        </div>
      </div>` : ""}

      ${a.avaliacao ? `
      <div class="detalhe-bloco">
        <div class="detalhe-label">Sua avaliação</div>
        <div class="detalhe-valor" style="color:var(--aviso);font-size:18px;">
          ${"★".repeat(a.avaliacao)}${"☆".repeat(5 - a.avaliacao)}
        </div>
      </div>` : ""}

      ${botoes}
    `;
  }

  const modal = document.getElementById("modal-detalhes");
  if (modal) modal.classList.add("visivel");
}

function renderBotoesModal(a) {
  if (a.status === "concluido" && !a.avaliacao) {
    return `
      <div class="botoes-acao">
        <button class="btn-acao primario" onclick="avaliar(${a.id})">Avaliar atendimento</button>
        <button class="btn-acao secundario" onclick="verRelatorio(${a.id})">Ver relatório</button>
      </div>`;
  }

  if (a.status === "andamento") {
    return `
      <div class="botoes-acao">
        <button class="btn-acao primario" onclick="rastrear(${a.id})">Rastrear profissional</button>
        <button class="btn-acao secundario" onclick="chat(${a.id})">Enviar mensagem</button>
      </div>`;
  }

  if (a.status === "agendado") {
    return `
      <div class="botoes-acao">
        <button class="btn-acao primario" onclick="reagendar(${a.id})">Reagendar</button>
        <button class="btn-acao secundario" onclick="cancelar(${a.id})" style="color:var(--perigo);">Cancelar</button>
      </div>`;
  }

  return "";
}

function fecharModal(e) {
  const modal = document.getElementById("modal-detalhes");
  if (modal && e.target === modal) {
    modal.classList.remove("visivel");
  }
}

// ===== AÇÕES DO MODAL =====
function avaliar(id) {
  mostrarToast("Abrindo avaliação...");
  setTimeout(() => {
    window.location.href = `./avaliacao.html?id=${id}`;
  }, 500);
}

function verRelatorio(id) {
  mostrarToast("Abrindo relatório...");
}

function rastrear(id) {
  mostrarToast("Abrindo mapa...");
  setTimeout(() => {
    window.location.href = `./rastreamento.html?id=${id}`;
  }, 500);
}

function chat(id) {
  mostrarToast("Abrindo chat...");
  setTimeout(() => {
    window.location.href = `./chat.html?id=${id}`;
  }, 500);
}

function reagendar(id) {
  mostrarToast("Abrindo reagendamento...");
}

function cancelar(id) {
  if (confirm("Tem certeza que deseja cancelar este atendimento?")) {
    mostrarToast("Atendimento cancelado");
    fecharModalAtivo();
    const idx = atendimentos.findIndex(a => a.id === id);
    if (idx >= 0) {
      atendimentos[idx].status = "cancelado";
      salvar();
      renderizar();
    }
  }
}

function fecharModalAtivo() {
  const modal = document.getElementById("modal-detalhes");
  if (modal) modal.classList.remove("visivel");
}

// ===== NAVEGAÇÃO =====
function voltar() {
  document.body.classList.add("fade-out");
  setTimeout(() => {
    window.location.href = "../3-selecionar-atendimento/index.html";
  }, 300);
}

// ===== UTILITÁRIOS =====
function formatarValor(valor) {
  return valor.toFixed(2).replace(".", ",");
}

function mostrarToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("visivel");
  setTimeout(() => t.classList.remove("visivel"), 2500);
}

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(atendimentos));
}

// ===== API PÚBLICA =====
window.ZelarHistorico = {
  adicionarAtendimento: function(atendimento) {
    atendimento.id = atendimento.id || Date.now();
    atendimentos.unshift(atendimento);
    salvar();
    renderizar();
  },
  atualizarAtendimento: function(id, dados) {
    const idx = atendimentos.findIndex(a => a.id === id);
    if (idx >= 0) {
      atendimentos[idx] = { ...atendimentos[idx], ...dados };
      salvar();
      renderizar();
    }
  },
  obterAtendimentos: function() {
    return [...atendimentos];
  },
  obterPorStatus: function(status) {
    return atendimentos.filter(a => a.status === status);
  }
};