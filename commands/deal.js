const { SlashCommandBuilder } = require('discord.js');
const Deck = require('../deckMake.js');
const { formatCards, rankToInteger } = require('../cardHelper.js');
const cardBackIcon = [ '🂠' ];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deal')
        .setDescription('Deals cards.'),

        async execute(interaction, gameState) {

            if (gameState.isDeal == true) {
                await interaction.reply(`Cards have already been dealt.`)
            }
            // Deals two cards to both the player and dealer from the top of the deck
            else if (gameState.isBet == true) {
                const deck = new Deck();
                let deckIndex = 0;
                
                gameState.playerCards.push(deck.cards[deckIndex++]);
                gameState.playerCards.push(deck.cards[deckIndex++]);
                gameState.dealerCards.push(deck.cards[deckIndex++]);
                gameState.dealerCards.push(deck.cards[deckIndex++]);
                gameState.isDeal = true;
                gameState.deckIndex = deckIndex;
                gameState.deck = deck;

                await interaction.reply(`Dealing cards.\n Your cards: ` + gameState.playerCards.map(card => formatCards(card))
                 + ` (` + gameState.playerCards.map(card => rankToInteger(card, true)).reduce((sum, current) => sum + current, 0)
                 + `)\n Dealer's cards: ` + formatCards(gameState.dealerCards[0]) 
                 + `,${cardBackIcon} (` + rankToInteger(gameState.dealerCards[0], true)
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
