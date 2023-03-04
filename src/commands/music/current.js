const { useQueue } = require("discord-player");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, Client } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

console.log('[ Command | current    ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('current')
        .setDescription('Shows the currently playing song.')
        .setDMPermission(false),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const queue = useQueue(interaction.guild.id)
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


        if (!queue || !queue.isPlaying()) {
            embed
                .setTitle("Nothing is playing!")
                .setImage("https://media.giphy.com/media/3oriff4xQ7Oq2TIgTu/giphy.gif")
            await interaction.reply({ embeds: [embed] })
        }
        const track = queue.currentTrack
        const progress = queue.node.createProgressBar()

        await interaction.reply({
            embeds: [embed
                .setTitle("Now Playing:")
                .setFields(
                    { name: "Duration", value: `${progress}` }
                )
                .setDescription(`**[${track.title}](${track.url})** has been added to the Queue`)
                .setThumbnail(track.thumbnail)
            ], components: [new ActionRowBuilder().addComponents(previous, queuebtn, pause, skip)]
        }).catch(error => {
            if (error) {
                return;
            }
        })
    }
}
