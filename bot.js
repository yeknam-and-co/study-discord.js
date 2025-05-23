import { Client, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import fs from 'fs';
import { EmbedBuilder } from 'discord.js';

let data = {};

try {
    data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
} catch (e) {
    console.log('no data file found, creating a new one');
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

    // create a garbage collector to collect the topics
    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 60000,
    });

    let collected = [];
    

    // everytime we see a message then push the content and react to show user interaction
    collector.on('collect', (m) => {
        collected.push(m.content);
        m.react('✅');
        
        if (collected.length >= count) {
            collector.stop('count_reached');
        }
    });

    collector.on('end', (reason) => {
        if (!data[userID]) {
            data[userID] = [];
        }

        for (const topic of collected) {
            data[userID].push({name: topic, done: false});
        }// push all the topics to the data

        saveData();
        if (reason === 'count_reached') {
            interaction.editReply(`we got all ${count} topics!`);
        } else { // good job we collected all the topics
            interaction.editReply(`we got all ${collected.length} topics!`);
        }
    });
  }
  if (interaction.commandName === 'list') {
    const userID = interaction.user.id;
    const topics = getTopics(userID);
    let percentage = 0;
    if (topics.length === 0) {
      interaction.reply('no topics found, use /create to add some topics');
    } else {
        percentage = topics.filter(topic => topic.done).length / topics.length * 100;
        const embed = new EmbedBuilder()
        .setTitle('Topics')
        .setDescription(topics.map((topic, index) => `${index + 1}. ${topic.name} ${checkMark(topic)}`).join('\n'))
        .setColor(0x0099ff); // just map them out into a string and join them with a new line :)

        embed.setFooter({ text: `progress: ${percentage}%` });

      interaction.reply({ embeds: [embed] });
    }
  }

  if (interaction.commandName === 'done') {
    const userID = interaction.user.id;
    const topics = getTopics(userID);
    const index = interaction.options.getInteger('index');
    
    console.log('User ID:', userID);
    console.log('Topics:', topics);
    console.log('Index:', index);
    
    if (!topics) {
      return interaction.reply('you have no topics yet! use /create to add some topics.');
    }
    
    if (!Array.isArray(topics)) {
      console.error('Topics is not an array:', topics);
      return interaction.reply('there was an error with your topics data. please try creating new topics.');
    } 
    
    if (index < 0 || index >= topics.length) {
      return interaction.reply(`invalid index! please use a number between 1 and ${topics.length}`);
    }


    if (!topics[index]) {
      console.error('Topic at index is undefined:', { index, topics });
      return interaction.reply('there was an error finding that topic. please try again.');
    }

    // just handle all edge cases because FUCK users   

    topics[index-1].done = true;
    saveData();
    
    const embed = new EmbedBuilder()
      .setTitle('Topic Updated')
      .setDescription(`Marked "${topics[index-1].name}" as complete! ✅`)
      .setColor(0x00ff00);
      // this is actually the important bit we just find the index and to the done value mark it as done
    interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === 'delete') {
    const userID = interaction.user.id;
    const topics = getTopics(userID);
    const index = interaction.options.getInteger('index');

    if (!topics) {
      return interaction.reply('you have no topics yet! use /create to add some topics.');
    }

    if (!Array.isArray(topics)) {
      console.error('Topics is not an array:', topics);
      return interaction.reply('there was an error with your topics data. please try creating new topics.');
    }

    if (index < 0 || index >= topics.length) {
      return interaction.reply(`invalid index! please use a number between 1 and ${topics.length}`);
    }

    topics.splice(index-1, 1);
    saveData();

    interaction.reply(`Deleted topic ${index}`); // delete the topic at the index
  }

  if (interaction.commandName === 'clear') {
    const userID = interaction.user.id;
    const topics = getTopics(userID);
    if (!topics) {
        return interaction.reply('you have no topics yet! use /create to add some topics.');
    }

    topics.splice(0, topics.length);
    saveData();

    interaction.reply('cleared all topics');
  } // clear all of the topics

});
 // helper functions
function checkMark(topic) {
    if (topic.done) {
        return '✅';
    } else {
        return '❌';
    }
}

function getTopics(userID) {
    return data[userID];
}

function saveData() {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

client.login(process.env.TOKEN);
