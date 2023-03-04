const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, EmbedBuilder, Message, Permissions, ButtonStyle } = require("discord.js");

console.log('[ Command | vote       ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Returns vote reaction message')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('movie')
                .setDescription('Suggest a movie with vote reactions')
                .addStringOption(option => option.setName('name').setDescription('The name of the movie').setRequired(true))
                .addStringOption(option => option.setName('link').setDescription('Link to the movie preferably IBM').setRequired(true))
                .addStringOption(option => option.setName('image').setDescription('Link for movie cover'))
                .addStringOption(option => option.setName('description').setDescription('Description of the game')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('game')
                .setDescription('Suggest a game with vote reactions')
                .addStringOption(option => option.setName('name').setDescription('The name of the game').setRequired(true))
                .addStringOption(option => option.setName('description').setDescription('Description of the game').setRequired(true))
                .addStringOption(option => option.setName('platform').setDescription('What platform is the game').addChoices(
                    { name: 'All', value: 'Pc, Xbox, PS, Mobile' },
                    { name: 'Pc', value: 'Pc' },
                    { name: 'Pc, Console', value: 'Pc, Xbox, PS' },
                    { name: 'Console', value: 'Xbox, PS' },
                    { name: 'Console, Mobile', value: 'Xbox, PS, Mobile' },
                    { name: 'Pc, Xbox', value: 'Pc, Xbox' },
                    { name: 'Pc, PS', value: 'Pc, PS' },
                    { name: 'Pc, Mobile', value: 'Pc, Mobile' },
                    { name: 'Xbox', value: 'Xbox' },
                    { name: 'Xbox, mobile', value: 'Xbox, Mobile' },
                    { name: 'PS', value: 'PS' },
                    { name: 'PS, Mobile', value: 'Ps, Mobile' },
                    { name: 'Mobile', value: 'Mobile' },
                ).setRequired(true))
                .addStringOption(option => option.setName('link').setDescription('Link to the game').setRequired(true))),

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
        if (interaction.options.getSubcommand() === "game") {
            const name = interaction.options.getString("name")
            const decription = interaction.options.getString("description")
            const link = interaction.options.getString("link")
            const platform = interaction.options.getString("platform")
            const linkbtn = new ButtonBuilder()
                .setLabel('Link')
                .setURL(`${link}`)
                .setStyle(ButtonStyle.Link);
            embed
                .setTitle(`${name}`)
                .setURL(link)
                .setColor(0x1d8f2e)
                .setDescription(`${decription}`)
                .setFields(
                    { name: "Platform", value: `${platform}`, inline: true }
                )
                .setTimestamp()
                .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
            const message = await interaction.reply({
                embeds: [embed], components: [new ActionRowBuilder().addComponents(linkbtn)],
                fetchReply: true
            });
            message.react('🔼');
            message.react('🔽');
        }
        else if (interaction.options.getSubcommand() === "movie") {
            const name = interaction.options.getString("name")
            const decription = interaction.options.getString("description") || '\u200b'
            const image = interaction.options.getString("image") || '\u200b'
            const link = interaction.options.getString("link")
            const linkbtn = new ButtonBuilder()
                .setLabel('Link')
                .setURL(`${link}`)
                .setStyle(ButtonStyle.Link);
            embed
                .setTitle(`${name}`)
                .setURL(link)
                .setColor(0x1d8f2e)
                .setDescription(`${decription}`)
                .setThumbnail(`${image}`)
                .setTimestamp()
                .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
            const message = await interaction.reply({
                embeds: [embed], components: [new ActionRowBuilder().addComponents(linkbtn)],
                fetchReply: true
            });
            message.react('🔼');
            message.react('🔽');
        }
    }
}
