const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, WelcomeChannel, messageLink } = require('discord.js');
const GuildSettings = require('../../schemas/GuildSettings');
console.log('[ Command | timeout     ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Ban a user from the server')
        .addSubcommand(subcommand => subcommand
            .setName('clear')
            .setDescription('Remove a timeout for a member')
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user whoms timeout to clear')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('user')
            .setDescription('Timeout a member')
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to be timed out')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('reason')
                .setDescription('reason for timeout')
                .setRequired(true)
            )
            .addNumberOption(option => option.setName('days').setDescription('Timeout in Days').setRequired(true))
            .addNumberOption(option => option.setName('hours').setDescription('Timeout in Hours').setRequired(true))
            .addNumberOption(option => option.setName('minutes').setDescription('Timeout in minutes').setRequired(true))
            .addNumberOption(option => option.setName('seconds').setDescription('Timeout in seconds').setRequired(true))
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' });
        const embed2 = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' });
        const guildSettings = await GuildSettings.findOne({ guildId: interaction.guild.id });
        if (!interaction.guild.id === guildSettings.guildId) {
            return;
        }
        const reason = interaction.options.getString("reason");
        const user = interaction.options.getUser("user");
        const member = interaction.options.getMember("user")
        const daysMs = interaction.options.getNumber('days')
        const hoursMs = interaction.options.getNumber('hours')
        const secondsMs = interaction.options.getNumber('seconds')
        const minutesMs = interaction.options.getNumber('minutes')
        const seconds = secondsMs * 1000
        const minutes = minutesMs * 1000 * 60
        const hours = hoursMs * 1000 * 60 * 60
        const days = daysMs * 1000 * 60 * 60 * 24
        const timeoutTimeInt = daysMs + ' day(s) ' + hoursMs + ' hour(s) ' + minutesMs + ' minute(s) ' + secondsMs + ' second(s) '
        if (interaction.options.getSubcommand() === "clear") {
            if (member.roles.highest.position > interaction.guild.members.resolve(client.user).roles.highest.position) {
                embed
                    .setTitle(`I can't clear timeout`)
                    .setDescription(`<@${interaction.user.id}> tried clearing timeout for <@${user.id}>`)
                    .addFields(
                        { name: 'Whoms timeout to clear', value: `<@${user.id}>`, inline: true },
                        { name: `Error!`, value: `<@${user.id}> Role is higher than mine` }
                    )
                interaction.reply({ embeds: [embed] })
                return
            }
            if (user.id === client.user.id) {
                embed
                    .setTitle(`I can't clear timeout`)
                    .setDescription(`<@${interaction.user.id}> tried clearing timeout for <@${user.id}>`)
                    .addFields(
                        { name: 'Whoms timeout to clear', value: `<@${user.id}>`, inline: true },
                        { name: `Error!`, value: `Can't clear timeout for myself` }
                    )
                interaction.reply({ embeds: [embed] })
                return
            }
            if (user.id === interaction.user.id) {
                embed
                    .setTitle(`I can't clear timeout`)
                    .setDescription(`<@${interaction.user.id}> tried clearing timeout for <@${user.id}>`)
                    .addFields(
                        { name: 'Whoms timeout to clear', value: `<@${user.id}>`, inline: true },
                        { name: `Error!`, value: `Can't clear timeout for yourself` }
                    )
                interaction.reply({ embeds: [embed] })
                return
            }
            if (member === null) {
                embed
                    .setTitle(`I can't clear timeout`)
                    .setDescription(`<@${interaction.user.id}> tried clearing timeout for <@${user.id}>`)
                    .addFields(
                        { name: 'Whoms timeout to clear', value: `<@${user.id}>`, inline: true },
                        { name: `Error!`, value: `<@${user.id}> ins't in the server` }
                    )
                interaction.reply({ embeds: [embed] })
                return
            }
            await member.timeout(null).then(() => {
                embed
                    .setTitle(`I cleared timeout`)
                    .setDescription(`<@${interaction.user.id}> cleared timeout for <@${user.id}>`)
                    .addFields(
                        { name: 'Cleared timeout for', value: `<@${user.id}>`, inline: true },
                    )
                interaction.reply({ embeds: [embed] })
                if (guildSettings.modChannelId) {
                    const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                    embed2
                        .setTitle('Mod alert')
                        .setDescription(`<@${interaction.user.id}> cleared timeout for <@${user.id}>`)
                        .addFields(
                            { name: 'Whom tried to clear timeout', value: `<@${interaction.user.id}>`, inline: true },
                            { name: `Whom got timedout cleared`, value: `<@${user.id}>`, inline: true },
                        )
                    modChannel.send({ embeds: [embed2] })
                }
            }).catch(error => {
                if (error) {
                    embed
                        .setTitle(`I can't clear timeout`)
                        .setDescription(`<@${interaction.user.id}> tried clearing timeout for <@${user.id}>`)
                        .addFields(
                            { name: 'Whoms timeout to clear', value: `<@${user.id}>`, inline: true },
                            { name: 'Error!', value: `${error}` }
                        )
                    interaction.reply({ embeds: [embed] })
                    return
                }
            })
        }
        if (interaction.options.getSubcommand() === "user") {
            if (member.roles.highest.position > interaction.guild.members.resolve(client.user).roles.highest.position) {
                embed
                    .setTitle(`I can't timeout`)
                    .setDescription(`<@${interaction.user.id}> tried timing out <@${user.id}>`)
                    .addFields(
                        { name: 'User to timeout', value: `<@${user.id}>`, inline: true },
                        { name: 'Reason for timeout', value: `${reason}`, inline: true },
                        { name: 'Timeout time', value: `${timeoutTime}`, inline: true },
                        { name: `Error!`, value: `<@${user.id}> Role is higher than mine` }
                    )
                interaction.reply({ embeds: [embed] })
                return
            }
            if (user.id === client.user.id) {
                embed
                    .setTitle(`Can't timeout myself`)
                    .setDescription(`<@${interaction.user.id}> tried timing out <@${user.id}>.`)
                    .addFields(
                        { name: 'User to timeout', value: `<@${user.id}>`, inline: true },
                        { name: 'Reason for timeout', value: `${reason}`, inline: true },
                        { name: 'Timeout time', value: `${timeoutTime}`, inline: true },
                        { name: `Error!`, value: `Can't timeout myself` }
                    )
                interaction.reply({ embeds: [embed] })
                return
            }
            if (user.id === interaction.user.id) {
                embed
                    .setTitle(`Can't timeout yourself`)
                    .setDescription(`<@${interaction.user.id}> tried timing <@${user.id}>.`)
                    .addFields(
                        { name: 'User to timeout', value: `<@${user.id}>`, inline: true },
                        { name: 'Reason for timeout', value: `${reason}`, inline: true },
                        { name: 'Timeout time', value: `${timeoutTime}`, inline: true },
                        { name: `Error!`, value: `Can't timeout yourself` }
                    )
                interaction.reply({ embeds: [embed] })
                return
            }
            if (member === null) {
                embed
                    .setTitle(`Can't timeout user`)
                    .setDescription(`<@${interaction.user.id}> tried to timeout <@${user.id}>.`)
                    .addFields(
                        { name: 'User to timeout', value: `<@${user.id}>`, inline: true },
                        { name: 'Reason for timeout', value: `${reason}`, inline: true },
                        { name: 'Timeout time', value: `${timeoutTime}`, inline: true },
                        { name: `Error!`, value: `<@${user.id}> ins't in the server` }
                    )
                interaction.reply({ embeds: [embed] })
                return
            }
            const timeoutTime = days + hours + minutes + seconds
            console.log(timeoutTime)
            if (timeoutTime > 2419200000) {
                embed
                    .setTitle(`Can't timeout user`)
                    .setDescription(`<@${interaction.user.id}> tried to timeout <@${user.id}>.`)
                    .addFields(
                        { name: 'User to timeout', value: `<@${user.id}>`, inline: true },
                        { name: 'Reason for timeout', value: `${reason}`, inline: true },
                        { name: 'Timeout time', value: `${timeoutTime}`, inline: true },
                        { name: `Error!`, value: `You can't timeout longer than 28 days!` }
                    )
                interaction.reply({ embeds: [embed] })
                return
            }
            await member.timeout(timeoutTime).then(() => {
                embed
                    .setTitle('timed out user')
                    .setDescription(`<@${interaction.user.id}> timed out <@${user.id}>.`)
                    .addFields(
                        { name: 'User to timed out', value: `<@${user.id}>`, inline: true },
                        { name: 'Reason for timeout', value: `${reason}`, inline: true },
                        { name: 'Timeout time', value: `${timeoutTimeInt}`, inline: true },
                    )
                interaction.reply({ embeds: [embed] })
                if (guildSettings.modChannelId) {
                    const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                    embed2
                        .setTitle('Mod alert')
                        .setDescription('A member was timed out')
                        .addFields(
                            { name: `Whom timed out`, value: `<@${interaction.user.id}>`, inline: true },
                            { name: 'Reason for timeout', value: `${reason}`, inline: true },
                            { name: 'Timeout time', value: `${timeoutTimeInt}`, inline: true },
                            { name: `Whom got timed out`, value: `<@${user.id}>`, inline: true },
                        )
                    modChannel.send({ embeds: [embed2] })
                }
            }).catch(error => {
                if (error) {
                    embed
                        .setTitle(`Couldn't time out user`)
                        .setDescription(`<@${interaction.user.id}> tried to timeout <@${user.id}>.`)
                        .addFields(
                            { name: 'User to timeout', value: `<@${user.id}>`, inline: true },
                            { name: 'Reason for timeout', value: `${reason}`, inline: true },
                            { name: 'Timeout time', value: `${timeoutTime}`, inline: true },
                            { name: 'Error!', value: `${error}` }
                        )
                    interaction.reply({ embeds: [embed] })
                    return
                }
            })
        }
    }
}