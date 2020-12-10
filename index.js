const tmi = require("tmi.js");
const fetch = require("node-fetch");
const fs = require("fs");
const { query } = require("express");
const express = require("express");
const { username, channel } = require("tmi.js/lib/utils");
const colors = require("colors");
const opts = require('./opts.json'); // Requires the JSON file in which the channels are saved, when being restarted or such.
const { Console } = require("console");

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

client.connect(); // Connect to Twitch:

function checkName(nameTV){ // Checks if the username that posted the message is tor_kit, you can change it by changing "tor_kit" to your username
  return nameTV === "tor_kit"; // Only that user can add channels to the list of logged chats
};

// Called every time a message comes in
function onMessageHandler (target, tags, msg, self) {
  if (self) { return; } // Ignores messages from the bot
      var dateNow = new Date();
      const time = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`
      const date = `${dateNow.getDate()}-${dateNow.getMonth() + 1}-${dateNow.getFullYear()}`
      const fileName = `${date}.log`
      const dir = `./${target}/${fileName}`
      try{
        if(!fs.existsSync(dir)){ // Checks if a folder and file exists for the streamer, if it does not then it creates one
            fs.mkdir(target, (err) => {
              if (err) throw err;
            })
            console.log(`Directory [${dir}] created!`.bgGreen.black);
            fs.writeFileSync(dir, `${target}\n#Started logging at [${date} ${time}]\n`) // Writes the first line
            fs.appendFileSync(dir, `\n[${time}] ${tags.username}: ${msg}`); // Appends the message as to the .log file
        } else {
          fs.appendFileSync(dir, `\n[${time}] ${tags.username}: ${msg}`); // If file exists it appends the message that was sent
        }
      } catch(err){
          if (err) console.log(err)
      }
  if (msg.includes("#log")){
    if(checkName(tags.username)){ // Checks if the user is authorized to add a channel
        opts.channels.push(`#${msg.slice(5)}`); // Adds the channel specified to the JSON
        fs.writeFileSync("opts.json", JSON.stringify(opts))
        client.join(`#${msg.slice(5)}`); // Joins the channel
      }
}
};
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}