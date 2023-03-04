const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const GuildSettings = require('../../schemas/GuildSettings')
const { useQueue } = require("discord-player");

console.log('[ Button  | skip       ] ✅ Loaded!')

module.exports = {
    data: {
        name: `skip`
    },
    async execute(interaction, client) {
        const queue = useQueue(interaction.guild.id);
        if (!queue) {
            return
        }
        if (queue.tracks.size === 0) {
            await interaction.deferUpdate()
        } else {
            queue.node.skip();
            interaction.message.delete()
            await interaction.deferUpdate()
        }
    }
}