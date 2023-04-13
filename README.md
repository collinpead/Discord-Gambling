# Discord-Gambling

This is a Discord built for user's to play games of chance through commands with a nonmonetary points based, database backed system. It utilizes the discord.js library for JavaScript to interact with the Discord API, Express and Node.js to run the web server and communicate with the database, and a PostgreSQL database to store user records. This approach allows for user information to be stored between interactive sessions.

## Running the bot

To register and update slash commands, first run:

### node deploy-commands.js

Then to start the bot itself run:

### node casino.js