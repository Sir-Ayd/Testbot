const { SlashCommandBuilder, EmbedBuilder, Message, Permissions, Client } = require("discord.js");

console.log('[ Command | commands   ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('summon')
        .setDescription('Summons a boss!')
        .setDMPermission(false),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        
        await interaction.reply({ embeds: [embed] })
    }
}