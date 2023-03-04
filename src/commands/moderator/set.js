const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, Message, Permissions } = require("discord.js");
const mongoose = require("mongoose");
const GuildSettings = require("../../schemas/GuildSettings");

console.log('[ Command | set       ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Set custom options for your guild')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .addSubcommand(subcommand => subcommand
            .setName("welcome")
            .setDescription("Set up a welcome message for when members join the guild")
            .addChannelOption(option => option
                .setName("channel")
                .setDescription('Set the channel messages will be sent')
                .setRequired(true))
            .addStringOption(option => option
                .setName("message")
                .setDescription("Your custom greeting message")
                .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName("member")
            .setDescription("Set role given on join")
            .addRoleOption(option => option
                .setName("role")
                .setDescription("Which role would you like to set?")
                .setRequired(true)
                )
        )
        .addSubcommand(subcommand => subcommand
            .setName("song")
            .setDescription("Set up a channel for now playing events")
            .addChannelOption(option => option
                .setName("channel")
                .setDescription('Set the channel messages will be sent in')
                .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName("moderation")
            .setDescription("Set up a channel for moderation")
            .addChannelOption(option => option
                .setName("channel")
                .setDescription('Set the channel messages will be sent in')
                .setRequired(true))
        ),

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
            const wm = interaction.options.getString("message")
            guildSettings.welcomeMessage = interaction.options.getString("message");
            guildSettings.welcomeChannelId = interaction.options.getChannel("channel").id;
            await guildSettings.save();
            embed
                .setTitle('Welcome channel')
                .setDescription('The welcome channel has been set')
                .addFields(
                    { name: "Channel name:", value: `<#${guildSettings.welcomeChannelId}>`, inline: true },
                    { name: "Channel id:", value: `${guildSettings.welcomeChannelId}`, inline: true },
                    { name: "Welcome message:", value: `${guildSettings.welcomeMessage}` },
                )
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
            if (guildSettings.modChannelId) {
                const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                embed
                    .setTitle('Mod alert')
                    .setDescription('A welcome channel was set')
                    .setFields(
                        { name: `Whom set it`, value: `<@${interaction.user.id}>`, inline: true },
                        { name: `Channel name`, value: `<#${guildSettings.welcomeChannelId}>`, inline: true },
                        { name: `Channel id`, value: `${guildSettings.welcomeChannelId}`, inline: true },
                        { name: `Welcome message`, value: `${guildSettings.welcomeMessage}` }
                    )
                modChannel.send({ embeds: [embed] })
            }
        };
        if (interaction.options.getSubcommand() === "member") {
            guildSettings.memberRole = interaction.options.getRole("role").id;
            await guildSettings.save();
            embed
                .setTitle('Guild Role')
                .setDescription('The role given on join has been set')
                .setFields(
                    { name: "Role name:", value: `<@&${guildSettings.memberRole}>`, inline: true },
                    { name: "Role id:", value: `${guildSettings.memberRole}`, inline: true },
                )
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
            if (guildSettings.modChannelId) {
                const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                embed
                    .setTitle('Mod alert')
                    .setDescription('A member role was set')
                    .setFields(
                        { name: `Whom set it`, value: `<@${interaction.user.id}>`, inline: true },
                        { name: `Role name`, value: `<@&${guildSettings.memberRole}>`, inline: true },
                        { name: `Role id`, value: `${guildSettings.memberRole}`, inline: true },
                    )
                modChannel.send({ embeds: [embed] })
            }
        };
        if (interaction.options.getSubcommand() === "song") {
            guildSettings.songChannelId = interaction.options.getChannel("channel").id;
            await guildSettings.save();
            embed
                .setTitle('song channel')
                .setDescription('The song channel has been set')
                .setFields(
                    { name: "Channel name:", value: `${interaction.options.getChannel("channel")}`, inline: true },
                    { name: "Channel id:", value: `${guildSettings.songChannelId}`, inline: true },
                )
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
            if (guildSettings.modChannelId) {
                const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                embed
                    .setTitle('Mod alert')
                    .setDescription('A song channel was set')
                    .setFields(
                        { name: `Whom set it`, value: `<@${interaction.user.id}>`, inline: true },
                        { name: `Channel name`, value: `<#${guildSettings.songChannelId}>`, inline: true },
                        { name: `Channel id`, value: `${guildSettings.songChannelId}`, inline: true },
                    )
                modChannel.send({ embeds: [embed] })
            }
        };
        if (interaction.options.getSubcommand() === "moderation") {
            guildSettings.modChannelId = interaction.options.getChannel("channel").id;
            await guildSettings.save();
            embed
                .setTitle('Moderation channel')
                .setDescription('The moderation channel has been set')
                .setFields(
                    { name: "Channel name:", value: `<#${guildSettings.modChannelId}>`, inline: true },
                    { name: "Channel id:", value: `${guildSettings.modChannelId}`, inline: true },
                )
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
            if (guildSettings.modChannelId) {
                const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                embed
                    .setTitle('Mod alert')
                    .setDescription('A moderation channel was set')
                    .setFields(
                        { name: `Whom set it`, value: `<@${interaction.user.id}>`, inline: true },
                        { name: `Channel name`, value: `<#${guildSettings.modChannelId}>`, inline: true },
                        { name: `Channel id`, value: `${guildSettings.modChannelId}`, inline: true },
                    )
                modChannel.send({ embeds: [embed] })
            }
        };
    }
}
