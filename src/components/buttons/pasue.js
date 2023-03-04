const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { useQueue } = require('discord-player')
console.log('[ Button  | pause      ] ✅ Loaded!')

module.exports = {
    data: {
        name: `pause`
    },
    async execute(interaction, client) {
        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return
        } else {
            queue.node.pause();
            await interaction.deferUpdate()
        }
    }
}