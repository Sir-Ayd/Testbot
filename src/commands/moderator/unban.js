const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, WelcomeChannel, messageLink } = require('discord.js');
const GuildSettings = require('../../schemas/GuildSettings');
console.log('[ Command | nuke       ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('unban a user from the server')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to be unbaned')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('reason for unban')
            .setRequired(true)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
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
        if (user.id === client.user.id) {
            embed
                .setTitle(`Can't unban myself`)
                .setDescription(`<@${interaction.user.id}> tried unbaning <@${user.id}>.`)
                .addFields(
                    { name: 'User to unban', value: `<@${user.id}>`, inline: true },
                    { name: 'Reason for unban', value: `${reason}`, inline: true },
                    { name: `Error!`, value: `Can't unban myself` }
                )
            interaction.reply({ embeds: [embed] })
            return
        }
        if (user.id === interaction.user.id) {
            embed
                .setTitle(`Can't unban yourself`)
                .setDescription(`<@${interaction.user.id}> tried unbaning <@${user.id}>.`)
                .addFields(
                    { name: 'User to unban', value: `<@${user.id}>`, inline: true },
                    { name: 'Reason for unban', value: `${reason}`, inline: true },
                    { name: `Error!`, value: `Can't unban yourself` }
                )
            interaction.reply({ embeds: [embed] })
            return
        }
        await interaction.guild.members.unban(user).then(() => {
            embed
                .setTitle('unbaned user')
                .setDescription(`<@${interaction.user.id}> unbaned <@${user.id}>.`)
                .addFields(
                    { name: 'User to unban', value: `<@${user.id}>`, inline: true },
                    { name: 'Reason for unban', value: `${reason}`, inline: true },
                )
            interaction.reply({ embeds: [embed] })
            if (guildSettings.modChannelId) {
                const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                embed
                    .setTitle('Mod alert')
                    .setDescription('A member was unbanned')
                    .addFields(
                        { name: `Whom unbanned`, value: `<@${interaction.user.id}>`, inline: true },
                        { name: `Whom got unbanned`, value: `<@${user.id}>`, inline: true },
                    )
                modChannel.send({ embeds: [embed] })
            }
        }).catch(error => {
            if (error) {
                embed
                    .setTitle(`Couldn't unban user`)
                    .setDescription(`<@${interaction.user.id}> tried to unban <@${user.id}>.`)
                    .addFields(
                        { name: 'User to unban', value: `<@${user.id}>`, inline: true },
                        { name: 'Reason for unban', value: `${reason}`, inline: true },
                        { name: 'Error!', value: `${error}` }
                    )
                interaction.reply({ embeds: [embed] })
                return
            }
        })
    }
}