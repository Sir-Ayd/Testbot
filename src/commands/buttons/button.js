const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, Permissions } = require("discord.js");

console.log('[ Command | button     ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('button')
    .setDescription('Informaion about the bot')
    .setDMPermission(false),

    async execute(interaction, client) {
        const button = new ButtonBuilder()
        .setCustomId('youtube')
        .setLabel('click me')
        .setStyle(ButtonStyle.Primary);
        await interaction.reply({
            components: [new ActionRowBuilder().addComponents(button)]
        });
    }
}
