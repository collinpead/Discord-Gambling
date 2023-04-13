const { Model } = require("sequelize");

function buildSortedDeck(suits, ranks) {
    deck = []
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < ranks.length; j++) {
            deck.push(new Card(suits[i], ranks[j]));
        }
    }
    return deck;
}

function randomCardIndex() {
    deck_length = 52;
    return Math.floor(Math.random() * deck_length);
}

function shuffleDeck(deck) {
    // swaps is the number times two cards have their individual positions swapped.
    const swaps = 100;
    for (let i = 0; i < swaps; i++) {
        pos1 = randomCardIndex();
        pos2 = randomCardIndex();
        temp = deck[pos1];
        deck[pos1] = deck[pos2];
        deck[pos2] = temp;
    }
    return deck;
}

class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }
}
class Deck {
    constructor() {
        this.cards = this.getShuffledDeck();
    }

    getShuffledDeck() {
        const suits = ['diamonds', 'hearts', 'clubs', 'spades'];
        const ranks = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];

        return shuffleDeck(buildSortedDeck(suits, ranks));
    }
}

module.exports = Deck;