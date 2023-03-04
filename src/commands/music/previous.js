const { QueryType } = require("discord-player");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, Client } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { execute } = require("./play");

console.log('[ Command | previous   ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Skipping the current song')
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
        if (!queue) {
            embed
                .setTitle("Can't skip")
                .setDescription(`No song playing`)
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
        }
        queue.back();
        const previousSong = queue.current;
        const progress = queue.createProgressBar()
        embed
            .setTitle("Skipping...")
            .setDescription(`Went back to **${previousSong.title}**`)
            .setFields(
                { name: "Duration", value: `${progress}` }
            )
            .setImage(previousSong.thumbnail)
        await interaction.reply({
            embeds: [embed], components: [new ActionRowBuilder().addComponents(queuebtn, pause, skip)]
        }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
            if (error) {
                return;
            }
        })
    }
}