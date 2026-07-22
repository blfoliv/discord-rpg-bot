import { getDatabase } from './init.js';

/**
 * Registra o tempo de treino de um atributo
 * @param {string} userId - ID do usuário Discord
 * @param {string} attribute - Nome do atributo
 * @returns {Promise<void>}
 */
export async function setTrainingCooldown(userId, attribute) {
  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO training_cooldowns (user_id, attribute, last_trained)
       VALUES (?, ?, CURRENT_TIMESTAMP)`,
      [userId, attribute],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

/**
 * Verifica se um atributo está em cooldown
 * @param {string} userId - ID do usuário Discord
 * @param {string} attribute - Nome do atributo
 * @returns {Promise<boolean>} - True se em cooldown, false caso contrário
 */
export async function isOnCooldown(userId, attribute) {
  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    db.get(
      `SELECT last_trained FROM training_cooldowns WHERE user_id = ? AND attribute = ?`,
      [userId, attribute],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          resolve(false);
          return;
        }

        const lastTrained = new Date(row.last_trained);
        const now = new Date();
        const diffInHours = (now - lastTrained) / (1000 * 60 * 60);

        resolve(diffInHours < 24);
      }
    );
  });
}

/**
 * Obtém o tempo restante do cooldown em horas
 * @param {string} userId - ID do usuário Discord
 * @param {string} attribute - Nome do atributo
 * @returns {Promise<number>} - Horas restantes de cooldown
 */
export async function getCooldownTimeRemaining(userId, attribute) {
  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    db.get(
      `SELECT last_trained FROM training_cooldowns WHERE user_id = ? AND attribute = ?`,
      [userId, attribute],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          resolve(0);
          return;
        }

        const lastTrained = new Date(row.last_trained);
        const now = new Date();
        const diffInHours = (now - lastTrained) / (1000 * 60 * 60);
        const remaining = Math.max(0, 24 - diffInHours);

        resolve(remaining);
      }
    );
  });
}
