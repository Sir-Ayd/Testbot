const { useQueue, QueueRepeatMode } = require("discord-player");
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, Client } = require("discord.js");

console.log('[ button | loop         ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loopt')
        .setDescription('loop the playlist')
        .setDMPermission(false),
    async execute(interaction, client) {
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.isPlaying()) {
            return
        }
        const loopMode = queue.repeatMode
        if (loopMode === 1) {
            queue.setRepeatMode(QueueRepeatMode.OFF);
            await interaction.deferUpdate()
        }
        if (loopMode === 0 || loopMode > 1) {
            queue.setRepeatMode(QueueRepeatMode.TRACK);
            await interaction.deferUpdate()
        }
    }
}
