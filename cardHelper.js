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

// formatCards returns the unicode card matching the appropriate index of its suit and rank
const formatCards = (card) => {
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

const rankToInteger = (card, highAce) => {
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

const resetGameConditions = (gameState) => {
    gameState.isBet = false;
    gameState.isDeal = false;
    gameState.playerCards = [];
    gameState.dealerCards = [];

    return gameState;
}

module.exports = {
    formatCards,
    rankToInteger,
    resetGameConditions
}