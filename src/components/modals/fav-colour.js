
console.log('[ modal   | fav-colour ] ✅ Loaded!')

module.exports = {
    data: {
        name: `fav-colour`
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: `You said your favorite colour is: ${interaction.fields.getTextInputValue("favColourInput")}`
        });
    }
}