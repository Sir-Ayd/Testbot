const { QueueRepeatMode } = require("discord-player");
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, Client } = require("discord.js");

console.log('[ Command | loop         ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('loop the queue')
        .setDMPermission(false)
        .addStringOption(option => option.setName('mode').setDescription('Loop mode to use').addChoices(
            { name: 'Off', value: 'OFF' },
            { name: 'Track', value: 'TRACK' },
            { name: 'Queue', value: 'QUEUE' },
        ).setRequired(true)),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFields(
                { name: 'Warning', value: `Using loop will disable AutoPlay` }
            )
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const queue = client.player.getQueue(interaction.guild);
        if (!queue || !queue.playing) {
            return
        }
        const loopMode = interaction.options.getString("mode")
        if (loopMode === 'OFF') {
            const success = queue.setRepeatMode(QueueRepeatMode.OFF);
            const mode = loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';
            await success
            embed
                .setTitle("Looping/ AutoPlay Off")
            await interaction.reply({
                embeds: [embed]
            }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
        }
        if (loopMode === 'TRACK') {
            const success = queue.setRepeatMode(QueueRepeatMode.TRACK);
            const mode = loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';
            await success
            embed
                .setTitle("Looping current Track")
                .setDescription(`${success}` ? `${mode} | Updated loop mode!` : '❌ | Could not update loop mode!')
            await interaction.reply({
                embeds: [embed]
            }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
        }
        if (loopMode === 'QUEUE') {
            const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);
            const mode = loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';
            await success
            embed
                .setTitle("Looping current Queue")
                .setDescription(`${success}` ? `${mode} | Updated loop mode!` : '❌ | Could not update loop mode!')
            await interaction.reply({
                embeds: [embed]
            }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
        }
    }
}