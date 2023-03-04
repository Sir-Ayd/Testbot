
console.log('[ Button  | youtube    ] ✅ Loaded!')

module.exports = {
    data: {
        name: `youtube`
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: `https://www.youtube.com/`
        })
    }
}