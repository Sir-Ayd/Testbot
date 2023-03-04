const { EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose')
const GuildSettings = require('../../schemas/GuildSettings');

module.exports = {
    name: "guildCreate",
    async execute(guild, client) {
        const embed = new EmbedBuilder()
            .setTitle(`I joined a server`)
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        let settings = await GuildSettings.findOne({ guildId: guild.id });
        if (!settings) {
            settings = new GuildSettings({
                _id: mongoose.Types.ObjectId(),
                guildId: guild.id,
                guildName: guild.name,
                guildIcon: guild.iconURL() ? guild.iconURL() : "None."
            });
            const serverIcon = guild.iconURL() ? guild.iconURL() : "none"
            if (serverIcon === 'none') {
                embed
                    .setFields(
                        { name: `Guild:`, value: `${guild.name}`, inline: true },
                        { name: `Guild Id:`, value: `${guild.id}`, inline: true },
                    )
            }
            if (serverIcon !== 'none') {
                embed
                    .setFields(
                        { name: `Guild:`, value: `${guild.name}`, inline: true },
                        { name: `Guild Id:`, value: `${guild.id}`, inline: true },
                    )
                    .setThumbnail(`${serverIcon}`)
            }
            const channel = client.guilds.cache.get('617923284868005894').channels.cache.get('1063209715414347816')
            await channel.send({ embeds: [embed] })
            await settings.save().catch(console.error);
        }
    }
}