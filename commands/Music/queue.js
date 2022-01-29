const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  format,
  swap_pages2
} = require(`../../handlers/functions`);
module.exports = {
  name: `queue`,
  category: `Music`,
  aliases: [`qu`, `que`, `queu`, `list`],
  description: `Shows the Queue`,
  usage: `queue`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try{
      //get the right tracks of the current tracks
      const tracks = player.queue;
      if (!player.queue.current) {
        const no = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} There is nothing playing`)
        return message.channel.send({embeds: [no]})
      }
      //if there are no other tracks, information
      if (!tracks.length) {
        const iii = new MessageEmbed()
        .setColor("#fd6260")
        .setAuthor(`Queue Of ${message.guild.name}`, message.author.displayAvatarURL( { dynamic: true } ))
        .setFooter(ee.footertext, ee.footericon)
        
        .setDescription(`${emoji.msg.ERROR} No tracks in the queue`)

        .addField(`Current Track :`, `\`${player.queue.current.title.substr(0, 60)}...\``)
        return message.channel.send({embeds: [iii]})
      }
      //if not too big send queue in channel
      if (tracks.length < 10) {
        const ttt = new MessageEmbed()
        .setAuthor(`${message.guild.name}'s Queue (${player.queue.length} Songs)`, message.guild.iconURL({
          dynamic: true
        }))
        .setFooter(ee.footertext, ee.footericon)
        .addField(`Current Track :`, `\`${player.queue.current.title.substr(0, 60)}...\``)

        .setColor(ee.color)

        .setDescription(tracks.map((track, i) => `\`${++i}.\` [${track.title.substr(0, 60)}...](${track.uri})  \`${track.isStream ? `LIVE STREAM` : format(track.duration)[0]}  by: ${track.requester.tag}\``).join(`\n\n`))
        return message.channel.send({embeds: [ttt]})
      }
      //get an array of quelist where 15 tracks is one index in the array
      let quelist = [];
      for (let i = 0; i < tracks.length; i += 10) {
        let songs = tracks.slice(i, i + 10);
        quelist.push(songs.map((track, index) => `\`${i + ++index}.\` [${track.title.substr(0, 60)}...](${track.uri}) \`${track.isStream ? `LIVE STREAM` : format(track.duration)[0]} by: ${track.requester.tag}\``).join(`\n\n`))
      }
      let limit = Math.round(quelist.length)
      let embeds = []
      for (let i = 0; i < limit; i++) {
        let desc = String(quelist[i]).substr(0, 2048)
        await embeds.push(new MessageEmbed()
          .setAuthor(`${message.guild.name}'s Queue (${player.queue.length} Songs)`, message.guild.iconURL({
            dynamic: true
          }))
          .setFooter(ee.footertext, ee.footericon)
          .setColor("#fd6260")
          .addField(`\`0.\` **Current Playing**`, `[${player.queue.current.title.substr(0, 60)}...](${player.queue.current.uri}) \`${player.queue.current.isStream ? `LIVE STREAM` : format(player.queue.current.duration)[0]} by: ${player.queue.current.requester.tag}\``)
          .setDescription(desc));
      }
      //return susccess message
      return swap_pages2(client, message, embeds)
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return message.channel.send({embeds: [emesdf]});
    }
  }
};
