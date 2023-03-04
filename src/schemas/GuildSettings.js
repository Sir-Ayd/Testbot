const mongoose = require('mongoose');

const GuildSettingsSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildId: String,
    guildName: String,
    welcomeChannelId: String,
    memberRole: String,
    welcomeMessage: String,
    songChannelId: String,
    modChannelId: String,
    guildIcon: { type: String, required: false },
});

module.exports = mongoose.model("GuildSettings", GuildSettingsSchema);