const { SlashCommandBuilder } = require('discord.js');
const Deck = require('../deckMake.js');

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

const arr = [(1, 'cat'), (2, 'dog')]

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

// This rankToInteger functions works for the deal command, but must changed in other commands to accommodate Ace = 1.
function rankToInteger(card) {
    if (card.rank === 'Ace') {
        return 11;
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
        .setName('deal')
        .setDescription('Deals cards.'),

        async execute(interaction, gameState) {

            if (gameState.isDeal == true) {
                await interaction.reply(`Cards have already been dealt.`)
            }
            // may need to track the deck and deck index as gamestate as well
            else if (gameState.isBet == true) {
                const deck = new Deck();
                var deckIndex = 0;
                // Deal 2 cards to the player.
                gameState.playerCards.push(deck.cards[deckIndex++]);
                gameState.playerCards.push(deck.cards[deckIndex++]);
                // Deal 2 cards to the dealer.
                gameState.dealerCards.push(deck.cards[deckIndex++]);
                gameState.dealerCards.push(deck.cards[deckIndex++]);
                gameState.isDeal = true;
                gameState.deckIndex = deckIndex;
                gameState.deck = deck;

                await interaction.reply(`Dealing cards.\n Your cards: ` + gameState.playerCards.map(card => formatCards(card))
                 + ` (` + gameState.playerCards.map(card => rankToInteger(card)).reduce((sum, current) => sum + current, 0)
                 + `)\n Dealer's cards: ` + formatCards(gameState.dealerCards[0]) 
                 + `,${cardBackIcon} (` + rankToInteger(gameState.dealerCards[0])
                 + ` + ?)`);
            }
            else if (gameState.isGame == true){
                await interaction.reply(`Sorry, but you must make a bet before cards are dealt.`);
            }
            else {
                await interaction.reply(`Sorry, but you must start playing a game first.`);
            }

            return gameState;
        },
};