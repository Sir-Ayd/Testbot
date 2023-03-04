const { QueryType } = require("discord-player");
const { EmbedBuilder, Message, Client } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { execute } = require("./play");

console.log('[ Command | leave      ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('WILD Bot will leave the voice channel - This deletes the queue!')
        .setDMPermission(false),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const queue = client.player.getQueue(interaction.guild);
        if (!queue) {
            embed
                .setTitle("Can't leave")
                .setDescription(`I\'m not even there!`)
                .setImage("https://media.giphy.com/media/mQpZtX0gKDESA/giphy.gif")
            await interaction.reply({ embeds: [embed] }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
                if (error) {
                    return;
                }
            })
        }
        const currentSong = queue.tracks[0]
        queue.destroy();
        embed
            .setTitle("Leaving...")
            .setDescription(`I left 😐`)
            .setFields(
                { name: "Warning!", value: "This has deleted all that's in the queue" }
            )
        await interaction.reply({
            embeds: [embed]
        }).then(setTimeout(() => interaction.deleteReply(), 3000)).catch(error => {
            if (error) {
                return;
            }
        })
    }
}