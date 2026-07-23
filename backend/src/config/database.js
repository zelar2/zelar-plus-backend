// ZELAR+ — Conexão com o banco (SQLite)
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, "..", "..");

const DB_FILE = process.env.DB_FILE
  ? path.resolve(backendDir, process.env.DB_FILE)
  : path.join(backendDir, "database", "zelar.db");

let db = null;

export async function conectar() {
  if (db) return db;

  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

  db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database
  });

  await db.exec("PRAGMA foreign_keys = ON;");
  await migrar(db);
  return db;
}

async function migrar(conexao) {
  const schemaPath = path.join(backendDir, "src", "database", "schema.sql");
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, "utf-8");
    await conexao.exec(schema);
  }
}

export async function obterDB() {
  return conectar();
}

export default conectar;