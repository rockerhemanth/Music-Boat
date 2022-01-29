const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require("../../botconfig/emojis.json");


module.exports = {
  name: "lyrics",
  category: "Music",
  description: "Lund Lelo",
  run: async (client, message, args, guildData, player, prefix) => {

const Genius = require("genius-lyrics");
const Client = new Genius.Client(config.geniuskey);



const searches = await Client.songs.search(args.join(' ') ? args.join(' ') : player.queue.current.title)


const lyrics = await firstSong.lyrics();

let ishh = new MessageEmbed()
.setTitle(`Lyrics Of ${args.join(' ') ? args.join(' ') : player.queue.current.title}`)
.setDescription(lyrics.slice(0, 2044) + '...')
.setFooter("Powered By Genius.com")
return message.channel.send({embeds: [ishh]});
    
  }
}
