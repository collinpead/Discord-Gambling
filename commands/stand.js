const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { formatCards, rankToInteger, resetGameConditions } = require('../cardHelper.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stand')
        .setDescription(`Player chooses to not add another card to their hand.`),

        async execute(interaction, gameState) {
            if (gameState.isDeal == true) {
                const deck = gameState.deck;
                const dealerDrawsUntil = 17;
                let deckIndex = gameState.deckIndex;
                let playerScore = gameState.playerCards.map(card => rankToInteger(card, true)).reduce((sum, current) => sum + current, 0);
                let dealerScore = gameState.dealerCards.map(card => rankToInteger(card, true)).reduce((sum, current) => sum + current, 0);
                
                // Secondary score evaluation where Aces are evaluated as 1 instead of 11, if the player's score is over 21
                if (playerScore > 21) {
                    playerScore = gameState.playerCards.map(card => rankToInteger(card, false)).reduce((sum, current) => sum + current, 0);
                }

                // The dealer wins by score, before drawing additional cards
                if (dealerScore > playerScore) {
                    await interaction.reply(`Dealer reveals ` + gameState.dealerCards.map(card => formatCards(card))
                    + `(` + dealerScore
                    + `)\nThe dealer wins.`);
                    gameState = resetGameConditions(gameState);
                }
                else {
                    await interaction.reply(`Dealer reveals ` + gameState.dealerCards.map(card => formatCards(card))
                    + `(` + dealerScore
                    + `)\n`);
                    // Dealer draws until their score beats the player or they hit at least 17
                    while (dealerScore < Math.min(playerScore, dealerDrawsUntil)) {
                        await wait(1500);
                        // Deal 1 cards to the dealer.
                        gameState.dealerCards.push(deck.cards[deckIndex++]);
                        gameState.deckIndex = deckIndex;

                        dealerScore = gameState.dealerCards.map(card => rankToInteger(card, true)).reduce((sum, current) => sum + current, 0);
                        
                        // Secondary score evaluation where Aces are evaluated as 1 instead of 11, if the dealer's score is over 21
                        if (dealerScore > 21) {
                            dealerScore = gameState.dealerCards.map(card => rankToInteger(card, false)).reduce((sum, current) => sum + current, 0);
                        }

                        await interaction.followUp(`Dealer draws a card ` + gameState.dealerCards.map(card => formatCards(card))
                        + ` (` + dealerScore
                        + `)\n`);
                    }
                    // The dealer busts and the player wins
                    if (dealerScore > 21) {
                        await interaction.followUp(`The dealer has busted.\n`
                                                    + `You win! ${gameState.playerBet * 2} points awarded to ${gameState.playerName}.\n`
                                                    + `If you would like to continue, make another bet with the /bet command.`);
                        gameState = resetGameConditions(gameState);
                        const response = await fetch('http://localhost:5433/bet/' + gameState.playerId + '/' + (2 * gameState.playerBet), {
                            method: 'POST'
                        })
                        console.log(response.status);
                    }
                    // The dealer and the player draw, bet is refunded
                    else if (dealerScore == playerScore) {
                        await interaction.followUp(`You have drawn with the dealer.\n`
                                                    + `Bet is refunded.\n`
                                                    + `If you would like to continue, make another bet with the /bet command.`);
                        gameState = resetGameConditions(gameState);
                        const response = await fetch('http://localhost:5433/bet/' + gameState.playerId + '/' + gameState.playerBet, {
                            method: 'POST'
                        })
                        console.log(response.status);
                    }
                    // The dealer wins by score
                    else if (dealerScore > playerScore) {
                        await interaction.followUp(`The dealer wins with a score of ${dealerScore}.\n`
                                                    + `If you would like to continue, make another bet with the /bet command.`);
                        gameState = resetGameConditions(gameState);
                    }
                    // The player wins by score, player is awarded twice the value of their bet
                    else if (playerScore > dealerScore) {
                        await interaction.followUp(`${gameState.playerName} wins with a score of ${playerScore}.\n`
                                                    + `If you would like to continue, make another bet with the /bet command.`);
                        gameState = resetGameConditions(gameState);
                        const response = await fetch('http://localhost:5433/bet/' + gameState.playerId + '/' + (2 * gameState.playerBet), {
                            method: 'POST'
                        })
                        console.log(response.status);
                    }
                }
            }
            else if (gameState.isBet == true) {
                await interaction.reply(`Sorry, but you must first deal cards with the /deal command.`);
            }
            else if (gameState.isGame == true) {
                await interaction.reply(`Sorry, but you must make a bet before cards are dealt.`);
            }
            else {
                await interaction.reply(`Sorry, but you must start playing a game first.`);
            }

            return gameState;
        },
};
