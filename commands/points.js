const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('points')
        .setDescription('Shows a user how many points they have.'),

        async execute(interaction, gameState) {

            const response = await fetch('http://localhost:5433/users/' + interaction.user.id, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            const user = await response.json();

            // Prompt user to register if they have not registered already.
            if (user.length == 0) {
                await interaction.reply(`To acquire points you must first use the /register command.`);
            }

            await interaction.reply(`You currently have ` + user[0]['points'] + ` points.`);

            return gameState;
        },
};