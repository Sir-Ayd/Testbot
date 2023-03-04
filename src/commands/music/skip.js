const { QueryType } = require("discord-player");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, Client } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { execute } = require("./play");

console.log('[ Command | skip       ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skipping the current song')
        .setDMPermission(false)
        .addNumberOption(option => option.setName('amount').setDescription('The position in the queue which you want to play').setRequired(true)),
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
                .setTitle("Can't skip")
                .setDescription(`No song playing`)
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
        }
        if (queue.tracks.length === 0) {
            embed
                .setTitle("No skippable songs")
            await interaction.reply({
                embeds: [embed], components: [new ActionRowBuilder().addComponents(queuebtn, pause, skip)]
            }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
        }
        const amount = interaction.options.getNumber('amount') - 1
        const queueL = queue.tracks.length
        if ((amount >= queueL)) {
            interaction.reply({ ephemeral: true, content: `The queue isn't that big` })
            return;
        }
        if ((amount <= queueL)) {
            queue.skipTo(amount)
            const nextSong = queue.tracks[0];
            const progress = queue.createProgressBar()
            embed
                .setTitle("Skipping...")
                .setDescription(`Skipped to **${nextSong.title}**`)
                .setFields(
                    { name: "Duration", value: `${progress}` }
                )
                .setImage(nextSong.thumbnail)
            await interaction.reply({
                embeds: [embed], components: [new ActionRowBuilder().addComponents(previous, queuebtn, pause, skip)]
            }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
        }
    }
}