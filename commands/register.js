const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register a player.'),

        async execute(interaction, gameState) {
            const uid = interaction.user.id;
            const name = interaction.user.username;

            const response = await fetch('http://localhost:5433/users/' + uid, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            const user = await response.json();

            if (user.length == 0) {
                await interaction.reply(`Registering new user ${interaction.user.username}.`);
                await fetch('http://localhost:5433/users/' + uid + '/' + name, {
                    method: 'POST'
                });
            }
            else {
                await interaction.reply(`User ${interaction.user.username} is already registered.`);
            }
            return gameState;
        },
};