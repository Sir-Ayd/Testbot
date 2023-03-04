const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
let embed = new EmbedBuilder();

console.log('[ Button  | delete      ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('deletes any message/ embed')
        .setDMPermission(true),

    async execute(interaction) {
        interaction.message.delete()
        return;
        }
    }

