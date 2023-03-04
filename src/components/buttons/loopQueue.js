const { useQueue, QueueRepeatMode } = require("discord-player");
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, Client } = require("discord.js");
const loop = require("../../commands/music/loop");

console.log('[ button | loop         ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loopq')
        .setDescription('loop the playlist')
        .setDMPermission(false),
    async execute(interaction, client) {
        const queue = useQueue(interaction.guild);
        if (!queue || !queue.isPlaying()) {
            return
        }
        const loopMode = queue.repeatMode
        if (loopMode === 2) {
            queue.setRepeatMode(QueueRepeatMode.OFF);
            await interaction.deferUpdate()
        }
        if (loopMode <= 1 || loopMode === 3) {
            queue.setRepeatMode(QueueRepeatMode.QUEUE);
            await interaction.deferUpdate()
        }
    }
}
