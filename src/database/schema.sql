-- ZELAR+ — Esquema do banco de dados (SQLite)

CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  cpf TEXT,
  telefone TEXT,
  tipo TEXT NOT NULL DEFAULT 'cliente', -- cliente | profissional | admin
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS profissionais (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  nome TEXT NOT NULL,
  cpf TEXT,
  telefone TEXT,
  categoria TEXT NOT NULL,
  conselho TEXT,
  conselho_numero TEXT,
  uf TEXT,
  banco TEXT,
  agencia TEXT,
  conta TEXT,
  pix TEXT,
  foto TEXT,
  status TEXT NOT NULL DEFAULT 'pendente', -- pendente | aprovado | recusado
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS documentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profissional_id INTEGER NOT NULL,
  tipo TEXT NOT NULL, -- identidade | conselho | comprovante
  arquivo TEXT NOT NULL,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (profissional_id) REFERENCES profissionais(id)
);

CREATE TABLE IF NOT EXISTS atendimentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  profissional_id INTEGER,
  servico TEXT NOT NULL,
  categoria TEXT,
  tipo TEXT NOT NULL DEFAULT 'presencial', -- presencial | video
  endereco TEXT,
  data TEXT,
  hora TEXT,
  valor REAL,
  status TEXT NOT NULL DEFAULT 'solicitado', -- solicitado | confirmado | concluido | cancelado
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (profissional_id) REFERENCES profissionais(id)
);

CREATE TABLE IF NOT EXISTS solicitacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER,
  categoria TEXT NOT NULL,
  servico TEXT NOT NULL,
  endereco TEXT,
  detalhes TEXT,
  status TEXT NOT NULL DEFAULT 'aberta', -- aberta | aceita | recusada | concluida
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS recuperacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  token TEXT NOT NULL,
  expira_em TEXT NOT NULL,
  usado INTEGER NOT NULL DEFAULT 0,
  criado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_profissionais_categoria ON profissionais(categoria);
CREATE INDEX IF NOT EXISTS idx_atendimentos_usuario ON atendimentos(usuario_id);