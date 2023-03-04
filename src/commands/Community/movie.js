const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');
let embed = new EmbedBuilder();

console.log('[ Command | movie      ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('movie')
        .setDescription('Make a movie listing for movie night')
        .setDMPermission(false)
        .addStringOption(option => option.setName('movie').setDescription('Whats the name of the movie').setRequired(true))
        .addStringOption(option => option.setName('browser').setDescription('What browser are you using').addChoices(
            { name: 'Google Chrome', value: 'Google Chrome' },
            { name: 'Opra', value: 'Opra' },
            { name: 'Edge', value: 'Edge' },
        ).setRequired(true))
        .addStringOption(option => option.setName('link').setDescription('The link for people to connect').setRequired(true))
        .addStringOption(option => option.setName('description').setDescription('Give a description')),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const movie = interaction.options.getString("movie")
        const browser = interaction.options.getString("browser")
        const link = interaction.options.getString("link")
        const description = interaction.options.getString("description") || '\u200b'
        const linkbtn = new ButtonBuilder()
        .setLabel('Link')
        .setURL(`${link}`)
        .setStyle(ButtonStyle.Link);
        embed
        .setTitle(`${movie}`)
        .setURL(`${link}`)
        .setDescription(`${description}`)
        .setFields(
            { name: "Browser", value: `${browser}`, inline: true },
            { name: "Voice chat", value: `https://discord.com/channels/534817721809109032/929159175068585984`, inline: true },
            { name: "link", value: `${link}`, inline: true }
        )
        if (interaction.options.getString("movie", "browser", "link")) {
            interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(linkbtn)] })
        }
    }
}
