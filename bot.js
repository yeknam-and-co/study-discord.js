import { Client, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import fs from 'fs';

let data = {};

try {
    data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
} catch (e) {
    console.log('No data file found, creating new one');
}

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ] 
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'create') {
    const count = interaction.options.getInteger('count');
    const userID = interaction.user.id;

    await interaction.reply(`state topics in order please`);

    const filter = (m) => m.author.id === userID;
    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 60000,
    });

    let collected = [];
    
    collector.on('collect', (m) => {
        console.log('Collected message:', m.content);
        collected.push(m.content);
        m.react('✅');
        
        if (collected.length >= count) {
            collector.stop('count_reached');
        }
    });

    collector.on('end', (reason) => {
        console.log('Collection ended. Reason:', reason);
        console.log('Total messages:', collected.length);
        if (!data[userID]) {
            data[userID] = [];
        }

        for (const topic of collected) {
            data[userID].push({name: topic, done: false});
        }

        saveData();
        if (reason === 'count_reached') {
            interaction.editReply(`Successfully collected ${count} topics!`);
        } else {
            interaction.editReply(`Collected ${collected.length} topics.`);
        }
    });
  }
});


function saveData() {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

client.login(process.env.TOKEN);
