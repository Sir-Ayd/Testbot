const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const GuildSettings = require('../../schemas/GuildSettings');
module.exports = {
    name: "playerStart",
    once: false,
    async execute(queue, track) {
        const guildSettings = await GuildSettings.findOne({ guildId: queue.guild.id });
        let count = 0
        const control = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setEmoji('1067434669437616128')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('queue')
                    .setEmoji('1067434673703239710')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('pause')
                    .setEmoji('1067434677197082715')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setEmoji('1067434671266336808')
                    .setStyle(ButtonStyle.Success),
            )
        const control2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setEmoji('1067434669437616128')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('queue')
                    .setEmoji('1067434673703239710')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('resume')
                    .setEmoji('1067434675326423060')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setEmoji('1067434671266336808')
                    .setStyle(ButtonStyle.Success),
            )
        const control3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setEmoji('1067434669437616128')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('queue')
                    .setEmoji('1067434673703239710')
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('pause')
                    .setEmoji('1067434677197082715')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setEmoji('1067434671266336808')
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
            )
        const control4 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setEmoji('1067434669437616128')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('queue')
                    .setEmoji('1067434673703239710')
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('resume')
                    .setEmoji('1067434675326423060')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setEmoji('1067434671266336808')
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
            )
        const options = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('autoplay')
                    .setEmoji('1067434666828771429')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('loopt')
                    .setEmoji('1067439505579184180')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('loopq')
                    .setEmoji('1067439510914334840')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('shuffle')
                    .setEmoji('1067436640441737307')
                    .setStyle(ButtonStyle.Success),
            )
        const embed = new EmbedBuilder()
            .setTitle("Now Playing:")
            .setColor(0x1d8f2e)
            .setDescription(`**[${track.title}](${track.url})**`)
            .setImage(track.thumbnail)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const errorEmbed = new EmbedBuilder()
            .setTitle('Error!')
            .setDescription('An error occured!')
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        if (!guildSettings || !guildSettings.songChannelId) {
            return
        }
        if (queue.guild.id === guildSettings.guildId) {
            const channel = queue.guild.channels.cache.get(guildSettings.songChannelId);
            if (!channel) {
                return;
            }
            var modeRepeat = ['Off', 'Track', 'Queue', 'Auto Play']
            embed
                .setFields(
                    { name: "Queue amount", value: `${queue.tracks.size}`, inline: true },
                    { name: "Current volume", value: `${queue.dispatcher.volume}`, inline: true },
                    { name: "Loop/ AutoPlay mode", value: `${modeRepeat[queue.repeatMode.valueOf()]}`, inline: true }
                )
            let Msg = await channel.send({
                embeds: [embed]
            })
            var interval = setInterval(() => {
                const check = queue.guild.channels.cache.get(guildSettings.songChannelId)
                if (queue.deleted) {
                    if (!check) {
                        clearInterval(interval)
                        return;
                    }
                    if (check) {
                        clearInterval(interval)
                        Msg.delete()
                        return;
                    }
                }
                if (check) {
                    const currentStreamTime = queue.node.streamTime;
                    try {
                        const totalTime = track.durationMS;
                        const currentTime = Math.round((currentStreamTime / totalTime) * 100)
                        const clearTime = currentTime + 1
                        if (clearTime === 100) {
                            if (!check) {
                                clearInterval(interval)
                                return;
                            }
                            if (check) {
                                clearInterval(interval)
                                Msg.delete()
                                return;
                            }
                        }
                    } catch (error) {
                        if (error) {
                            if (!check) {
                                clearInterval(interval)
                                return;
                            }
                            if (check) {
                                clearInterval(interval)
                                Msg.delete()
                                return;
                            }
                        }
                    }
                    if (queue.tracks.size <= 0) {
                        if (queue.node.isPaused()) {
                            Msg.edit({
                                embeds: [embed.setFields(
                                    { name: "Duration", value: `${queue.node.createProgressBar()}` },
                                    { name: "Queue amount", value: `${queue.tracks.size}`, inline: true },
                                    { name: "Current volume", value: `${queue.dispatcher.volume}`, inline: true },
                                    { name: "Loop/ AutoPlay mode", value: `${modeRepeat[queue.repeatMode.valueOf()]}`, inline: true }
                                )], components: [control4, options]
                            }).catch(error => {
                                if (error) clearInterval(interval)
                            }).then(() => count++).catch(error => {
                                if (error) {
                                    if (!check) {
                                        clearInterval(interval)
                                        return;
                                    }
                                    if (check) {
                                        clearInterval(interval)
                                        Msg.delete()
                                        return;
                                    }
                                }
                            })
                        }
                        if (queue.node.isPlaying()) {
                            Msg.edit({
                                embeds: [embed.setFields(
                                    { name: "Duration", value: `${queue.node.createProgressBar()}` },
                                    { name: "Queue amount", value: `${queue.tracks.size}`, inline: true },
                                    { name: "Current volume", value: `${queue.dispatcher.volume}`, inline: true },
                                    { name: "Loop/ AutoPlay mode", value: `${modeRepeat[queue.repeatMode.valueOf()]}`, inline: true }
                                )], components: [control3, options]
                            }).catch(error => {
                                if (error) clearInterval(interval)
                            }).then(() => count++).catch(error => {
                                if (error) {
                                    if (!check) {
                                        clearInterval(interval)
                                        return;
                                    }
                                    if (check) {
                                        clearInterval(interval)
                                        Msg.delete()
                                        return;
                                    }
                                }
                            })
                        }
                    }
                    if (queue.tracks.size >= 1) {
                        if (queue.node.isPaused()) {
                            Msg.edit({
                                embeds: [embed.setFields(
                                    { name: "Duration", value: `${queue.node.createProgressBar()}` },
                                    { name: "Queue amount", value: `${queue.tracks.size}`, inline: true },
                                    { name: "Current volume", value: `${queue.dispatcher.volume}`, inline: true },
                                    { name: "Loop/ AutoPlay mode", value: `${modeRepeat[queue.repeatMode.valueOf()]}`, inline: true }
                                )], components: [control2, options]
                            }).catch(error => {
                                if (error) clearInterval(interval)
                            }).then(() => count++).catch(error => {
                                if (error) {
                                    if (!check) {
                                        clearInterval(interval)
                                        return;
                                    }
                                    if (check) {
                                        clearInterval(interval)
                                        Msg.delete()
                                        return;
                                    }
                                }
                            })
                        }
                        if (queue.node.isPlaying()) {
                            Msg.edit({
                                embeds: [embed.setFields(
                                    { name: "Duration", value: `${queue.node.createProgressBar()}` },
                                    { name: "Queue amount", value: `${queue.tracks.size}`, inline: true },
                                    { name: "Current volume", value: `${queue.dispatcher.volume}`, inline: true },
                                    { name: "Loop/ AutoPlay mode", value: `${modeRepeat[queue.repeatMode.valueOf()]}`, inline: true }
                                )], components: [control, options]
                            }).catch(error => {
                                if (error) clearInterval(interval)
                            }).then(() => count++).catch(error => {
                                if (error) {
                                    if (!check) {
                                        clearInterval(interval)
                                        return;
                                    }
                                    if (check) {
                                        clearInterval(interval)
                                        Msg.delete()
                                        return;
                                    }
                                }
                            })
                        }
                    }
                }
            }, 1000)
        }
    }
}