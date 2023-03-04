const { SlashCommandBuilder, ActionRowBuilder, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

console.log('[ Command | roles      ] ✅ Loaded!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Get roles command')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),

    async execute(interaction, client) {
        let embed = new EmbedBuilder
        const role1 = new ButtonBuilder()
            .setCustomId('role1')
            .setLabel('Role 1')
            .setStyle(ButtonStyle.Success);
        const role2 = new ButtonBuilder()
            .setCustomId('role2')
            .setLabel('Role 2')
            .setStyle(ButtonStyle.Success);
        const role3 = new ButtonBuilder()
            .setCustomId('role3')
            .setLabel('Role 3')
            .setStyle(ButtonStyle.Success);
        const role4 = new ButtonBuilder()
            .setCustomId('role4')
            .setLabel('Role 4')
            .setStyle(ButtonStyle.Success);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Get roles!")
                    .setColor(0x1d8f2e)
                    .setFields(
                        { name: "Role1", value: `value`, inline: true },
                        { name: "Role2", value: `value`, inline: true }
                    )
                    .setDescription("Role placeholders")
                    .setTimestamp()
                    .setFooter({ text: 'WILD Bot', iconURL: 'https://i.imgur.com/aGjcDdv.jpg' })
            ], components: [new ActionRowBuilder().addComponents(role1, role2, role3, role4)]
        })
    }
}