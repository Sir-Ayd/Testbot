const { useQueue, QueueRepeatMode } = require("discord-player");
const { SlashCommandBuilder } = require("discord.js");

console.log('[ button | autoplay         ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('once queue ends the bot will auto play')
        .setDMPermission(false),
    async execute(interaction, client) {
        const queue = useQueue(interaction.guild);
        if (!queue || !queue.isPlaying()) {
            return
        }
        const loopMode = queue.repeatMode
        if (loopMode === 3) {
            queue.setRepeatMode(QueueRepeatMode.OFF);
            await interaction.deferUpdate()
        }
        if (loopMode < 3) {
            queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
            await interaction.deferUpdate()
        }
    }
}
