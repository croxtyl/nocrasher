# nocrasher
## What is this and how do I use it?
**nocrasher is an anti crash npm package designed to prevent crashes/stops of your node.js project caused by errors**
>### Installation
`npm install nocrasher`
>### Add this to your main file
```js
const NoCrash = require('nocrasher');
const noCrashing = new NoCrash({
  enableNoCrasher: true, //or set false to disable nocrasher
  enableWebhook: true, //or set false to disable webhooks logs
  webhookURL: 'https://api.example.com/webhook/123456789', //paste your webhook url (discord webhook can also be)
});
```
>### Examples
For discord.js (v14):
```js
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [ 
  GatewayIntentBits.Guilds,
  GatewayIntentBits.MessageContent,] });
  const NoCrash = require('nocrasher');
  const noCrashing = new NoCrash({
    enableNoCrasher: true,
    enableWebhook: true,
    webhookURL: 'https://discord.com/api/webhooks/1234567890/0987654321',
  });
  
client.on("ready", () => {
  console.log(`Bot is ready. Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
    if (message.content === "!ping") {
      message.reply("Pong!")
    } 
    });

client.login("bot_token");
```
It's not just for discord.js. Can It can work in other projects using many other packages e.g. express.js.
