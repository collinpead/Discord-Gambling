const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Starts a game.')
        .addStringOption(option => 
            option
                .setName('game')
                .setDescription('The game you are choosing to play.')
                .setRequired(true)
                .addChoices(
                    { name: 'Blackjack', value: 'Blackjack'},
                )),

        async execute(interaction, gameState) {
            var game = ''

            const response = await fetch('http://localhost:5433/users/' + interaction.user.id, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            const user = await response.json();

            // Prompt user to register if they have not registered already.
            if (user.length == 0) {
                await interaction.reply(`Before playing you must first register with the /register command.`);
            }

            if (interaction.options.getString('game') === null) {
                await interaction.reply(`Please enter a game name after the command /play.`);
                return gameState;
            }
            else {
                game = interaction.options.getString('game');
            }
            // Outputs the id of the user who sent the command.
            console.log(interaction.user.id);

            if (gameState.isGame === true) {
                await interaction.reply(`Sorry, but I'm currently in the middle of a game of ${game}. Type /quit to end the current game before you try to start a new one.`);
                return gameState;
            }
            else if (game === 'Blackjack') {
                await interaction.reply(`Starting a game of ${game}.`);
                gameState.isGame = true;
                gameState.gameName = 'Blackjack';
                gameState.playerName = interaction.user.username;
                gameState.playerId = interaction.user.id;
                return gameState;
            }
            else {
                await interaction.reply(`Sorry, I do not know how to play ${game}.`);
                return gameState;
            }
        },
};