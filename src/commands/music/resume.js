const { QueryType } = require("discord-player");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, Client } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { execute } = require("./play");

console.log('[ Command | resume     ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resuming the current song')
        .setDMPermission(false),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const queue = client.player.getQueue(interaction.guild);
        const skip = new ButtonBuilder()
            .setCustomId('skip')
            .setLabel('Skip')
            .setStyle(ButtonStyle.Success);
        const queuebtn = new ButtonBuilder()
            .setCustomId('queue')
            .setLabel('Queue')
            .setStyle(ButtonStyle.Success);
        const pause = new ButtonBuilder()
            .setCustomId('pause')
            .setLabel('Pause')
            .setStyle(ButtonStyle.Danger);
        const previous = new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Success);
        if (!queue) {
            embed
                .setTitle("Can't resume")
                .setDescription(`No song in queue`)
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
        }
        queue.setPaused(false);
        const currentSong = queue.current
        const progress = queue.createProgressBar()
        embed
            .setTitle("Resuming...")
            .setDescription(`Resumed **${currentSong.title}**`)
            .setFields(
                { name: "Duration", value: `${progress}` }
            )
            .setImage(currentSong.thumbnail)
        await interaction.reply({
            embeds: [embed], components: [new ActionRowBuilder().addComponents(previous, queuebtn, pause, skip)]
        }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
            if (error) {
                return;
            }
        })
    }
}