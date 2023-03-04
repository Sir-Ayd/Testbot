const { useMasterPlayer, useQueue } = require("discord-player");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const GuildSettings = require("../../schemas/GuildSettings");

console.log("[ Command | play       ] ✅ Loaded!");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play some music")
		.setDMPermission(false)
		.addStringOption((option) =>
			option.setName("search").setDescription("search").setRequired(true).setAutocomplete(true)
		),
	async autocomplete(interaction) {
		const player = useMasterPlayer();
		const query = interaction.options.getString("search", true);
		const results = await player.search(query);
		return interaction.respond(
			results.tracks.slice(0, 10).map((t) => ({
				name: t.title,
				value: t.url,
			}))
		);
	},
	async execute(interaction, client) {
		const control = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setCustomId("previous").setEmoji("1067434669437616128").setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId("queue").setEmoji("1067434673703239710").setStyle(ButtonStyle.Success),
			new ButtonBuilder().setCustomId("pause").setEmoji("1067434677197082715").setStyle(ButtonStyle.Danger),
			new ButtonBuilder().setCustomId("skip").setEmoji("1067434671266336808").setStyle(ButtonStyle.Success)
		);
		const embed = new EmbedBuilder()
			.setColor(0x1d8f2e)
			.setTimestamp()
			.setFooter({ text: "WILD Bot", iconURL: "https://i.imgur.com/aGjcDdv.jpg" });
		const errorEmbed = new EmbedBuilder()
			.setTitle("Error!")
			.setDescription("An error occured!")
			.setColor(0x1d8f2e)
			.setTimestamp()
			.setFooter({ text: "WILD Bot", iconURL: "https://i.imgur.com/aGjcDdv.jpg" });
		const player = useMasterPlayer();
		await interaction.deferReply();
		if (!interaction.member.voice.channel) {
			embed
				.setTitle("Can't join without you!")
				.setDescription(`You need to be in a Voice Channel to use this command`)
				.setFields({ name: "Music Channel?", value: `https://discord.gg/7aAsSfZA` });
			await interaction.followUp({ embeds: [embed] });
			setTimeout(() => interaction.deleteReply(), 7500);
			return;
		}
		const query = interaction.options.getString("search");
		const result = await player.search(query);
		if (!result.hasTracks()) {
			await interaction.editReply(`No tracks`);
		} else {
			await player.play(interaction.member.voice.channel, result, {
				nodeOptions: {
					metadata: {
						channel: interaction.channel,
						client: interaction.guild.members.me,
						requestedBy: interaction.user,
					},
					autoSelfDeaf: true,
					initialVolume: 20,
					leaveOnEmpty: true,
					leaveOnEmptyCooldown: 300000,
					leaveOnEnd: true,
					leaveOnEndCooldown: 300000,
				},
			});
		}
		const queue = useQueue(interaction.guild.id);
		const guildSettings = await GuildSettings.findOne({ guildId: queue.guild.id });
		const channel = queue.guild.channels.cache.get(guildSettings.songChannelId);
		const track = queue.currentTrack;

		embed
			.setTitle("Now playing")
			.setDescription(`[${track.title}](${track.url})`)
			.setThumbnail(track.thumbnail ?? interaction.user.displayAvatarURL());
		if (!channel) {
			await interaction.followUp({
				embeds: [embed],
				components: [control],
			});
		} else {
			await interaction.followUp({
				embeds: [embed],
			});
		}
	},
};