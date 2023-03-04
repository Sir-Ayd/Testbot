require('dotenv').config();
const { token, dbToken } = process.env;
const mongoose = require("mongoose");
const { Client, Collection } = require('discord.js');
const { Player } = require("discord-player");
const fs = require('fs');
const client = new Client({ intents: 32767 });
client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];


const player = new Player(client);

client.on("error", () => {});

const funtionFolders = fs.readdirSync(`./src/functions`);
for (const folder of funtionFolders) {
    const funtionFiles = fs
        .readdirSync(`./src/functions/${folder}`)
        .filter(file => file.endsWith('.js'));
    for (const file of funtionFiles)
        require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.handleComponents();
client.login(token);
(async () => {
    mongoose.Promise = global.Promise;
    await mongoose.connect(dbToken, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).catch(console.error);
})();