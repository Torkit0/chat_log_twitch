const tmi = require("tmi.js");
require("dotenv").config();
var fetch = require("node-fetch");
var fs = require("fs");
var { query } = require("express");
var express = require("express");
var { username } = require("tmi.js/lib/utils");
var colors = require("colors");
var opts = require('./opts.json')

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

client.connect(); // Connect to Twitch:

console.log(opts.channels[0]);

// Called every time a message comes in
function onMessageHandler (target, tags, msg, self) {
  if (self) { return; } // Ignore messages from the bot

 //console.log(tags.['_id']);   
  fetch(`https://api.twitch.tv/kraken/users?login=${tags.username}`, {
    headers: {
      "Accept": "application/vnd.twitchtv.v5+json",
      "Client-ID": "cclk5hafv1i7lksfauerry4w7ythu2"
    }
  })
  .then((response) => response.json())
  .then((resultT) => {
      var dateNow = new Date();
      const time = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`
      const date = `${dateNow.getDate()}-${dateNow.getMonth()}-${dateNow.getFullYear()}`
      const fileName = `${target}-${date}.log`
      const dir = `./${target}/${fileName}`
      try{
        if(!fs.existsSync(dir)){
            fs.mkdir(target, (err) => {
              if (err) throw err;
            })
            console.log(`Directory [${dir}] created!`.bgGreen.black);
            fs.writeFileSync(dir, `${target}\n#Started logging at [${date} ${time}]\n`)
            fs.appendFileSync(dir, `\n[${time}] ${tags.username}: ${msg}`);
        } else {
          fs.appendFileSync(dir, `\n[${time}] ${tags.username}: ${msg}`);
        }
      } catch(err){
          if (err) console.log(err)
      }
})
};
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}