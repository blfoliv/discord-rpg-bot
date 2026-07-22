import { SlashCommandBuilder } from 'discord.js';
import { getPlayer, increasePoints } from '../database/player.js';
import { createErrorEmbed, createSuccessEmbed } from '../embeds/statusEmbed.js';
import { isAdmin, checkAdminPermission } from '../utils/permissions.js';
import { isPositiveNumber } from '../utils/validators.js';

// Define o comando /addpontos
const command = {
  data: new SlashCommandBuilder()
    .setName('addpontos')
    .setDescription('[ADMIN] Adiciona Pontos Livres a um jogador')
    .addUserOption((option) =>
      option.setName('jogador').setDescription('Qual jogador?').setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('quantidade')
        .setDescription('Quantos pontos deseja adicionar?')
        .setRequired(true)
        .setMinValue(1)
    ),

  /**
   * Executa o comando de adicionar pontos
   * @param {Object} interaction - Interação do Discord
   */
  async execute(interaction) {
    const errorEmbed = createErrorEmbed('Apenas administradores podem usar este comando!');

    // Verifica se é admin
    if (!(await checkAdminPermission(interaction, errorEmbed))) {
      return;
    }

    const targetUser = interaction.options.getUser('jogador');
    const amount = interaction.options.getInteger('quantidade');
    const targetUserId = targetUser.id;

    try {
      // Verifica se o usuário alvo existe no banco de dados
      const player = await getPlayer(targetUserId);

      if (!player) {
        const notFoundEmbed = createErrorEmbed('Este jogador não está registrado!');
        await interaction.reply({
          embeds: [notFoundEmbed],
          ephemeral: true,
        });
        return;
      }

      // Adiciona os pontos
      const updatedPlayer = await increasePoints(targetUserId, amount);

      // Cria embed de sucesso
      const successEmbed = createSuccessEmbed(
        'Pontos Adicionados!',
        `**${targetUser.username}** recebeu **${amount}** Pontos Livres!\n\n⭐ Pontos Livres Totais: **${updatedPlayer.pontos_livres}**`
      );

      await interaction.reply({
        embeds: [successEmbed],
      });
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
      const errorEmbed = createErrorEmbed('Erro ao adicionar pontos. Tente novamente mais tarde.');
      await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }
  },
};

export default command;
