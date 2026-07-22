/**
 * Evento disparado quando o bot está pronto
 */
const event = {
  name: 'ready',
  once: true,

  /**
   * Executa quando o bot está pronto
   * @param {Object} client - Cliente do Discord
   */
  execute(client) {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
    console.log(`📊 Conectado em ${client.guilds.cache.size} servidor(es)`);

    // Define status do bot
    client.user.setActivity('RPG', {
      type: 'WATCHING',
    });
  },
};

export default event;
