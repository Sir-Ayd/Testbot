const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const Facts = require('../../../Facts.json')
const Jokes = require('../../../Jokes.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("random")
        .setDescription("Gives you a random fact or joke")
        .addSubcommand(subcommand => subcommand
            .setName("fact")
            .setDescription("Gives you a random fact")
        )
        .addSubcommand(subcommand => subcommand
            .setName("joke")
            .setDescription("Gives you a random joke")
        )
        .setDMPermission(true),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setColor(0x1d8f2e)
            .setTimestamp()
            .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
        if (interaction.options.getSubcommand() === "fact") {
            const facts = Facts.facts
            const totalFacts = facts.length;
            const randomFact = facts[Math.floor(Math.random() * totalFacts)]
            embed
                .setTitle('Random Fact')
                .setFields(
                    { name: `Did you know?`, value: `${randomFact.fact}` },
                )
            interaction.reply({ embeds: [embed] });
        }
        if (interaction.options.getSubcommand() === "joke") {
            const jokes = Jokes.jokes;
            const totalJokes = jokes.length;
            const randomJoke = jokes[Math.floor(Math.random() * totalJokes)]
            if (!randomJoke.punchline) {
                embed
                    .setTitle(`Random Joke`)
                    .setDescription(`Got a funny bone?`)
                    .setFields(
                        { name: `Joke`, value: `${randomJoke.joke}` },
                    )
                interaction.reply({ embeds: [embed] });
            }
            if (randomJoke.punchline) {
                embed
                    .setTitle(`Random Joke`)
                    .setDescription(`Got a funny bone?`)
                    .setFields(
                        { name: `Joke`, value: `${randomJoke.joke}` },
                        { name: `Punchline`, value: `${randomJoke.punchline}`}
                    )
                interaction.reply({ embeds: [embed] });
            }
        }
    }
}