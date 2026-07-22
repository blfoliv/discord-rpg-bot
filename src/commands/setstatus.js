import { SlashCommandBuilder } from 'discord.js';
import { getPlayer, setAttribute } from '../database/player.js';
import { createErrorEmbed, createSuccessEmbed } from '../embeds/statusEmbed.js';
import { isAdmin, checkAdminPermission } from '../utils/permissions.js';
import { formatAttributeName } from '../utils/validators.js';

// Define o comando /setstatus
const command = {
  data: new SlashCommandBuilder()
    .setName('setstatus')
    .setDescription('[ADMIN] Define um atributo de um jogador')
    .addUserOption((option) =>
      option.setName('jogador').setDescription('Qual jogador?').setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('atributo')
        .setDescription('Qual atributo deseja definir?')
        .setRequired(true)
        .addChoices(
          { name: 'Potência', value: 'potencia' },
          { name: 'Destreza', value: 'destreza' },
          { name: 'Sustento', value: 'sustento' },
          { name: 'Essência', value: 'essencia' },
          { name: 'Pontos Livres', value: 'pontos_livres' }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName('valor')
        .setDescription('Qual é o novo valor?')
        .setRequired(true)
        .setMinValue(0)
    ),

  /**
   * Executa o comando de definir atributo
   * @param {Object} interaction - Interação do Discord
   */
  async execute(interaction) {
    const errorEmbed = createErrorEmbed('Apenas administradores podem usar este comando!');

    // Verifica se é admin
    if (!(await checkAdminPermission(interaction, errorEmbed))) {
      return;
    }

    const targetUser = interaction.options.getUser('jogador');
    const attribute = interaction.options.getString('atributo');
    const value = interaction.options.getInteger('valor');
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

      // Define o novo valor
      await setAttribute(targetUserId, attribute, value);
      const updatedPlayer = await getPlayer(targetUserId);

      // Cria embed de sucesso
      const successEmbed = createSuccessEmbed(
        'Atributo Alterado!',
        `**${formatAttributeName(attribute)}** de **${targetUser.username}** foi definido para **${value}**`
      );

      await interaction.reply({
        embeds: [successEmbed],
      });
    } catch (error) {
      console.error('Erro ao definir atributo:', error);
      const errorEmbed = createErrorEmbed('Erro ao definir atributo. Tente novamente mais tarde.');
      await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }
  },
};

export default command;
