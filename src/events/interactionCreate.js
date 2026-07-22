import { InteractionType } from 'discord.js';

/**
 * Evento disparado quando uma interação é criada
 */
const event = {
  name: 'interactionCreate',
  once: false,

  /**
   * Executa quando uma interação é criada (comando slash, botão, etc)
   * @param {Object} interaction - Interação do Discord
   */
  async execute(interaction) {
    // Verifica se é um comando slash
    if (interaction.type !== InteractionType.ApplicationCommand) {
      return;
    }

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`Comando não encontrado: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Erro ao executar comando ${interaction.commandName}:`, error);

      const errorMessage = {
        content: '❌ Houve um erro ao executar este comando!',
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMessage);
      } else {
        await interaction.reply(errorMessage);
      }
    }
  },
};

export default event;
