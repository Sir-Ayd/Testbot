const { QueryType } = require("discord-player");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, Client } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { execute } = require("./play");

console.log('[ Command | pause      ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pausing the current song')
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
        const resume = new ButtonBuilder()
            .setCustomId('resume')
            .setLabel('Play')
            .setStyle(ButtonStyle.Danger);
        const previous = new ButtonBuilder()
            .setCustomId('previous')
            .setLabel('Previous')
            .setStyle(ButtonStyle.Success);
        if (!queue) {
            embed
                .setTitle("Can't pause")
                .setDescription(`No song playing`)
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
        }
        queue.setPaused(true);
        const currentSong = queue.current
        const progress = queue.createProgressBar()
        embed
            .setTitle("Pausing...")
            .setDescription(`Paused **${currentSong.title}**`)
            .setFields(
                { name: "Duration", value: `${progress}` }
            )
            .setImage(currentSong.thumbnail)
        await interaction.reply({
            embeds: [embed], components: [new ActionRowBuilder().addComponents(previous, resume, skip)]
        }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
            if (error) {
                return;
            }
        })
    }
}