import { EmbedBuilder } from 'discord.js';

/**
 * Cria um embed com o status do jogador
 * @param {Object} player - Dados do jogador
 * @returns {EmbedBuilder} - Embed formatado
 */
export function createStatusEmbed(player) {
  return new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle(`📊 Status de ${player.username}`)
    .addFields(
      { name: '⚔️ Potência', value: `${player.potencia}`, inline: true },
      { name: '🎯 Destreza', value: `${player.destreza}`, inline: true },
      { name: '🛡️ Sustento', value: `${player.sustento}`, inline: true },
      { name: '✨ Essência', value: `${player.essencia}`, inline: true },
      { name: '⭐ Pontos Livres', value: `${player.pontos_livres}`, inline: true }
    )
    .setFooter({ text: 'Use /upar para aumentar seus atributos!' });
}

/**
 * Cria um embed de sucesso ao registrar um jogador
 * @param {string} username - Nome do usuário
 * @returns {EmbedBuilder} - Embed formatado
 */
export function createWelcomeEmbed(username) {
  return new EmbedBuilder()
    .setColor(0x3498db)
    .setTitle('✨ Bem-vindo ao RPG!')
    .setDescription(`Olá ${username}! Você foi registrado com sucesso!`)
    .addFields(
      { name: '📊 Seus Atributos Iniciais', value: 'Todos os atributos começam em **5**' },
      { name: '⭐ Pontos Livres', value: 'Você recebeu **5 pontos livres** para aumentar seus atributos' },
      { name: '📚 Como começar?', value: 'Use `/upar` para aumentar seus atributos ou `/treinar` para ganhar pontos!' }
    )
    .setFooter({ text: 'Boa sorte em sua jornada!' });
}

/**
 * Cria um embed de erro
 * @param {string} mensagem - Mensagem de erro
 * @returns {EmbedBuilder} - Embed formatado
 */
export function createErrorEmbed(mensagem) {
  return new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle('❌ Erro')
    .setDescription(mensagem);
}

/**
 * Cria um embed de sucesso
 * @param {string} titulo - Título da mensagem
 * @param {string} descricao - Descrição da mensagem
 * @returns {EmbedBuilder} - Embed formatado
 */
export function createSuccessEmbed(titulo, descricao) {
  return new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle(`✅ ${titulo}`)
    .setDescription(descricao);
}
