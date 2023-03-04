const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, Message, Permissions } = require("discord.js");

console.log('[ Command | modal      ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modal')
        .setDescription('Returns a modal')
        .setDMPermission(false),

    async execute(interaction, client) {
        const modal = new ModalBuilder()
            .setCustomId(`fav-colour`)
            .setTitle(`fav colour?`)

        const textInput = new TextInputBuilder()
            .setCustomId(`favColourInput`)
            .setLabel(`What is your favorite colour?`)
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        modal.addComponents(new ActionRowBuilder().addComponents(textInput));
        await interaction.showModal(modal);
    }
}
