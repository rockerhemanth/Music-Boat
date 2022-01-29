var {
  MessageEmbed
} = require("discord.js");
var ee = require("../../botconfig/embed.json")
var config = require("../../botconfig/config.json")
var {
  format
} = require("../functions")
const emoji = require("../../botconfig/emojis.json")

async function playtop(client, message, args, type) {

  const search = args.join(" ");
  let res;
      
  res = await client.manager.search({
    query: search,
    source: type.split(":")[1]
  }, message.author);

  
  if (res.loadType === "LOAD_FAILED") throw res.exception;
  else if (res.loadType === "PLAYLIST_LOADED") {
      return require("../../handlers/playermanagers/playlist")(client, message, args, type);
  } else {
      song_()
  }
  async function song_() {
   
    if (!res.tracks[0]){
      const op = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setDescription(`${emoji.msg.ERROR} Found nothing for: **${search.substr(0, 256 - 3)}**`)
      return message.channel.send({embeds: [op]});
    }

    
    let player;
    player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false
    });
    
    if (player.state !== "CONNECTED") {
     
      player.connect()
     
      player.queue.add(res.tracks[0]);
    
      if(message.member.voice.channel.type === "stage") {
        try { message.guild.me.voice.setSuppressed(false) } catch {/** */}
      }
      player.play();
    } else {
    
      let oldQueue =[]

      for(const track of player.queue)
      oldQueue.push(track);

      
      player.queue.clear();

      player.queue.add(res.tracks[0]);

      
      for (const track of oldQueue)
      player.queue.add(track);
      var playembed = new MessageEmbed()
      .setAuthor(`Added to Queue`, message.author.displayAvatarURL( { dynamic: true } ))  
      .setDescription(`**[${track.title}](${track.uri})**`)
      .setColor(ee.color)
      await message.channel.send({embeds: [playembed]})
    }
  }
}


module.exports = playtop;
