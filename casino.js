// Boilerplate main file source code derived from:
// https://discordjs.guide/creating-your-bot/main-file.html#running-your-application

const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection} = require("discord.js");
const { token } = require("./config.json");
const { createServer } = require('./server/createServer');

// Instantiate the client.
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// Instantiate the express server.
createServer(client);

client.commands = new Collection();

// Create a path to the commands folder based on the current directory.
const commandsPath = path.join(__dirname, 'commands');
// Create an array of JavaScript files found within the commands folder,
// using a filter to ensure the array only contains JavaScript files.
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    // Path to the current file in the array of command files.
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Asynchronous event listener function.
client.on(Events.InteractionCreate, async interaction => {
    // Do nothing if the input is not a chat input command.
    if (!interaction.isChatInputCommand()) return;
    
	const command = interaction.client.commands.get(interaction.commandName);

    // If the command is not found in the list of commands.
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		gameState = await command.execute(interaction, gameState);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

// Launch bot event, with a cute and quirky message.
client.on(Events.ClientReady, (c) => {
    console.log(`Hiii! ${c.user.tag} is now live!!!`)
	// gameState is an object to track various details of the current session without database queries.
	gameState = {
		isGame: false,
		isBet: false,
		isDeal: false,
		gameName: "",
		playerName: "", 
		playerId: 0, 
		playerBet: 0,
		playerCards: [],
		dealerCards: [],
		deck: [],
		deckIndex: 0
	}
});

client.login(token);
