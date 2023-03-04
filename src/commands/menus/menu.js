const { SlashCommandBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ActionRowBuilder, EmbedBuilder, Message, Permissions } = require("discord.js");

console.log('[ Command | menu       ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Returns a menu')
        .setDMPermission(false),

    async execute(interaction, client) {
        const menu = new SelectMenuBuilder()
            .setCustomId(`sub-menu`)
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(new SelectMenuOptionBuilder({
                label: `Option #1`,
                value: `http://www.youtube.com/`
            }), 
            new SelectMenuOptionBuilder({
                label: `Option #2`,
                value: `http://www.patreon.com/`
            }));

        await interaction.reply({
            components: [new ActionRowBuilder().addComponents(menu)]
        })
    }
}
