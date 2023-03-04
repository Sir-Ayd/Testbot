const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const GuildSettings = require('../../schemas/GuildSettings')

console.log('[ Command | clear      ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear command')
        .setDMPermission(false)
        .addNumberOption(option => option.setName('amount').setDescription('The ammount').setRequired(true))
        .addUserOption(option => option.setName('target').setDescription('The user'))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),

    async execute(interaction, client) {
        const guildSettings = await GuildSettings.findOne({ guildId: interaction.guild.id })
        const eChannel = client.guilds.cache.get('617923284868005894').channels.cache.get('1061849750040739931');
        const errorEmbed = new EmbedBuilder()
            .setTitle('Error!')
            .setDescription('An error occured!')
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const { channel, options } = interaction;
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const embed2 = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const Amount = options.getNumber("amount");
        const Target = options.getUser("target");

        const Messages = await channel.messages.fetch();
        if (Target) {
            let i = 0;
            const filtered = [];
            (await Messages).filter((m) => {
                if (m.author.id === Target.id && Amount > i) {
                    filtered.push(m);
                    i++;
                }
            })
            await channel.bulkDelete(filtered, false).then(messages => {
                embed
                    .setTitle("Clearing...")
                    .setFields(
                        { name: "Amount:", value: `${Amount}`, inline: true },
                        { name: "Targeted:", value: `${Target}`, inline: true },
                        { name: "Amount I could clear", value: `${messages.size}` }
                    )
                    .setDescription(`${interaction.user} asked me to clear ${Amount} by ${Target} in this channel`)
                interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000))
                if (guildSettings.modChannelId) {
                    const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                    embed2
                        .setTitle('Mod alert')
                        .setDescription(`Messages where cleared for <@${Target.id}>`)
                        .setFields(
                            { name: `Whom cleared`, value: `<@${interaction.user.id}>`, inline: true },
                            { name: `Channel name`, value: `<#${channel.id}>`, inline: true },
                            { name: `Channel id`, value: `${channel.id}`, inline: true },
                            { name: `Ammount cleared`, value: `${Amount}`, inline: true },
                            { name: `Whom got targeted`, value: `<@${Target.id}>`, inline: true },
                        )
                    modChannel.send({ embeds: [embed2] })
                }
            }).catch(error => {
                if (error) {
                    errorEmbed
                        .addFields(
                            { name: `Guild Name:`, value: `${interaction.guild}`, inline: true },
                            { name: `Guild Id:`, value: `${interaction.guild.id}`, inline: true },
                            { name: `Command ran:`, value: `${commandName}`, inline: true },
                            { name: `Error:`, value: `${error}`, inline: false },
                        )
                    eChannel.send({ embeds: [errorEmbed] })
                    return;
                }
            })
        } else {
            await channel.bulkDelete(Amount, true).then(messages => {
                embed
                    .setTitle("Clearing...")
                    .setFields(
                        { name: "Amount:", value: `${Amount}` },
                        { name: "Amount I could clear", value: `${messages.size}` }
                    )
                    .setDescription(`${interaction.user} asked me to clear ${Amount} messages in this channel`)
                interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000))
                if (guildSettings.modChannelId) {
                    const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                    embed2
                        .setTitle('Mod alert')
                        .setDescription('Messages where cleared')
                        .setFields(
                            { name: `Whom cleared`, value: `<@${interaction.user.id}>`, inline: true },
                            { name: `Channel name`, value: `<#${channel.id}>`, inline: true },
                            { name: `Channel id`, value: `${channel.id}`, inline: true },
                            { name: `Ammount cleared`, value: `${Amount}` }
                        )
                    modChannel.send({ embeds: [embed2] })
                }
            }).catch(error => {
                if (error) {
                    eChannel.send({ embeds: [errorEmbed] })
                    return;
                }
            })
        }
    }
};