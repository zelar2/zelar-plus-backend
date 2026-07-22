// ZELAR+ — Inicialização manual do banco
// Uso: node database/init.js
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { abrirBanco } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

(async () => {
  const schema = fs.readFileSync(path.join(__dirname, "..", "src", "database", "schema.sql"), "utf-8");
  const db = await abrirBanco();
  await db.exec("PRAGMA foreign_keys = ON;");
  await db.exec(schema);
  const tabelas = await db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log("Banco inicializado em database/zelar.db");
  console.log("Tabelas:", tabelas.map((t) => t.name).join(", "));
  await db.close();
})();