const { SlashCommandBuilder, EmbedBuilder, Message, Permissions, Client } = require("discord.js");

console.log('[ Command | commands   ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commands')
        .setDescription('List of all commands')
        .setDMPermission(true),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const communityCommands = ("commands, flip, roll")
        const moderationCommands = ("clear, info, nuke, set, unset")
        const musicCommands = ("</autoplay:1052632982000762951>, </current:1007924157729755187>, </jump:1007924157729755188>, </leave:1007924157729755189>,\n loop, pause, play, previous,\n queue, resume, seek, shuffle,\n skip, volume")
        embed
            .setTitle("Command list")
            .setDescription(`${interaction.user} Here is all the commands. I'm lazy so I'm not making all the commands on this bot look like this </autoplay:1052632982000762951> the actual bot will have them all done`)
            .setFields(
                { name: "Moderation:", value: `${moderationCommands}`, inline: true },
                { name: "Community:", value: `${communityCommands}`, inline: true },
                { name: "Music:", value: `${musicCommands}`, inline: true },
                
            )
        await interaction.reply({ embeds: [embed] })
    }
}