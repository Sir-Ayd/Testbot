
console.log('[ menu    | sub-menu   ] ✅ Loaded!')

module.exports = {
    data: {
        name: `sub-menu`
    },
    async execute(interaction, client) {
        await interaction.reply({
            content: `You selected: ${interaction.values[0]}`
        });
    }
}