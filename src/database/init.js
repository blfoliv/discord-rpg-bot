import sqlite3 from 'sqlite3';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'players.db');
let db;

/**
 * Obtém a instância do banco de dados
 * @returns {Promise<sqlite3.Database>} - Banco de dados SQLite
 */
export function getDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    db = new sqlite3.Database(dbPath, (err) => {
      if (err) reject(err);
      else resolve(db);
    });
  });
}

/**
 * Inicializa o banco de dados com as tabelas necessárias
 */
export function initializeDatabase() {
  return new Promise((resolve, reject) => {
    sqlite3.verbose();

    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Cria tabela de jogadores
      db.run(
        `
        CREATE TABLE IF NOT EXISTS players (
          user_id TEXT PRIMARY KEY,
          username TEXT NOT NULL,
          potencia INTEGER DEFAULT 5,
          destreza INTEGER DEFAULT 5,
          sustento INTEGER DEFAULT 5,
          essencia INTEGER DEFAULT 5,
          pontos_livres INTEGER DEFAULT 5,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `,
        (err) => {
          if (err) {
            reject(err);
            return;
          }

          // Cria tabela de cooldowns de treino
          db.run(
            `
            CREATE TABLE IF NOT EXISTS training_cooldowns (
              user_id TEXT NOT NULL,
              attribute TEXT NOT NULL,
              last_trained DATETIME NOT NULL,
              PRIMARY KEY (user_id, attribute),
              FOREIGN KEY (user_id) REFERENCES players(user_id)
            )
            `,
            (err) => {
              if (err) reject(err);
              else resolve();
            }
          );
        }
      );
    });
  });
}
