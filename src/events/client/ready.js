const { ActivityType } = require("discord.js");

module.exports = {
    name: 'ready',
    once: 'true',
    async execute(client) {
        console.log(`[       ${client.user.tag}      ] ✅ Loaded!`);
        const s = [
            {
                type: 'W',
                content: 'over WILD server',
                status: 'online',
            },
            {
                type: 'P',
                content: 'WILD Network!',
                status: 'online',
            },
            {
                type: 'P',
                content: 'play.wildmc.uk',
                status: 'online',
            },
            {
                type: 'P',
                content: 'wildmc.co.uk',
                status: 'online',
            },
            {
                type: 'P',
                content: 'wildsmp.uk',
                status: 'online',
            },
            {
                type: 'P',
                content: 'wildsmp.co.uk',
                status: 'online',
            },
        ];
        async function p() {
            const option = Math.floor(Math.random() * s.length);
            try {
                if (s[option].type === 'P') {
                    await client.user.setPresence({
                        activities: [
                            {
                                name: `${s[option].content}`,
                                type: ActivityType.P,
                            },
                        ],
                        status: s[option].status,
                    });
                }
                if (s[option].type === 'W') {
                    await client.user.setPresence({
                        activities: [
                            {
                                name: `${s[option].content}`,
                                type: ActivityType.Watching,
                            },
                        ],
                        status: `${s[option].status}`,
                    });
                }
                if (s[option].type === 'L') {
                    await client.user.setPresence({
                        activities: [
                            {
                                name: `${s[option].content}`,
                                type: ActivityType.Listening,
                            },
                        ],
                        status: `${s[option].status}`,
                    });
                }
            } catch (error) {
                console.error(error)
                return;
            }
        }
        setInterval(p, 30000);
    }
}