/**
 * Verifica se um usuário é administrador
 * @param {Object} interaction - Interação do Discord
 * @returns {boolean} - True se é admin, false caso contrário
 */
export function isAdmin(interaction) {
  return (
    interaction.member.permissions.has('Administrator') ||
    interaction.user.id === interaction.guild.ownerId
  );
}

/**
 * Verifica permissão de admin e retorna embed de erro se não tiver
 * @param {Object} interaction - Interação do Discord
 * @param {Object} errorEmbed - Embed de erro a enviar
 * @returns {Promise<boolean>} - True se tem permissão, false caso contrário
 */
export async function checkAdminPermission(interaction, errorEmbed) {
  if (!isAdmin(interaction)) {
    await interaction.reply({
      embeds: [errorEmbed],
      ephemeral: true,
    });
    return false;
  }
  return true;
}
