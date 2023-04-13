const { REST, Routes } = require('discord.js');

// Load the .env file.
require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const { token, clientId, guildId } = require("./config.json");

const commands = [];
// Create a path to the commands folder based on the current directory.
const commandsPath = path.join(__dirname, 'commands');
// Create an array of JavaScript files found within the commands folder,
// using a filter to ensure the array only contains JavaScript files.
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();