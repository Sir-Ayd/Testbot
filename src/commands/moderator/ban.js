const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, WelcomeChannel, messageLink } = require('discord.js');
const GuildSettings = require('../../schemas/GuildSettings');
console.log('[ Command | ban       ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption(option => option
            .setName('user')
            .setDescription('The user to be baned')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('reason for ban')
            .setRequired(true)
        )
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' });
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
        const guildSettings = await GuildSettings.findOne({ guildId: interaction.guild.id });
        if (!interaction.guild.id === guildSettings.guildId) {
            return;
        }
        const reason = interaction.options.getString("reason");
        const user = interaction.options.getUser("user");
        const member = interaction.options.getMember("user")
        if (member.roles.highest.position > interaction.guild.members.resolve(client.user).roles.highest.position) {
            embed
                .setTitle(`I can't ban`)
                .setDescription(`<@${interaction.user.id}> tried banning <@${user.id}>`)
                .addFields(
                    { name: 'User to ban', value: `<@${user.id}>`, inline: true },
                    { name: 'Reason for ban', value: `${reason}`, inline: true },
                    { name: `Error!`, value: `<@${user.id}> Role is higher than mine` }
                )
            interaction.reply({ embeds: [embed] })
            return
        }
        if (user.id === client.user.id) {
            embed
                .setTitle(`Can't ban myself`)
                .setDescription(`<@${interaction.user.id}> tried baning <@${user.id}>.`)
                .addFields(
                    { name: 'User to ban', value: `<@${user.id}>`, inline: true },
                    { name: 'Reason for ban', value: `${reason}`, inline: true },
                    { name: `Error!`, value: `Can't ban myself` }
                )
            interaction.reply({ embeds: [embed] })
            return
        }
        if (user.id === interaction.user.id) {
            embed
                .setTitle(`Can't ban yourself`)
                .setDescription(`<@${interaction.user.id}> tried baning <@${user.id}>.`)
                .addFields(
                    { name: 'User to ban', value: `<@${user.id}>`, inline: true },
                    { name: 'Reason for ban', value: `${reason}`, inline: true },
                    { name: `Error!`, value: `Can't ban yourself` }
                )
            interaction.reply({ embeds: [embed] })
            return
        }
        if (member === null) {
            embed
                .setTitle(`Can't ban user`)
                .setDescription(`<@${interaction.user.id}> tried to ban <@${user.id}>.`)
                .addFields(
                    { name: 'User to ban', value: `<@${user.id}>`, inline: true },
                    { name: 'Reason for ban', value: `${reason}`, inline: true },
                    { name: `Error!`, value: `<@${user.id}> ins't in the server` }
                )
            interaction.reply({ embeds: [embed] })
            return
        }
        await member.ban().then(() => {
            embed
                .setTitle('baned user')
                .setDescription(`<@${interaction.user.id}> baned <@${user.id}>.`)
                .addFields(
                    { name: 'User to ban', value: `<@${user.id}>`, inline: true },
                    { name: 'Reason for ban', value: `${reason}`, inline: true },
                )
            interaction.reply({ embeds: [embed] })
            if (guildSettings.modChannelId) {
                const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                embed
                    .setTitle('Mod alert')
                    .setDescription('A member was banned')
                    .addFields(
                        { name: `Whom banned`, value: `<@${interaction.user.id}>`, inline: true },
                        { name: 'Reason for ban', value: `${reason}`, inline: true },
                        { name: `Whom got banned`, value: `<@${user.id}>`, inline: true },
                    )
                modChannel.send({ embeds: [embed] })
            }
        }).catch(error => {
            if (error) {
                embed
                    .setTitle(`Couldn't ban user`)
                    .setDescription(`<@${interaction.user.id}> tried to ban <@${user.id}>.`)
                    .addFields(
                        { name: 'User to ban', value: `<@${user.id}>`, inline: true },
                        { name: 'Reason for ban', value: `${reason}`, inline: true },
                        { name: 'Error!', value: `${error}` }
                    )
                interaction.reply({ embeds: [embed] })
                eChannel.send({ embeds: [errorEmbed] })
                return
            }
        })
    }
}