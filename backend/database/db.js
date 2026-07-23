// ZELAR+ — Acesso direto ao banco (helper legado)
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "zelar.db");

export async function abrirBanco() {
  return open({
    filename: DB_FILE,
    driver: sqlite3.Database
  });
}

export default abrirBanco;