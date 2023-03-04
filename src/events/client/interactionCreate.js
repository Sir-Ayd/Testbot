const { InteractionType } = require("discord.js");
const queue = require("../../commands/music/queue");

console.log("[      interaction     ] ✅ Loaded!");

module.exports = {
	name: "interactionCreate",
	async execute(interaction, client, player) {
		if (interaction.isAutocomplete()) {
			const { commands } = client;
			const { commandName } = interaction;
			const command = commands.get(commandName);
			if (!command) return;
			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
		} else if (interaction.isChatInputCommand()) {
			const { commands } = client;
			const { commandName } = interaction;
			const command = commands.get(commandName);
			if (!command) return;
			try {
				await command.execute(interaction, client, player);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: `Something went wrong`,
					ephemeral: true,
				});
			}
		} else if (interaction.isButton()) {
			const { buttons } = client;
			const { customId } = interaction;
			const button = buttons.get(customId);
			if (!button) return new Error("There isnt code for this button");
			try {
				await button.execute(interaction, client, player);
			} catch (err) {
				console.error(err);
			}
		} else if (interaction.isStringSelectMenu()) {
			const { selectMenus } = client;
			const { customId } = interaction;
			const menu = selectMenus.get(customId);
			if (!menu) return new Error("There isnt code for this menu");
			try {
				await menu.execute(interaction, client);
			} catch (err) {
				console.error(err);
			}
		} else if (interaction.type == InteractionType.ModalSubmit) {
			const { modals } = client;
			const { customId } = interaction;
			const modal = modals.get(customId);
			if (!modal) return new Error("There isnt code for this modal");
			try {
				await modal.execute(interaction, client);
			} catch (err) {
				console.error(err);
			}
		} else if (interaction.isContextMenuCommand()) {
			const { commands } = client;
			const { commandName } = interaction;
			const contextCommand = commands.get(commandName);
			if (!contextCommand) return;
			try {
				await contextCommand.execute(interaction, client);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: `Something went wrong`,
					ephemeral: true,
				});
			}
		}
	},
};