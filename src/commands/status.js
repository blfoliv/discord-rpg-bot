import { SlashCommandBuilder } from 'discord.js';
import { getPlayer, playerExists } from '../database/player.js';
import { createStatusEmbed, createErrorEmbed } from '../embeds/statusEmbed.js';

// Define o comando /status
const command = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Mostra seu status de atributos'),

  /**
   * Executa o comando de status
   * @param {Object} interaction - Interação do Discord
   */
  async execute(interaction) {
    const userId = interaction.user.id;

    try {
      // Verifica se o jogador existe
      const exists = await playerExists(userId);

      if (!exists) {
        const errorEmbed = createErrorEmbed('Você não está registrado! Use `/registrar` primeiro.');
        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
        return;
      }

      // Obtém os dados do jogador
      const player = await getPlayer(userId);

      // Cria e envia o embed de status
      const statusEmbed = createStatusEmbed(player);
      await interaction.reply({
        embeds: [statusEmbed],
      });
    } catch (error) {
      console.error('Erro ao buscar status:', error);
      const errorEmbed = createErrorEmbed('Erro ao buscar seu status. Tente novamente mais tarde.');
      await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }
  },
};

export default command;
