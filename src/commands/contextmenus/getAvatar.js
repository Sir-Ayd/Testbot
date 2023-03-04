const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder, Message, Permissions } = require("discord.js");

console.log('[ Command | getAvatar  ] ✅ Loaded!')

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('getAvatar')
        .setDMPermission(true)
        .setType(ApplicationCommandType.User),
    async execute(interaction, client) {
        await interaction.reply({
            content: `${interaction.targetUser.displayAvatarURL()}`
        })
    }
}
