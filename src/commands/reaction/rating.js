const { SlashCommandBuilder, EmbedBuilder, Message, Permissions } = require("discord.js");

console.log('[ Command | rating     ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rating')
        .setDescription('Returns rating reaction message')
        .setDMPermission(false),

    async execute(interaction, client) {
        const message = await interaction.reply({
            content: `What's your rating? React your score!`,
            fetchReply: true
        });
        message.react('0️⃣');
        message.react('1️⃣');
        message.react('2️⃣');
        message.react('3️⃣');
        message.react('4️⃣');
        message.react('5️⃣');
        message.react('6️⃣');
        message.react('7️⃣');
        message.react('8️⃣');
        message.react('9️⃣');
        message.react('🔟');
    }
}
