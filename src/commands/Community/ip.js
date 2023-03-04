const { SlashCommandBuilder, EmbedBuilder, Message, Permissions, Client } = require("discord.js");

console.log('[ Command | commands   ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription('WILD Network IPs')
        .setDMPermission(true),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
            embed
            .setTitle("WILD Network IPs")
            .setDescription(`${interaction.user} Here is all the information needed to join the WILD Network!`)
            .setFields(
                { name: "Java:", value: `\u200b`, inline: true },
                { name: "IP Adress:", value: `play.wildmc.uk`, inline: true },
                { name: "Port:", value: `-`, inline: true },
                { name: "\u200b", value: `\u200b`, inline: true },
                { name: "\u200b", value: `\u200b`, inline: true },
                { name: "\u200b", value: `\u200b`, inline: true },
                { name: "Bedrock:", value: `\u200b`, inline: true },
                { name: "IP Address:", value: `wildmc.uk\n wildmc.co.uk\n wildsmp.uk\n wildsmp.co.uk`, inline: true },
                { name: "Port:", value: `19132\n19132\n19132\n19132`, inline: true }
            )
            .setURL('https://discord.gg/Fybcj9WZgx')
        await interaction.reply({ embeds: [embed] })
    }
}