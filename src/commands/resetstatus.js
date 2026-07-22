import { SlashCommandBuilder } from 'discord.js';
import { getPlayer, resetPlayer } from '../database/player.js';
import { createErrorEmbed, createSuccessEmbed } from '../embeds/statusEmbed.js';
import { checkAdminPermission } from '../utils/permissions.js';

// Define o comando /resetstatus
const command = {
  data: new SlashCommandBuilder()
    .setName('resetstatus')
    .setDescription('[ADMIN] Reseta os atributos de um jogador')
    .addUserOption((option) =>
      option.setName('jogador').setDescription('Qual jogador?').setRequired(true)
    ),

  /**
   * Executa o comando de resetar atributos
   * @param {Object} interaction - Interação do Discord
   */
  async execute(interaction) {
    const errorEmbed = createErrorEmbed('Apenas administradores podem usar este comando!');

    // Verifica se é admin
    if (!(await checkAdminPermission(interaction, errorEmbed))) {
      return;
    }

    const targetUser = interaction.options.getUser('jogador');
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

      // Reseta os atributos
      await resetPlayer(targetUserId);
      const resetedPlayer = await getPlayer(targetUserId);

      // Cria embed de sucesso
      const successEmbed = createSuccessEmbed(
        'Status Resetado!',
        `**${targetUser.username}** teve seus atributos resetados para os valores padrão!\n\n⚔️ Potência: 5\n🎯 Destreza: 5\n🛡️ Sustento: 5\n✨ Essência: 5\n⭐ Pontos Livres: 5`
      );

      await interaction.reply({
        embeds: [successEmbed],
      });
    } catch (error) {
      console.error('Erro ao resetar status:', error);
      const errorEmbed = createErrorEmbed('Erro ao resetar status. Tente novamente mais tarde.');
      await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }
  },
};

export default command;
