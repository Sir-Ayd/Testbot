const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, Client } = require("discord.js");

console.log('[ Command | shuffle      ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the queue')
        .setDMPermission(false),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const queue = client.player.getQueue(interaction.guild);
        if (!queue || !queue.playing) {
            return
        }
        await queue.shuffle();
        embed
            .setTitle("shuffling")
            .setDescription(`queue has been shuffled`)
        await interaction.reply({
            embeds: [embed]
        }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
            if (error) {
                return;
            }
        })
    }
}

