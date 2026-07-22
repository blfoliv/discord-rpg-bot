import { SlashCommandBuilder } from 'discord.js';
import { createPlayer, playerExists } from '../database/player.js';
import { createWelcomeEmbed, createErrorEmbed } from '../embeds/statusEmbed.js';

// Define o comando /registrar
const command = {
  data: new SlashCommandBuilder()
    .setName('registrar')
    .setDescription('Registra você como um novo jogador'),

  /**
   * Executa o comando de registro
   * @param {Object} interaction - Interação do Discord
   */
  async execute(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;

    try {
      // Verifica se o jogador já existe
      const exists = await playerExists(userId);

      if (exists) {
        const errorEmbed = createErrorEmbed('Você já está registrado!');
        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
        return;
      }

      // Cria o novo jogador
      await createPlayer(userId, username);

      // Envia embed de boas-vindas
      const welcomeEmbed = createWelcomeEmbed(username);
      await interaction.reply({
        embeds: [welcomeEmbed],
      });
    } catch (error) {
      console.error('Erro ao registrar jogador:', error);
      const errorEmbed = createErrorEmbed('Erro ao registrar. Tente novamente mais tarde.');
      await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }
  },
};

export default command;
