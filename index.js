const tmi = require("tmi.js");
const fetch = require("node-fetch");
const fs = require("fs");
const { query } = require("express");
const express = require("express");
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
      var badges = []
      var dateNow = new Date();
      var streamWHashtag = target.replace("#", "")
      var time = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`
      var date = `${dateNow.getDate()}-${dateNow.getMonth() + 1}-${dateNow.getFullYear()}`
      var fileName = `${date}.log`
      var dir = `./${streamWHashtag}/${fileName}`
      var folder = `${streamWHashtag}`

      if (tags.badges){
        if (tags.badges.broadcaster){ badges.push("broadcaster") }
        if (tags.badges.partner){ badges.push("partner") }
        if (tags.mod){ badges.push("mod") }
        if (tags.badges.founder){ badges.push("founder") }
        if (tags["badge-info"]){ badges.push(tags["badge-info"].subscriber+"m_sub") }
        if (tags.badges.bits){ badges.push(tags.badges.bits+"_bits") }
        if (tags.badges["bits-charity"]){ badges.push("bits-charity") }
        if (tags.badges.premium){ badges.push("prime") }
        if (tags.turbo){ badges.push("turbo") }
        if (tags.badges.predictions){ badges.push(tags.badges.predictions) }
        if (tags.badges["sub-gifter"]){ badges.push(tags.badges["sub-gifter"]+"_gifted") }
        if (tags.badges["glhf-pledge"]){ badges.push("glhf-pledge") }
        if (tags.badges.glitchcon2020){ badges.push("glitchCon2020") }
        var msgAppend = `\n[${time}] [${badges}] ${tags.username}: ${msg}`
        }
      if (!badges.length > 0){
        var msgAppend = `\n[${time}] ${tags.username}: ${msg}`
      }
      try{
        if(!fs.existsSync(folder, function(err){
          if (err) console.log(err);
        })){ // Checks if a folder exists for the streamer, if it does not then it creates one
          console.log("Have to create file")
            fs.mkdir(streamWHashtag, function(err) {
              if (err) throw err;
            })
            console.log(`Directory [${dir}] created!`.bgGreen.black);
            fs.writeFileSync(dir, `#First message logged at [${date} ${time}] in ${target}\n#Badges f.e (1m_sub) show the months sub, not sub badge.`, (err) => {
              if (err) throw err;
            }) // Writes the first line
            fs.appendFileSync(dir, msgAppend); // Appends the message to the .log file
        } else {
          if (!fs.existsSync(dir, function(err){
            if (err) throw err;
          })){
            fs.writeFile(dir, `#First message logged at [${date} ${time}] in ${target}\n`, (err) => {
              if (err) throw err;
            }) // Writes the first line
            fs.appendFileSync(dir, msgAppend, (err) => {
              if (err) throw err;
            }); // If file exists it appends the message that was sent
          } else {
            fs.appendFileSync(dir, msgAppend, (err) => {
              if (err) throw err;
            }); // If file exists it appends the message that was sent
          }
        }
      } catch(err){
        console.log("In catch statement")
        try{
          if(!fs.existsSync(folder, function(err){
            if (err) console.log(err);
          })){ // Checks if a folder exists for the streamer, if it does not then it creates one
            console.log("Have to create file")
              fs.mkdir(streamWHashtag, function(err) {
                if (err) throw err;
              })
              console.log(`Directory [${dir}] created!`.bgGreen.black);
              fs.writeFileSync(dir, `#First message logged at [${date} ${time}] in ${target}\n`, (err) => {
                if (err) throw err;
              }) // Writes the first line
              fs.appendFileSync(dir, msgAppend); // Appends the message to the .log file
          } else {
            if (!fs.existsSync(dir, function(err){
              if (err) throw err;
            })){
              fs.writeFile(dir, `#First message logged at [${date} ${time}] in ${target}\n`, (err) => {
                if (err) throw err;
              }) // Writes the first line
              fs.appendFileSync(dir, msgAppend, (err) => {
                if (err) throw err;
              }); // If file exists it appends the message that was sent
            } else {
              fs.appendFileSync(dir, msgAppend, (err) => {
                if (err) throw err;
              }); // If file exists it appends the message that was sent
            }
          }
        } finally { }
      }
  if (msg.includes("#log")){
    var msgSlice = msg.slice(5)
    if(checkName(tags.username)){ // Checks if the user is authorized to add a channel
      if (!msgSlice.includes("#")){
        opts.channels.push(`#${msgSlice}`); // Adds the channel specified to the JSON
        fs.writeFileSync("opts.json", JSON.stringify(opts))
        client.join(`#${msgSlice}`); // Joins the channel
      } else {
        opts.channels.push(`${msgSlice}`); // Adds the channel specified to the JSON
        fs.writeFileSync("opts.json", JSON.stringify(opts))
        client.join(`${msgSlice}`); // Joins the channel
      }
    }
}
};
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}