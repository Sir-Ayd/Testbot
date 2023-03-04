const GuildSettings = require('../../schemas/GuildSettings');

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        const guildSettings = await GuildSettings.findOne({ guildId: member.guild.id });
        if (!guildSettings || !guildSettings.memberRole) {
            return;
        };
        if (member.guild.id === guildSettings.guildId) {
            var role = member.guild.roles.cache.find(role => role.id === guildSettings.memberRole);
            member.roles.add(role).catch(error => {
                if (error) {
                    return;
                }
            })
        }
    }
};