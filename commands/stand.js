const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

const cardIcons = [ '🂡','🂱','🃁','🃑',
                    '🂢','🂲','🃂','🃒',
                    '🂣','🂳','🃃','🃓',
                    '🂤','🂴','🃄','🃔',
                    '🂥','🂵','🃅','🃕',
                    '🂦','🂶','🃆','🃖',
                    '🂧','🂷','🃇','🃗',
                    '🂨','🂸','🃈','🃘',
                    '🂩','🂹','🃉','🃙',
                    '🂪','🂺','🃊','🃚',
                    '🂫','🂻','🃋','🃛',
                    '🂭','🂽','🃍','🃝',
                    '🂮','🂾','🃎','🃞' ];

function formatCards(card) {
    cardIndex = 0;
    // Check the rank of the card.
    if (card.rank === 'Ace') {
        ;
    }
    else if (card.rank === 'Jack') {
        cardIndex = 40;
    }
    else if (card.rank === 'Queen') {
        cardIndex = 44;
    }
    else if (card.rank === 'King') {
        cardIndex = 48;
    }
    else {
        cardIndex = (parseInt(card.rank) - 1) * 4; 
    }
    // Check the suit of the card.
    if (card.suit == 'spades') {
        ;
    }
    else if (card.suit == 'hearts') {
        cardIndex += 1;
    }
    else if (card.suit == 'diamonds') {
        cardIndex += 2;
    }
    else if (card.suit == 'clubs') {
        cardIndex += 3;
    }
    else {
        console.log('ERROR: Card has value of unrecognized suit.')
    }
    return cardIcons[cardIndex];
}

function rankToInteger(card, highAce) {
    if (card.rank === 'Ace' && highAce) {
        return 11;
    }
    else if (card.rank === 'Ace') {
        return 1;
    }
    else if (card.rank === 'Jack') {
        return 10;
    }
    else if (card.rank === 'Queen') {
        return 10;
    }
    else if (card.rank === 'King') {
        return 10;
    }
    else {
        return parseInt(card.rank); 
    }
}

function resetGameConditions(gameState) {
    gameState.isBet = false;
    gameState.isDeal = false;
    gameState.playerCards = [];
    gameState.dealerCards = [];

    return gameState;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stand')
        .setDescription(`Player chooses to not add another card to their hand.`),

        async execute(interaction, gameState) {
            if (gameState.isDeal == true) {
                const deck = gameState.deck;
                var deckIndex = gameState.deckIndex;
                const dealerDrawsUntil = 17;

                playerScore = gameState.playerCards.map(card => rankToInteger(card, true)).reduce((sum, current) => sum + current, 0);
                dealerScore = gameState.dealerCards.map(card => rankToInteger(card, true)).reduce((sum, current) => sum + current, 0);
                // Secondary score evaluation where Aces are evaluated as 1 instead of 11, if the player's score is over 21.
                if (playerScore > 21) {
                    playerScore = gameState.playerCards.map(card => rankToInteger(card, false)).reduce((sum, current) => sum + current, 0);
                }

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
                    while (dealerScore < Math.min(playerScore, dealerDrawsUntil)) {
                        await wait(1500);
                        // Deal 1 cards to the dealer.
                        gameState.dealerCards.push(deck.cards[deckIndex++]);
                        gameState.deckIndex = deckIndex;

                        dealerScore = gameState.dealerCards.map(card => rankToInteger(card, true)).reduce((sum, current) => sum + current, 0);

                        if (dealerScore > 21) {
                            dealerScore = gameState.dealerCards.map(card => rankToInteger(card, false)).reduce((sum, current) => sum + current, 0);
                        }

                        await interaction.followUp(`Dealer draws a card ` + gameState.dealerCards.map(card => formatCards(card))
                        + ` (` + dealerScore
                        + `)\n`);
                    }
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
                    else if (dealerScore > playerScore) {
                        await interaction.followUp(`The dealer wins with a score of ${dealerScore}.\n`
                                                    + `If you would like to continue, make another bet with the /bet command.`);
                        gameState = resetGameConditions(gameState);
                    }
                    else if (playerScore > dealerScore) {
                        await interaction.followUp(`${gameState.playerName} wins with a score of ${playerScore}.\n`
                                                    + `If you would like to continue, make another bet with the /bet command.`);
                        gameState = resetGameConditions(gameState);
                        const response = await fetch('http://localhost:5433/bet/' + gameState.playerId + '/' + (2 * gameState.playerBet), {
                            method: 'POST'
                        })
                        console.log(response.status);
                    }
                    else {
                        await interaction.followUp(`Something unexpected happened...`);
                        gameState = resetGameConditions(gameState);
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