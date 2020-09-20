const Discord = require("discord.js");
const config = require("./config.json");
const request = require('request');

const client = new Discord.Client();

var lasttime = 0;

const ropts = {
    url: 'https://padlet.com/api/0.9/public_posts?padlet_id=' + config.PADLET_ID,
    headers: {
      'App-Id': config.APP_ID
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      //console.log(info.data);
      for (i = 0; i < info.data.length; i++) {
        
        if (Date.parse(info.data[i].updated_at) > lasttime) {
            console.log(info.data[i].body);
            lasttime = Date.parse(info.data[i].updated_at);
            client.channels.cache.get(config.CHANNEL).send(info.data[i].body);
        }
        //console.log(lasttime);
      }
      //client.channels.cache.get(config.CHANNEL).send(JSON.stringify(info.data));
    }
  }

client.on("message", function(message) {
    if (message.author.bot) return;
    console.log(message.content);
});

client.on("ready", function() {
    setInterval(function(){ request(ropts, callback); }, 3000);
});

client.login(config.BOT_TOKEN);

