const Discord = require("discord.js");
const fs = require("fs")
module.exports = (client) => {
  try {
   
    client.commands = new Discord.Collection(); 
    client.aliases = new Discord.Collection(); 
    client.categories = fs.readdirSync("./commands/"); 
    client.cooldowns = new Discord.Collection(); 
    client.slashCommands = new Discord.Collection(); 
  } catch (e) {
    console.log(String(e.stack).bgRed)
  }
};
