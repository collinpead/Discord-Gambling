# Discord-Gambling

This is a Discord bot built for users to play games of chance through commands with a nonmonetary points based, database backed system. It utilizes the discord.js library for JavaScript to interact with the Discord API, Express and Node.js to run the web server and communicate with the database, and a PostgreSQL database to store user records. This approach allows for user information to be stored between interactive sessions.

## Running the Bot

To register and update slash commands, first run:

### node deploy-commands.js

Then to start the bot itself run:

### node casino.js

## Blackjack Interaction Cycle

Prior to any other commands the user must register with the /register command. Then they can start an instance a game with the /play command. The user must then create a valid bet, no greater than their total points, with the /bet command. After a bet is made, cards may be dealt with the /deal command. Then the user may choose to hit or stand, using the /hit and /stand commands. After a win, loss, or draw the state of the game is reset to the betting phase, where the user can make another bet with /bet or quit with /quit.

## Slash Commands

### /register

Registers a new user storing their name and user id, if they do not already exist in the database.

### /points

Notifies the user about the total number of points they have in their account.

### /play

Initiates a session of the game specified by the required user argument and proceeds to the betting phase.
Currently set to exclusively play Blackjack.

### /bet 

Creates a bet of some nonnegative, integer quantity no greater than a user's total number of points.
A valid bet deducts the total from the user's points in the database and the game proceeds to the dealing phase.

### /deal

Deals two cards to both the user and the dealer from the top of the deck.
One of the dealer's cards will be face down so that the user cannot see it.

### /hit

Adds a card to the user's hand from the top of the deck.
If the user busts, their bet is lost and the game resets to the betting phase.

### /stand

Dealer reveals their face down card and adds cards to their hand until they beat the user's hand or hit 17.
Points are awarded to the user if they win or their bet is refunded if they draw with the dealer.
Afterwards the game resets to the betting phase.

### /quit

Resets all information about the game's current state to default values.
