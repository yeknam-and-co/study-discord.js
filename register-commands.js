import { REST, Routes } from 'discord.js';
import 'dotenv/config';

const commands = [
  {
    name: 'create',
    description: 'Create a new topic',
    options: [
      {
        name: 'count',
        description: 'The number of topics to create',
        type: 4
      },
    ],
  },
  {
    name: 'list',
    description: 'List all topics',
  },
  {
    name: 'done',
    description: 'mark an index of a topic as done',
    options: [
      {
        name: 'index',
        description: 'The index of the topic to mark as done',
        type: 4
      }
    ],
  },
  {
    name: 'delete',
    description: 'delete an index of a topic',
    options: [
      {
        name: 'index',
        description: 'The index of the topic to delete',
        type: 4
      }
    ],
  },
  {
    name: 'clear',
    description: 'clear all topics',
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Refreshing application (/) commands...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('Successfully reloaded commands.');
  } catch (error) {
    console.error(error);
  }
})();
