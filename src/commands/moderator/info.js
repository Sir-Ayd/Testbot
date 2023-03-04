const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField, EmbedBuilder, Message, Permissions } = require("discord.js");
const GuildSettings = require("../../schemas/GuildSettings");
console.log('[ Command | info       ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Informaion about the bot')
        .addSubcommand(subcommand => subcommand
            .setName("bot")
            .setDescription("bot info")
        )
        .addSubcommand(subcommand => subcommand
            .setName("server")
            .setDescription("your server info")
        )
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const embed2 = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const x = new ButtonBuilder()
            .setCustomId('delete')
            .setLabel('X')
            .setStyle(ButtonStyle.Danger);
        const eChannel = client.guilds.cache.get('617923284868005894').channels.cache.get('1061849750040739931');
        const errorEmbed = new EmbedBuilder()
            .setTitle('Error!')
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        if (interaction.options.getSubcommand() === "bot") {
            let totalSec = (client.uptime / 1000)
            let days = Math.floor(totalSec / 86400)
            totalSec %= 86400
            let hours = Math.floor(totalSec / 3600)
            totalSec %= 3600
            let minutes = Math.floor(totalSec / 60)
            let seconds = Math.floor(totalSec % 60)
            let uptime = `**${days}d** ** ${hours}h** **${minutes}m** **${seconds}s**`

            embed
                .setTitle("WILD v14 Info")
                .setThumbnail('https://i.imgur.com/aGjcDdv.jpg')
                .setDescription("✅ Bot is running!")
                .setFields(
                    { name: "Ping", value: `${client.ws.ping}ms`, inline: true },
                    { name: "Uptime", value: `${uptime}`, inline: true }
                )
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    errorEmbed
                        .setDescription(`${error}`)
                        .addFields(
                            { name: `Guild Name:`, value: `${interaction.guild}`, inline: true },
                            { name: `Guild Id:`, value: `${interaction.guild.id}`, inline: true },
                            { name: `Command ran:`, value: `${commandName}`, inline: true },
                        )
                    eChannel.send({ embeds: [errorEmbed] })
                    return;
                }
            })
        }
        if (interaction.options.getSubcommand() === "server") {
            const guildSettings = await GuildSettings.findOne({ guildId: interaction.guild.id });
            if (guildSettings.modChannelId) {
                const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                embed
                    .setTitle('Mod alert')
                    .setDescription(`</info server:1007924157691994160> was ran by <@${interaction.user.id}>`)
                    .setFields(
                        { name: 'Moderation Channel', value: `<#${guildSettings.modChannelId}>` },
                        { name: 'Welcome Channel', value: `<#${guildSettings.welcomeChannelId}>`, inline: true },
                        { name: 'Welcome Message', value: `${guildSettings.welcomeMessage}`, inline: true },
                        { name: 'Member Role', value: `<@&${guildSettings.memberRole}>` },
                        { name: 'Now Playing Channel', value: `<#${guildSettings.songChannelId}>` },
                    )
                let Msg = await modChannel.send({ embeds: [embed] })
                embed2
                    .setDescription(`You have a moderation channel so I've replied there!`)
                    .setFields(
                        { name: `Moderation Channel`, value: `<#${guildSettings.modChannelId}>` },
                        { name: `Redirect to the reply`, value: `https://discord.com/channels/${interaction.guild.id}/${guildSettings.modChannelId}/${Msg.id}` }
                    )
                interaction.reply({ ephemeral: true, embeds: [embed2] })
                return;
            }
            if (!guildSettings.modChannelId) {
                embed
                    .setTitle("Your servers info")
                    .setThumbnail('https://i.imgur.com/aGjcDdv.jpg')
                    .setDescription("You have saved the following information to our database(s).")
                    .setFields(
                        { name: 'Moderation Channel', value: `<#${guildSettings.modChannelId}>` },
                        { name: 'Welcome Channel', value: `<#${guildSettings.welcomeChannelId}>`, inline: true },
                        { name: 'Welcome Message', value: `${guildSettings.welcomeMessage}`, inline: true },
                        { name: 'Member Role', value: `<@&${guildSettings.memberRole}>` },
                        { name: 'Now Playing Channel', value: `<#${guildSettings.songChannelId}>` },
                    )
                await interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(x)] }).catch(error => {
                    if (error) {
                        eChannel.send({ embeds: [errorEmbed] })
                        return;
                    }
                })
            }
        }
    }
}
