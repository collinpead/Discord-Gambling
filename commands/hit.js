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
const cardBackIcon = [ '🂠' ];

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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hit')
        .setDescription(`Adds another card to the player's hand.`),

        async execute(interaction, gameState) {
            // may need to track the deck and deck index as gamestate as well
            if (gameState.isDeal == true) {
                const deck = gameState.deck;
                var deckIndex = gameState.deckIndex;
                // Deal 1 cards to the player.
                gameState.playerCards.push(deck.cards[deckIndex++]);
                gameState.deckIndex = deckIndex;

                playerScore = gameState.playerCards.map(card => rankToInteger(card, true)).reduce((sum, current) => sum + current, 0);
                // Secondary score evaluation where Aces are evaluated as 1 instead of 11, if the player's score is over 21.
                if (playerScore > 21) {
                    playerScore = gameState.playerCards.map(card => rankToInteger(card, false)).reduce((sum, current) => sum + current, 0);
                }

                await interaction.reply(`Your cards: ` + gameState.playerCards.map(card => formatCards(card))
                 + ` (` + playerScore
                 + `)\n Dealer's cards: ` + formatCards(gameState.dealerCards[0]) 
                 + `${cardBackIcon} (` + rankToInteger(gameState.dealerCards[0])
                 + `)`);

                 if (playerScore > 21) {
                    wait(2500);
                    await interaction.followUp(`You have busted.\n`
                                                + `If you would like to continue, make another bet with the /bet command.`);
                    gameState.isBet = false;
                    gameState.isDeal = false;
                    gameState.playerBet = 0;
                    gameState.playerCards = [];
                    gameState.dealerCards = [];
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