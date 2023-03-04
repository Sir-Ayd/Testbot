const { QueryType } = require("discord-player");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, Client } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { execute } = require("./play");

console.log('[ Command | current    ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Shows the currently playing song.')
        .setDMPermission(false)
        .addNumberOption(option => option.setName('minutes').setDescription('The amount of time to seek').setRequired(false))
        .addNumberOption(option => option.setName('seconds').setDescription('The amount of time to seek').setRequired(false)),
    async execute(interaction, client) {
        const { options } = interaction;
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const queue = client.player.getQueue(interaction.guildId)
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


        if (!queue || !queue.playing) {
            embed
                .setTitle("Nothing is playing!")
                .setImage("https://media.giphy.com/media/3oriff4xQ7Oq2TIgTu/giphy.gif")
            await interaction.reply({ embeds: [embed] })
            setTimeout(() => interaction.deleteReply(), 7500)
            return;
        }
        const secondsMs = options.getNumber('seconds')
        const minutesMs = options.getNumber('minutes')
        const seconds = secondsMs * 1000
        const minutes = minutesMs * 1000 * 60
        const seekTime = minutes + seconds
        queue.seek(seekTime)
        const currentSong = queue.current
        const progress = queue.createProgressBar()

        await interaction.reply({
            embeds: [embed
                .setTitle("Seeking to:")
                .setFields(
                    { name: "Duration", value: `${progress}` }
                )
                .setDescription(`**[${currentSong.title}](${currentSong.url})** has been added to the Queue`)
                .setImage(currentSong.thumbnail)
            ], components: [new ActionRowBuilder().addComponents(previous, queuebtn, pause, skip)]
        }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
            if (error) {
                return;
            }
        })
    }
}
