const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, Client } = require("discord.js");
const { useQueue } = require("discord-player");

console.log('[ Button | shuffle      ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffle the queue')
        .setDMPermission(false),
    async execute(interaction, client) {
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.isPlaying()) {
            await interaction.deferUpdate()
            return
        }
        queue.tracks.shuffle();
        await interaction.deferUpdate()
    }
}