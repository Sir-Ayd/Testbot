const { useQueue } = require("discord-player");
const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

console.log('[ Button  | queue      ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDMPermission(false),
    async execute(interaction, client) {
        const queue = useQueue(interaction.guild.id)
        if (!queue || !queue.isPlaying()) {
            await interaction.deferUpadte()
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