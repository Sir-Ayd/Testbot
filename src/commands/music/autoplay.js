const { useQueue, QueueRepeatMode } = require("discord-player");
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, Client } = require("discord.js");

console.log('[ Command | loop         ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('once queue ends the bot will auto play')
        .setDMPermission(false)
        .addStringOption(option => option.setName('mode').setDescription('autoplay on or off').addChoices(
            { name: 'Off', value: 'OFF' },
            { name: 'On', value: 'ON' },
        ).setRequired(true)),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setFields(
                { name: 'Warning', value: `Using AutoPlay will disable loop` }
            )
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.isPlaying()) {
            return
        }
        const loopMode = interaction.options.getString("mode")
        if (loopMode === 'OFF') {
            const success = queue.setRepeatMode(QueueRepeatMode.OFF);
            await success
            embed
                .setTitle("AutoPlay/ looping Off")
            await interaction.reply({
                embeds: [embed]
            }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
        }
        if (loopMode === 'ON') {
            const success = queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
            await success
            embed
                .setTitle("AutoPlay On")
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
