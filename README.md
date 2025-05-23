# discord study bot

discord bot to help people keep on task with their things

## features

- create a list of topics to study
- mark topics as complete
- view your progress with a percentage tracker
- delete individual topics
- clear all topics
- beautiful embed messages for better visibility

## commands

### `/create [count]`
creates new topics to study.
- `count`: number of topics you want to create
- after using this command, the bot will ask you to list your topics one by one
- each topic will be marked with a ✅ reaction as you add it

### `/list`
shows all your current topics with their status.
- topics are displayed in a numbered list
- ✅ indicates completed topics
- ❌ indicates incomplete topics
- shows your overall progress percentage

### `/done [index]`
marks a topic as complete.
- `index`: the number of the topic you want to mark as done (use the number shown in the list)
- example: `/done 1` marks the first topic as complete

### `/delete [index]`
removes a specific topic from your list.
- `index`: the number of the topic you want to delete (use the number shown in the list)
- example: `/delete 1` removes the first topic

### `/clear`
removes all your topics and starts fresh.

## setup

1. clone this repository
2. install dependencies:
   ```bash
   npm install
   ```
3. create a `.env` file with your discord bot token:
   ```
   TOKEN=your_discord_bot_token
   CLIENT_ID=your_client_id
   ```
4. register the commands:
   ```bash
   node register-commands.js
   ```
5. start the bot:
   ```bash
   node bot.js
   ```

## data storage

the bot stores all topic data in a `data.json` file. each user's topics are stored separately using their discord user id.

## dependencies

- discord.js
- dotenv

## license

mit license - see [LICENSE](LICENSE) file for details