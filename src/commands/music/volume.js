const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message, Client } = require("discord.js");

console.log('[ Command | volume      ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Set the volume the bot plays at for all')
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName('current')
            .setDescription('Tells you the current volume'))
        .addSubcommand(subcommand => subcommand
            .setName('set')
            .setDescription('Set volume level')
            .addNumberOption(option => option.setName('level').setDescription('The level of the volume').setRequired(true))),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const queue = client.player.getQueue(interaction.guild);
        const level = interaction.options.getNumber('level')
        const vol = parseInt(level)
        if (!queue || !queue.playing) {
            return
        }
        if (interaction.options.getSubcommand() === "current") {
            embed
                .setTitle("Volume")
                .setDescription(`The current volume is **${queue.volume}**`)
            await interaction.reply({
                embeds: [embed]
            }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
        }

        if (interaction.options.getSubcommand() === "set") {
            if ((vol < 0) || (vol > 100)) {
                return void interaction.reply({ content: `Volume must be 0-100`, ephemeral: true })
            }
            if (vol) {
                await queue.setVolume(vol);
                embed
                    .setTitle("Volume")
                    .setDescription(`Set to **${vol}**`)
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
}