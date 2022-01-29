var {
  MessageEmbed
} = require("discord.js"),

config = require("../../botconfig/config.json"),
emoji = require("../../botconfig/emojis.json"),
ee = require("../../botconfig/embed.json"),

{
  format,
  autoplay,
  findOrCreateGuild
} = require("../../handlers/functions"),

hasmap = new Map();
var mi;
module.exports = (client, message) => {
  client.manager
    .on("playerCreate", async (player) => {
      try{
        console.log("\n")
        console.log(`[CLIENT] => [JOINED] JOINED ${client.channels.cache.get(player.voiceChannel).name} IN ${client.channels.cache.get(player.voiceChannel).guild.name}`.yellow)
      } catch{ /* */ }
    })
    .on("playerMove", async (player, oldChannel, newChannel) => {
      if (!newChannel) {
        try {
          player.destroy();
          var embed = new MessageEmbed()
          .setColor(ee.wrongcolor);
          embed.setDescription(`${emoji.msg.ERROR} I left the Channel: \`🔈 ${client.channels.cache.get(player.voiceChannel).name}\``)
          client.channels.cache.get(player.textChannel).send({embeds: [embed]});  
        } catch {/* */}
      } else {
        player.voiceChannel = newChannel;
        if (player.paused) return;
        const checkstage = client.channels.cache.get(newChannel)
        if(newChannel.type === "stage") {
          try {
            setTimeout(async () => {
                await checkstage.guild.me.voice.setSuppressed(false)
            }, 3000);
          } catch {/* */}
        }
        setTimeout(() => player.pause(false), 3000);
      }
  })
  .on("trackStart", async (player, track, message) => {
    try {
      player.set("previoustrack", track);
      //wait 500 ms
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(2);
        }, 500);
      });
      // playANewTrack(client,player,track);
      var embed = new MessageEmbed().setColor(ee.color)
      embed.setColor(ee.color)
      embed.setAuthor(`Now Playing`, "https://cdn.discordapp.com/avatars/884467910494535741/e11fc9965541d9b0d0850e38e7fdb29a.png?size=1024")
         
      embed.setDescription(`[${track.title}](${track.uri}) [<@${track.requester.id}>]`)

      

      const guildData = await findOrCreateGuild(client, { id: player.guild });
      if(guildData.announce) {
        await client.channels.cache.get(player.textChannel).send({embeds: [embed]}).then(msg => {
          if(guildData.pruning) {
            if (player.get(`playingsongmsg`) && msg.id !== player.get(`playingsongmsg`).id) {
              player.get(`playingsongmsg`).delete().catch(e => console.log("couldn't delete message this is a catch to prevent a crash".grey));
            }
            player.set(`playingsongmsg`, msg)
          }
        })
      }
    } catch (e) {
      console.log(String(e.stack).yellow) /* */
    }
  })



  .on("trackStuck", (player, track, payload) => {
    player.stop();
    var embed = new MessageEmbed()
    .setTitle(`Track Stuck`)
    .setDescription(`[${track.title}](${track.uri})`)
    .setColor(ee.wrongcolor)
    try {
      client.channels.cache.get(player.textChannel).send({embeds: [embed]}).then(msg => {
        if(msg && msg.deletable) {
          setTimeout(() => msg.delete().catch(e => console.log("Could not delete, this prevents a bug")), 7500)
        }
      });
    } catch {/** */}
  })
  .on("trackError", (player, track, payload) => {
    player.stop();
    try {
      var embed = new MessageEmbed()
      .setDescription(`${emoji.msg.ERROR} Track got errored!`)
      .setColor(ee.wrongcolor)  
      client.channels.cache.get(player.textChannel).send({embeds: [embed]}).then(msg => {
        if(msg && msg.deletable) {
          setTimeout(() => {
            msg.delete().catch(e => console.log("couldn't delete message this is a catch to prevent a crash".grey));
          }, 5000)
        }
      });
    } catch {/* */}
  })
  .on("queueEnd", async (player) => {
    if (player.get("autoplay")) return autoplay(client, player);
    //DEvar TIME OUT
    const embed = new MessageEmbed()
    .setColor(ee.color)
    .setTitle(`Queue Empty`)
    .setDescription(`Queue more song to keep the party going.`);
    try{
      client.channels.cache.get(player.textChannel).send({embeds: [embed]})
    } catch {/* */}
    return ;
  });
};     
