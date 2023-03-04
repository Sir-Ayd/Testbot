const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, WelcomeChannel } = require('discord.js');
const GuildSettings = require('../../schemas/GuildSettings');
console.log('[ Command | nuke       ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Nukes the entire channel')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageChannels),
    async execute(interaction, client) {
        const { channel } = interaction;
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' });
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
        if (!interaction.guild.id === guildSettings.guildId) {
            return;
        }

        channel.clone().then
            ((ch) => {
                ch.setParent(channel.parent);
                ch.setPosition(channel.position);
                channel.delete().then(() => {
                    embed
                        .setTitle("This channel has been nuked!")
                        .setImage('https://media.giphy.com/media/HhTXt43pk1I1W/giphy.gif')
                    ch.send({ embeds: [embed] }).then((msg) => {
                        setTimeout(() => {
                            msg.delete()
                        }, 5000);
                    })
                    if (guildSettings.modChannelId) {
                        const modChannel = interaction.guild.channels.cache.get(guildSettings.modChannelId);
                        embed
                            .setTitle('Mod alert')
                            .setDescription('A channel was nuked')
                            .setFields(
                                { name: `Whom nuked`, value: `<@${interaction.user.id}>`, inline: true },
                                { name: `The channel nuked`, value: `${channel.name}`, inline: true },
                            )
                        modChannel.send({ embeds: [embed] })
                    }
                    if (channel.id === guildSettings.welcomeChannelId) {
                        guildSettings.welcomeChannelId = ch.id;
                        guildSettings.save();
                    }
                    if (channel.id === guildSettings.songChannelId) {
                        guildSettings.songChannelId = ch.id;
                        guildSettings.save();
                    }
                    if (channel.id === guildSettings.modChannelId) {
                        guildSettings.modChannelId = ch.id;
                        guildSettings.save();
                    }
                }).catch(error => {
                    if (error) {
                        return;
                    }
                })

            });

    }
} 