import { SlashCommandBuilder } from 'discord.js';
import { getPlayer, playerExists, increaseAttribute, decreasePoints } from '../database/player.js';
import { createErrorEmbed, createSuccessEmbed } from '../embeds/statusEmbed.js';
import { isValidAttribute, formatAttributeName } from '../utils/validators.js';

// Define o comando /upar
const command = {
  data: new SlashCommandBuilder()
    .setName('upar')
    .setDescription('Aumenta um atributo usando Pontos Livres')
    .addStringOption((option) =>
      option
        .setName('atributo')
        .setDescription('Qual atributo deseja aumentar?')
        .setRequired(true)
        .addChoices(
          { name: 'Potência', value: 'potencia' },
          { name: 'Destreza', value: 'destreza' },
          { name: 'Sustento', value: 'sustento' },
          { name: 'Essência', value: 'essencia' }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName('quantidade')
        .setDescription('Quantos pontos deseja gastar?')
        .setRequired(true)
        .setMinValue(1)
    ),

  /**
   * Executa o comando de upar atributo
   * @param {Object} interaction - Interação do Discord
   */
  async execute(interaction) {
    const userId = interaction.user.id;
    const attribute = interaction.options.getString('atributo');
    const amount = interaction.options.getInteger('quantidade');

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

      // Valida o atributo
      if (!isValidAttribute(attribute)) {
        const errorEmbed = createErrorEmbed('Atributo inválido!');
        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
        return;
      }

      // Obtém os dados do jogador
      let player = await getPlayer(userId);

      // Verifica se tem Pontos Livres suficientes
      if (player.pontos_livres < amount) {
        const errorEmbed = createErrorEmbed(
          `Você não tem Pontos Livres suficientes! Você tem **${player.pontos_livres}**.`
        );
        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
        return;
      }

      // Aumenta o atributo e diminui os pontos
      await increaseAttribute(userId, attribute, amount);
      await decreasePoints(userId, amount);

      // Obtém os dados atualizados
      player = await getPlayer(userId);

      // Cria embed de sucesso
      const successEmbed = createSuccessEmbed(
        'Atributo Aumentado!',
        `Você aumentou **${formatAttributeName(attribute)}** em **${amount}** pontos!\n\n⭐ Pontos Livres Restantes: **${player.pontos_livres}**`
      );

      await interaction.reply({
        embeds: [successEmbed],
      });
    } catch (error) {
      console.error('Erro ao upar atributo:', error);
      const errorEmbed = createErrorEmbed('Erro ao aumentar atributo. Tente novamente mais tarde.');
      await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }
  },
};

export default command;
