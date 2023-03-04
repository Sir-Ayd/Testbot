const { SlashCommandBuilder, EmbedBuilder, Message, Permissions } = require("discord.js");

console.log('[ Command | reactor    ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactor')
        .setDescription('Returns reaction')
        .setDMPermission(false),

    async execute(interaction, client) {
        const message = await interaction.reply({
            content: `React here!`,
            fetchReply: true
        });

        const emoji = client.emojis.cache.find(emoji => emoji.id = '1004601291718271027')
        message.react(emoji);
        message.react('👍');

        const filter = (reaction, user) => {
            return reaction.emoji.name === '👍' && user.id === interaction.user.id
        };

        message
        .awaitReactions({ filter, max: 4, time: 10000, errors: ["time"]})
        .then((collected) => console.log(collected.size))
        .catch((collected) => {
            console.log(`Ater a ten seconds, only ${collected.size} out of 4 reacted`)
        })
    }
}
