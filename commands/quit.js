const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quit')
        .setDescription('Quits the current game.'),

        async execute(interaction, gameState) {

            if (gameState.isGame === false) {
                await interaction.reply(`There is not a game ongoing to quit.`);
                return gameState;
            }
            else {
                await interaction.reply(`Quitting the current game.`);
                gameState.isGame = false;
                gameState.isBet = false;
                gameState.isDeal = false;
                gameState.gameName = "";
                gameState.playerName = "";
                gameState.playerId = 0;
                gameState.playerBet = 0;
                gameState.playerCards = [];
                gameState.dealerCards = [];
                return gameState;
            }
        },
};