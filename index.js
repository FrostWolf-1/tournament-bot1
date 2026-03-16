require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST } = require('discord.js');

const TOKEN = process.env.TOKEN;
const JUDGE_ROLE_ID = process.env.JUDGE_ROLE_ID;
const RESULTS_CHANNEL_ID = process.env.RESULTS_CHANNEL_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Register slash commands
const commands = [
    new SlashCommandBuilder()
        .setName('result')
        .setDescription('Submit match result')
        .addStringOption(option => option.setName('team1').setDescription('First team').setRequired(true))
        .addStringOption(option => option.setName('team2').setDescription('Second team').setRequired(true))
        .addStringOption(option => option.setName('winner').setDescription('Winning team').setRequired(true)),
    new SlashCommandBuilder()
        .setName('set_results_channel')
        .setDescription('Set the channel for match results')
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands('1482923636682788875'),
            { body: commands.map(c => c.toJSON()) }
        );
        console.log('Slash commands registered.');
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'result') {
        if (!interaction.member.roles.cache.has(JUDGE_ROLE_ID)) {
            return interaction.reply({ content: '❌ You are not allowed to submit results.', ephemeral: true });
        }

        const team1 = interaction.options.getString('team1');
        const team2 = interaction.options.getString('team2');
        const winner = interaction.options.getString('winner');

        const channel = await interaction.guild.channels.fetch(RESULTS_CHANNEL_ID);
        if (!channel) {
            return interaction.reply({ content: '❌ Results channel not found.', ephemeral: true });
        }

        await channel.send(`🏆 Match Result\n\n${team1} vs ${team2}\nWinner: ${winner}\n\nJudge: ${interaction.user.username}`);

        return interaction.reply({ content: '✅ Result submitted!', ephemeral: true });
    }

    if (commandName === 'set_results_channel') {
        return interaction.reply({ content: 'Results channel is already set in the environment variables.', ephemeral: true });
    }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login(TOKEN);