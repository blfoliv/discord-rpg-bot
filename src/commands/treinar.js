import { SlashCommandBuilder } from 'discord.js';
import { getPlayer, playerExists, increaseAttribute } from '../database/player.js';
import { setTrainingCooldown, isOnCooldown, getCooldownTimeRemaining } from '../database/cooldown.js';
import { createErrorEmbed, createSuccessEmbed } from '../embeds/statusEmbed.js';
import { isValidAttribute, formatAttributeName } from '../utils/validators.js';

// Define o comando /treinar
const command = {
  data: new SlashCommandBuilder()
    .setName('treinar')
    .setDescription('Treina um atributo para ganhar pontos aleatórios')
    .addStringOption((option) =>
      option
        .setName('atributo')
        .setDescription('Qual atributo deseja treinar?')
        .setRequired(true)
        .addChoices(
          { name: 'Potência', value: 'potencia' },
          { name: 'Destreza', value: 'destreza' },
          { name: 'Sustento', value: 'sustento' },
          { name: 'Essência', value: 'essencia' }
        )
    ),

  /**
   * Executa o comando de treinar
   * @param {Object} interaction - Interação do Discord
   */
  async execute(interaction) {
    const userId = interaction.user.id;
    const attribute = interaction.options.getString('atributo');

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

      // Verifica se o atributo está em cooldown
      const onCooldown = await isOnCooldown(userId, attribute);

      if (onCooldown) {
        const remaining = await getCooldownTimeRemaining(userId, attribute);
        const hours = Math.floor(remaining);
        const minutes = Math.floor((remaining % 1) * 60);

        const errorEmbed = createErrorEmbed(
          `Você já treinou esse atributo! Volte em ${hours}h ${minutes}m.`
        );
        await interaction.reply({
          embeds: [errorEmbed],
          ephemeral: true,
        });
        return;
      }

      // Gera um ganho aleatório entre 1 e 5
      const gainedPoints = Math.floor(Math.random() * 5) + 1;

      // Aumenta o atributo
      await increaseAttribute(userId, attribute, gainedPoints);

      // Registra o cooldown
      await setTrainingCooldown(userId, attribute);

      // Obtém os dados atualizados
      const player = await getPlayer(userId);

      // Cria embed de sucesso
      const successEmbed = createSuccessEmbed(
        'Treino Completo!',
        `Você treinou **${formatAttributeName(attribute)}** e ganhou **${gainedPoints}** pontos!\n\n${formatAttributeName(attribute)}: **${player[attribute]}**\n\n⏰ Próximo treino disponível em 24 horas.`
      );

      await interaction.reply({
        embeds: [successEmbed],
      });
    } catch (error) {
      console.error('Erro ao treinar:', error);
      const errorEmbed = createErrorEmbed('Erro ao treinar. Tente novamente mais tarde.');
      await interaction.reply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }
  },
};

export default command;
