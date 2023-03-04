const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, Client } = require("discord.js");

console.log('[ Command | jump       ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jump')
        .setDescription('Jumps to song further down queue without disrupting the queue')
        .setDMPermission(false)
        .addNumberOption(option => option.setName('amount').setDescription('The position in the queue which you want to play').setRequired(true)),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const queue = client.player.getQueue(interaction.guild);
        if (!queue) {
            embed
                .setTitle("Can't jump")
                .setDescription(`Queue is empty`)
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
        }
        const amount = interaction.options.getNumber('amount')
        const nextSong = queue.tracks[amount];
        const progress = queue.createProgressBar()
        queue.jump(amount);
        embed
            .setTitle("Jumping...")
            .setDescription(`Jumped to **${nextSong.title}**`)
            .setFields(
                { name: "Duration", value: `${progress}` }
            )
            .setImage(nextSong.thumbnail)
        await interaction.reply({
            embeds: [embed]
        }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
            if (error) {
                return;
            }
        })
    }
}