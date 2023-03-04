const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

console.log('[ Button  | previous   ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Skipping the current song')
        .setDMPermission(false),
    async execute(interaction, client) {
       const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return;
        }
        const check = queue.history.size
        if (check >= 1) {
            queue.history.back();
            interaction.message.delete()
            await interaction.deferUpdate()
        }
        if (check <= 0) {
            return;
        }
    }
}