const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { useQueue } = require('discord-player')
console.log('[ Button  | resume     ] ✅ Loaded!')

module.exports = {
    data: {
        name: `resume`
    },
    async execute(interaction, client) {
        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return
        }
        queue.node.resume();
        await interaction.deferUpdate()
    }
}