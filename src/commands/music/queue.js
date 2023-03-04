const { useQueue } = require("discord-player");
const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message, Client } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');

console.log('[ Command | queue      ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows all songs in queue')
        .setDMPermission(false),
    async execute(interaction, client) {
        const queue = useQueue(interaction.guild.id)
        if (!queue || !queue.isPlaying()) {
            const embed = new EmbedBuilder()
                .setTitle("Not Playing")
                .setColor(0x1d8f2e)
                .setDescription(`queue is empty`)
                .setTimestamp()
                .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
            return;
        }
        await interaction.deferReply();

        let pagesNum = Math.ceil(queue.tracks.size / 5);

        if (pagesNum <= 0) {
            pagesNum = 1;
        }

        const tracks = queue.tracks.map((track, idx) => `**${++idx})** [${track.title}](${track.url})`);

        const paginatedMessage = new PaginatedMessage();

        // handle error if pages exceed 25 pages
        if (pagesNum > 25) pagesNum = 25;

        for (let i = 0; i < pagesNum; i++) {
            const list = tracks.slice(i * 5, i * 5 + 5).join('\n');

            paginatedMessage.addPageEmbed((embed) =>
                embed
                    .setColor('0x1d8f2e')
                    .setTitle(`**Now Playing:** [${queue.currentTrack?.title}]`)
                    .setURL(queue.currentTrack?.url)
                    .setDescription(
                        `**Queue** for **session** in **${queue.channel?.name}:**\n${list === '' ? '\n*• No more queued tracks*' : `\n${list}`}`
                    )
                    .setFooter({
                        text: `${queue.tracks.size} track(s) in queue`
                    })
            );
        }

        return paginatedMessage.run(interaction);
    }
}