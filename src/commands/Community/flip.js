const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
let embed = new EmbedBuilder();

console.log('[ Command | flip      ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('flip')
        .setDescription('Flip a coin')
        .setDMPermission(false),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const reflip = new ButtonBuilder()
            .setCustomId('reflip')
            .setLabel('Reflip')
            .setStyle(ButtonStyle.Success);
        const x = new ButtonBuilder()
            .setCustomId('delete')
            .setLabel('X')
            .setStyle(ButtonStyle.Danger);
        function randomIntFromInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min)
        }
        const result = randomIntFromInterval(1, 2)
        if (result === 1) {
            embed.setTitle('Heads')
            interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(reflip,x)] })
            return;
        }
        if (result === 2) {
            embed.setTitle('Tails')
            interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(reflip,x)] })
            return;
        }
    }
}
