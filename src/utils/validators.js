/**
 * Valida se um atributo é válido
 * @param {string} attribute - Nome do atributo
 * @returns {boolean} - True se válido, false caso contrário
 */
export function isValidAttribute(attribute) {
  const validAttributes = ['potencia', 'destreza', 'sustento', 'essencia'];
  return validAttributes.includes(attribute.toLowerCase());
}

/**
 * Formata o nome do atributo para exibição
 * @param {string} attribute - Nome do atributo
 * @returns {string} - Nome formatado com emoji
 */
export function formatAttributeName(attribute) {
  const attrs = {
    potencia: '⚔️ Potência',
    destreza: '🎯 Destreza',
    sustento: '🛡️ Sustento',
    essencia: '✨ Essência',
  };
  return attrs[attribute.toLowerCase()] || attribute;
}

/**
 * Valida se um número é positivo
 * @param {number} value - Valor a validar
 * @returns {boolean} - True se positivo, false caso contrário
 */
export function isPositiveNumber(value) {
  return Number.isInteger(value) && value > 0;
}
