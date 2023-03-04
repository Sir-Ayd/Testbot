const { EmbedBuilder } = require('discord.js');
const GuildSettings = require('../../schemas/GuildSettings');

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        const guildSettings = await GuildSettings.findOne({ guildId: member.guild.id });
        if (!guildSettings || !guildSettings.welcomeChannelId) {
            return;
        };
        const wm = guildSettings.welcomeMessage || null
        const gifs = [
            'https://media.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.gif',
            'https://media.giphy.com/media/kHs1lBhZWaK5rj7lt3/giphy.gif',
            'https://media.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif',
            'https://media.giphy.com/media/KczqttEJqm55hE1ccU/giphy.gif',
            'https://media.giphy.com/media/XD9o33QG9BoMis7iM4/giphy.gif',
            'https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif',
            'https://media.giphy.com/media/12B39IawiNS7QI/giphy.gif',
            'https://media.giphy.com/media/eoVusT7Pi9ODe/giphy.gif',
        ]
        const totalGifs = gifs.length;
        const randomGif = gifs[Math.floor(Math.random() * totalGifs)]
        if (guildSettings.modChannelId) {
            const modChannel = member.guild.channels.cache.get(guildSettings.modChannelId);
            const embed = new EmbedBuilder()
                .setTitle('Mod alert')
                .setColor(0x1d8f2e)
                .setThumbnail(member.user.avatarURL())
                .setDescription('A member has joined the server')
                .addFields(
                    { name: `Whom joined`, value: `${member}`, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
            modChannel.send({ embeds: [embed] })
        }
        const embed = new EmbedBuilder()
            .setTitle("Welcome!")
            .setColor(0x1d8f2e)
            .setThumbnail(member.user.avatarURL())
            .setImage(`${randomGif}`)
            .setDescription(`${member} ${wm}`)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        member.guild.channels.cache.get(guildSettings.welcomeChannelId).send({ embeds: [embed] }).catch(error => {
            if (error) {
                return;
            }
        })
    }
};