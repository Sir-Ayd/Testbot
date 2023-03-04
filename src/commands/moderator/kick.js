const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, WelcomeChannel, messageLink } = require('discord.js');
const GuildSettings = require('../../schemas/GuildSettings');
console.log('[ Command | kick       ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick a user from the server')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to be kicked')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('reason for kick')
            .setRequired(true)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),
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
        if (member.roles.highest.position > interaction.guild.members.resolve(client.user).roles.highest.position) {
            embed
                .setTitle(`I can't kick`)
                .setDescription(`<@${interaction.user.id}> tried kicking <@${user.id}>`)
                .addFields(
                    { name: 'User to kick', value: `<@${user.id}>`, inline: true },
                    { name: 'Reason for kick', value: `${reason}`, inline: true },
                    { name: `Error!`, value: `<@${user.id}> Role is higher than mine` }
                )
            interaction.reply({ embeds: [embed] })
            return
        }
        if (user.id === client.user.id) {
            embed
                .setTitle(`Can't kick myself`)
                .setDescription(`<@${interaction.user.id}> tried kicking <@${user.id}>.`)
                .addFields(
                    { name: 'User to kick', value: `<@${user.id}>`, inline: true },
                    { name: 'Reason for kick', value: `${reason}`, inline: true },
                    { name: `Error!`, value: `Can't kick myself` }
                )
            interaction.reply({ embeds: [embed] })
            return
        }
        if (user.id === interaction.user.id) {
            embed
                .setTitle(`Can't kick yourself`)
                .setDescription(`<@${interaction.user.id}> tried kicking <@${user.id}>.`)
                .addFields(
                    { name: 'User to kick', value: `<@${user.id}>`, inline: true },
                    { name: 'Reason for kick', value: `${reason}`, inline: true },
                    { name: `Error!`, value: `Can't kick yourself` }
                )
            interaction.reply({ embeds: [embed] })
            return
        }
        if (member === null) {
            embed
                .setTitle(`Can't kick user`)
                .setDescription(`<@${interaction.user.id}> tried to kick <@${user.id}>.`)
                .addFields(
                    { name: 'User to kick', value: `<@${user.id}>`, inline: true },
                    { name: 'Reason for kick', value: `${reason}`, inline: true },
                    { name: `Error!`, value: `<@${user.id}> ins't in the server` }
                )
            interaction.reply({ embeds: [embed] })
            return
        }
        await member.kick().then(() => {
            embed
                .setTitle('Kicked user')
                .setDescription(`<@${interaction.user.id}> kicked <@${user.id}>.`)
                .addFields(
                    { name: 'User kicked', value: `<@${user.id}>`, inline: true },
                    { name: 'Reason for kick', value: `${reason}`, inline: true },
                )
            interaction.reply({ embeds: [embed] })
            if (guildSettings.modChannelId) {
                const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                embed2
                    .setTitle('Mod alert')
                    .setDescription('A member was kicked')
                    .setFields(
                        { name: `Whom kicked`, value: `<@${interaction.user.id}>`, inline: true },
                        { name: `Whom was kicked`, value: `<@${user.id}>`, inline: true },
                        { name: `Reason for kick`, value: `${reason}` }
                    )
                modChannel.send({ embeds: [embed2] })
            }
        }).catch(error => {
            if (error) {
                embed
                    .setTitle(`Couldn't kick user`)
                    .setDescription(`<@${interaction.user.id}> tried to kick <@${user.id}>.`)
                    .addFields(
                        { name: 'User to kick', value: `<@${user.id}>`, inline: true },
                        { name: 'Reason for kick', value: `${reason}`, inline: true },
                        { name: 'Error!', value: `${error}` }
                    )
                interaction.reply({ embeds: [embed] })
                return
            }
        })
    }
}