import { getDatabase } from './init.js';

/**
 * Cria um novo jogador no banco de dados
 * @param {string} userId - ID do usuário Discord
 * @param {string} username - Nome do usuário Discord
 * @returns {Promise<Object>} - Dados do jogador criado
 */
export async function createPlayer(userId, username) {
  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO players (user_id, username, potencia, destreza, sustento, essencia, pontos_livres)
       VALUES (?, ?, 5, 5, 5, 5, 5)`,
      [userId, username],
      function (err) {
        if (err) reject(err);
        else {
          resolve({
            user_id: userId,
            username,
            potencia: 5,
            destreza: 5,
            sustento: 5,
            essencia: 5,
            pontos_livres: 5,
          });
        }
      }
    );
  });
}

/**
 * Obtém os dados de um jogador
 * @param {string} userId - ID do usuário Discord
 * @returns {Promise<Object|null>} - Dados do jogador ou null
 */
export async function getPlayer(userId) {
  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM players WHERE user_id = ?',
      [userId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
}

/**
 * Verifica se um jogador existe
 * @param {string} userId - ID do usuário Discord
 * @returns {Promise<boolean>} - True se existe, false caso contrário
 */
export async function playerExists(userId) {
  const player = await getPlayer(userId);
  return player !== null;
}

/**
 * Aumenta um atributo do jogador
 * @param {string} userId - ID do usuário Discord
 * @param {string} attribute - Nome do atributo (potencia, destreza, sustento, essencia)
 * @param {number} amount - Quantidade a aumentar
 * @returns {Promise<Object>} - Dados atualizados do jogador
 */
export async function increaseAttribute(userId, attribute, amount) {
  const db = await getDatabase();
  const validAttributes = ['potencia', 'destreza', 'sustento', 'essencia'];

  if (!validAttributes.includes(attribute)) {
    throw new Error(`Atributo inválido: ${attribute}`);
  }

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE players SET ${attribute} = ${attribute} + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
      [amount, userId],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        getPlayer(userId).then(resolve).catch(reject);
      }
    );
  });
}

/**
 * Diminui Pontos Livres do jogador
 * @param {string} userId - ID do usuário Discord
 * @param {number} amount - Quantidade a diminuir
 * @returns {Promise<Object>} - Dados atualizados do jogador
 */
export async function decreasePoints(userId, amount) {
  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE players SET pontos_livres = pontos_livres - ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [amount, userId],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        getPlayer(userId).then(resolve).catch(reject);
      }
    );
  });
}

/**
 * Aumenta Pontos Livres do jogador
 * @param {string} userId - ID do usuário Discord
 * @param {number} amount - Quantidade a aumentar
 * @returns {Promise<Object>} - Dados atualizados do jogador
 */
export async function increasePoints(userId, amount) {
  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE players SET pontos_livres = pontos_livres + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [amount, userId],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        getPlayer(userId).then(resolve).catch(reject);
      }
    );
  });
}

/**
 * Define um atributo para um valor específico
 * @param {string} userId - ID do usuário Discord
 * @param {string} attribute - Nome do atributo
 * @param {number} value - Novo valor do atributo
 * @returns {Promise<Object>} - Dados atualizados do jogador
 */
export async function setAttribute(userId, attribute, value) {
  const db = await getDatabase();
  const validAttributes = ['potencia', 'destreza', 'sustento', 'essencia', 'pontos_livres'];

  if (!validAttributes.includes(attribute)) {
    throw new Error(`Atributo inválido: ${attribute}`);
  }

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE players SET ${attribute} = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
      [value, userId],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        getPlayer(userId).then(resolve).catch(reject);
      }
    );
  });
}

/**
 * Reseta todos os atributos do jogador para os valores padrão
 * @param {string} userId - ID do usuário Discord
 * @returns {Promise<Object>} - Dados atualizados do jogador
 */
export async function resetPlayer(userId) {
  const db = await getDatabase();

  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE players SET potencia = 5, destreza = 5, sustento = 5, essencia = 5, pontos_livres = 5, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?`,
      [userId],
      function (err) {
        if (err) {
          reject(err);
          return;
        }
        getPlayer(userId).then(resolve).catch(reject);
      }
    );
  });
}
