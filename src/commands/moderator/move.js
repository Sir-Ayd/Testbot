const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, WelcomeChannel, messageLink, BaseGuildVoiceChannel, ChannelType } = require('discord.js');
const GuildSettings = require('../../schemas/GuildSettings');
console.log('[ Command | move       ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Move users from a vc to another!')
        .addSubcommand(subcommand => subcommand
            .setName('all')
            .setDescription('Move all people in selected vc!')
            .addChannelOption(option => option
                .setName('from')
                .setDescription('The vc in which to moved from!')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
            )
            .addChannelOption(option => option
                .setName('to')
                .setDescription('The vc in which to moved to!')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('bots')
                .setDescription('To move bot or not | Off by default')
                .addChoices(
                    { name: 'On/ Yes', value: `true` },
                    { name: 'Off/ No', value: `false` },
                )
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('user')
            .setDescription('Move selected user!')
            .addChannelOption(option => option
                .setName('from')
                .setDescription('The vc in which to moved from!')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
            )
            .addChannelOption(option => option
                .setName('to')
                .setDescription('The vc in which to moved to!')
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
            )
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to be moved')
                .setRequired(true)
            )
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MoveMembers),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' });
        const guildSettings = await GuildSettings.findOne({ guildId: interaction.guild.id });
        if (!interaction.guild.id === guildSettings.guildId) {
            return;
        }
        const from = interaction.options.getChannel("from");
        const to = interaction.options.getChannel("to");
        const user = interaction.options.getMember("user");
        if (from === to) {
            embed
                .setTitle(`Can't move to the same channel!`)
            await interaction.reply({ embeds: [embed] })
            return
        }
        if (interaction.options.getSubcommand() === "all") {
            if (interaction.options.getString('bots') === `true`) {
                const members = from.members
                members.forEach(m => {
                    m.voice.setChannel(to)
                });
                embed
                    .setTitle('Move all')
                    .setDescription('All users where moved!')
                    .setFields(
                        { name: `Users to move`, value: members.map((m) => `<@${m.id}>`).join(', '), inline: true },
                        { name: `From channel`, value: `<#${from.id}>`, inline: true },
                        { name: `To channel`, value: `<#${to.id}>`, inline: true },
                    )
                await interaction.reply({ embeds: [embed] })
                return;
            }
            const members = from.members
            members.forEach(m => {
                if (!m.user.bot) {
                    m.voice.setChannel(to)
                }
            });
            embed
                .setTitle('Move all')
                .setDescription('All users where moved!')
                .setFields(
                    { name: `Users to move`, value: members.map((m) => `<@${m.id}>`).join(', '), inline: true },
                    { name: `From channel`, value: `<#${from.id}>`, inline: true },
                    { name: `To channel`, value: `<#${to.id}>`, inline: true },
                )
            await interaction.reply({ embeds: [embed] })
            return;
        }
        if (interaction.options.getSubcommand() === "user") {
            if (user.roles.highest.position > interaction.guild.members.resolve(interaction.user).roles.highest.position) {
                embed
                    .setTitle(`I can't move`)
                    .setDescription(`<@${interaction.user.id}> tried moving <@${user.id}>`)
                    .addFields(
                        { name: 'User to move', value: `<@${user.id}>`, inline: true },
                        { name: `Error!`, value: `<@${user.id}> Role is higher than yours` }
                    )
                interaction.reply({ embeds: [embed] })
                return
            }
            user.voice.setChannel(to)
            embed
                .setTitle('Move user')
                .setDescription('User was moved!')
                .setFields(
                    { name: `Member to move`, value: `<@${user.id}>`, inline: true },
                    { name: `From channel`, value: `<#${from.id}>`, inline: true },
                    { name: `To channel`, value: `<#${to.id}>`, inline: true },
                )
            await interaction.reply({ embeds: [embed] })
        }
    }
}