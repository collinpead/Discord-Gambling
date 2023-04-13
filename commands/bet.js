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

            // Check if a game has started yet.
            if (gameState.isGame == false) {
                await interaction.reply(`Sorry, but we haven't started playing a game yet.`);
                return gameState;
            }

            if (gameState.isBet == true) {
                await interaction.reply(`You have already bet, please wait until the next round to make another bet.`);
                return gameState;
            }

            const bet = parseInt(interaction.options.getString('bet'));
            if (isNaN(bet) || bet < 1) {
                await interaction.reply(`Please enter a positive integer value for your bet.`);
                return gameState;
            }

            const response = await fetch('http://localhost:5433/users/' + gameState.playerId, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            });
            const user = await response.json();

            console.log("The user has " + user[0]['points'])
            if (bet > user[0]['points']) {
                await interaction.reply(`You cannot bet more points than you have. Check your points with the /points command.`);
            }
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