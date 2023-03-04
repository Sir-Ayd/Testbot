const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ButtonInteraction, RPCCloseEventCodes, User } = require("discord.js");

console.log('[ Button  | role1      ] ✅ Loaded!')

module.exports = {
    data: {
        name: `role1`
    },
    async execute(interaction, client) {
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
        if (removedRoles.size > 0) {
            console.log(`The roles ${removedRoles.map(r => r.name)} were removed from ${oldMember.displayName}.`);
        }

        // If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
        if (addedRoles.size > 0) {
            console.log(`The roles ${addedRoles.map(r => r.name)} were added to ${oldMember.displayName}.`);
        }
    }
}
