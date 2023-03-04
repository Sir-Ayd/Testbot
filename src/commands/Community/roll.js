const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');


console.log('[ Command | roll      ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Roll as many sided dices as you wish')
        .setDMPermission(true)
        .addStringOption(option => option.setName('amount').setDescription('How many dice(s) would you like to roll?').setRequired(true))
        .addStringOption(option => option.setName('sides').setDescription('How many dice sides would you like?').setRequired(true))
        .addStringOption(option => option.setName('sign').setDescription('Choose "Positive" or "Negative" multiplier.').addChoices(
            { name: 'Positive', value: '+' },
            { name: 'Negative', value: '-' },
        ))
        .addStringOption(option => option.setName('multiplier').setDescription('How big of a multiplier?'))
        .addStringOption(option => option.setName('description').setDescription('Give a description')),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        const amount = interaction.options.getString("amount")
        const sides = interaction.options.getString("sides")
        const sign = interaction.options.getString("sign")
        const multi = interaction.options.getString("multiplier")
        const description = interaction.options.getString("description") || '\u200b'
        const member = interaction.user
        const output = amount*sides
        function randomIntFromInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min)
          }
          const result = randomIntFromInterval(1, output)
        if (!interaction.options.getString("multi")) {
            if (sign === "+") {
                const total = Number(result) + Number(multi)
                embed
                    .setDescription(`${member} 🎲 \n${description}`)
                    .setFields(
                        { name: "Input", value: `${amount}d${sides}${sign}${multi}`, inline: true },
                        { name: "Result", value: `${result}`, inline: true },
                        { name: "Total", value: `${total}`, inline: true }
                    )
                    interaction.reply({ embeds: [embed] })
                    return;
            }
            if (sign === "-") {
                const total = Number(result) - Number(multi)
                embed
                    .setDescription(`${member} 🎲 \n${description}`)
                    .setFields(
                        { name: "Input", value: `${amount}d${sides}${sign}${multi}`, inline: true },
                        { name: "Result", value: `${result}`, inline: true },
                        { name: "Total", value: `${total}`, inline: true }
                    )
                    interaction.reply({ embeds: [embed] })
                    return;
            }
        }
        embed
            .setDescription(`${member} 🎲 \n${description}`)
            .setFields(
                { name: "Input", value: `${amount}d${sides}`, inline: true },
                { name: "Result", value: `${result}`, inline: true },
                { name: "Total", value: `${result}`, inline: true }
            )
            interaction.reply({ embeds: [embed] })
    }
}
