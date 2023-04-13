const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bet')
        .setDescription('Player makes their bet.')
        .addStringOption(option => 
            option
                .setName('bet')
                .setDescription('The number of points you are betting.')
                .setRequired(true)),


        async execute(interaction, gameState) {

            // Check if a game has started yet
            if (gameState.isGame == false) {
                await interaction.reply(`Sorry, but we haven't started playing a game yet.`);
                return gameState;
            }
            // Check if the player has already bet, before cards have been dealt
            if (gameState.isBet == true) {
                await interaction.reply(`You have already bet, please wait until the next round to make another bet.`);
                return gameState;
            }

            // Evaluate if the bet value is valid
            const bet = parseInt(interaction.options.getString('bet'));
            if (isNaN(bet) || bet < 1) {
                await interaction.reply(`Please enter a positive integer value for your bet.`);
                return gameState;
            }
            // Retrieve user information to check how many points they are able to bet
            const response = await fetch('http://localhost:5433/users/' + gameState.playerId, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            const user = await response.json();

            // Check if the value of the bet is greater than the amount of points the player owns
            if (bet > user[0]['points']) {
                await interaction.reply(`You cannot bet more points than you have. Check your points with the /points command.`);
            }
            // If a valid bet is made, make a POST request to update the database and update gameState
            else {
                await interaction.reply(`${gameState.playerName} has placed a bet of ${bet}.`);
                gameState.playerBet = bet;
                gameState.isBet = true;
                const response = await fetch('http://localhost:5433/bet/' + gameState.playerId + '/' + (-1 * bet), {
                    method: 'POST',
                })
                console.log(response.status);
            }

            return gameState;
        },
};
