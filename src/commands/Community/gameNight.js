const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
let embed = new EmbedBuilder();

console.log('[ Command | gameNight  ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joinlink')
        .setDescription('Make a movie listing for movie night')
        .setDMPermission(false)
        .addStringOption(option => option.setName('name').setDescription('Whats the name of the movie').setRequired(true))
        .addStringOption(option => option.setName('link').setDescription('The link for people to connect').setRequired(true)),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const name = interaction.options.getString("name")
        const link = interaction.options.getString("link")
        const linkbtn = new ButtonBuilder()
        .setLabel('Link')
        .setURL(`${link}`)
        .setStyle(ButtonStyle.Link);
        embed
        .setTitle(`${name}`)
        .setURL(`${link}`)
        .setDescription(`Use the link to join in the games!`)
        .setFields(
            { name: "Join link", value: `${link}`, inline: true }
        )
        if (interaction.options.getString("name", "link")) {
            interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(linkbtn)] })
        }
    }
}
