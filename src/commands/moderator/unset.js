const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, Message, Permissions } = require("discord.js");
const mongoose = require("mongoose");
const GuildSettings = require("../../schemas/GuildSettings");

console.log('[ Command | set       ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unset')
        .setDescription('Unset custom options for your guild')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .addSubcommand(subcommand => subcommand
            .setName("welcome")
            .setDescription("Unset the channel the bot will welcome new members")
        )
        .addSubcommand(subcommand => subcommand
            .setName("member")
            .setDescription("Unset role given on join")
        )
        .addSubcommand(subcommand => subcommand
            .setName("song")
            .setDescription('Unset the channel the bot will say now playing'))
        .addSubcommand(subcommand => subcommand
            .setName("moderation")
            .setDescription('Unset the channel the bot will send moderation messages')),

    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const guildSettings = await GuildSettings.findOne({ guildId: interaction.guild.id });
        const eChannel = client.guild.channels.cache.get('1061849750040739931');
        const errorEmbed = new EmbedBuilder()
            .setTitle('Error!')
            .setDescription('An error occured!')
            .setDescription(`${error}`)
            .addFields(
                { name: `Guild Name:`, value: `${interaction.guild}`, inline: true },
                { name: `Guild Id:`, value: `${interaction.guild.id}`, inline: true },
                { name: `Command ran:`, value: `${commandName}`, inline: true },
            )
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        guildSettings.guildId;
        if (interaction.options.getSubcommand() === "welcome") {
            guildSettings.welcomeChannelId, guildSettings.welcomeMessage = null;
            await guildSettings.save();
            embed
                .setTitle('Welcome Channel')
                .setDescription('The welcome channel has been removed')
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
            if (guildSettings.modChannelId) {
                const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                embed
                    .setTitle('Mod alert')
                    .setDescription('A welcome channel was unset')
                    .setFields(
                        { name: `Whom unset it`, value: `<@${interaction.user.id}>`, inline: true },
                        { name: `Welcome message`, value: `${guildSettings.welcomeMessage}` }
                    )
                modChannel.send({ embeds: [embed] })
            }
        };
        if (interaction.options.getSubcommand() === "member") {
            guildSettings.memberRole = null;
            await guildSettings.save();
            embed
                .setTitle('Join Role')
                .setDescription('The role given on join has been removed')
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
            if (guildSettings.modChannelId) {
                const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                embed
                    .setTitle('Mod alert')
                    .setDescription('A join role was unset')
                    .setFields(
                        { name: `Whom unset it`, value: `<@${interaction.user.id}>`, inline: true },
                    )
                modChannel.send({ embeds: [embed] })
            }
        };
        if (interaction.options.getSubcommand() === "song") {
            guildSettings.songChannelId = null;
            await guildSettings.save();
            embed
                .setTitle('Now Playing Channel')
                .setDescription('The Now Playing channel has been removed')
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
            if (guildSettings.modChannelId) {
                const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                embed
                    .setTitle('Mod alert')
                    .setDescription('A now playing channel was unset')
                    .setFields(
                        { name: `Whom unset it`, value: `<@${interaction.user.id}>`, inline: true },
                    )
                modChannel.send({ embeds: [embed] })
            }
        };
        if (interaction.options.getSubcommand() === "moderation") {
            if (guildSettings.modChannelId) {
                const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                embed
                    .setTitle('Mod alert')
                    .setDescription('A moderation channel was set')
                    .setFields(
                        { name: `Whom unset it`, value: `<@${interaction.user.id}>`, inline: true },
                    )
                modChannel.send({ embeds: [embed] })
            }
            guildSettings.modChannelId = null;
            await guildSettings.save();
            embed
                .setTitle('Moderation Channel')
                .setDescription('The moderation channel has been removed')
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
        };
    }
}
