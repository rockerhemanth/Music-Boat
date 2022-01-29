const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const DBL = require('@top-gg/sdk');
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `speed`,
  category: `Filter`,
  aliases: [ ],
  description: `Allows you to change the speed of current playing track`,
  usage: `speed <Multiplicator> | Multiplicator could be: 0  -  3`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {

    try {

        
     
           
      if (!args.length) {
        const dfi = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setAuthor(`| Please include the Number.`, message.author.displayAvatarURL({ dynamic: true }))
        return message.reply({embeds: [dfi], allowedMentions: { repliedUser: false }})
      }
      if(isNaN(args[0])) {
        const idk = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setAuthor(`| Speed Must be a Number.`, message.author.displayAvatarURL({ dynamic: true }))
        return message.reply({embeds: [idk], allowedMentions: { repliedUser: false }})
      }
      if(Number(args[0]) >= 6 || Number(args[0]) <= 0) {
        const ppp = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setAuthor(`| Your Number out of range Must be between 1 to 5.`, message.author.displayAvatarURL({ dynamic: true }))
        return message.reply({embeds: [ppp], allowedMentions: { repliedUser: false }})
      }
      player.node.send({
        op: "filters",
        guildId: message.guild.id,
        equalizer: player.bands.map((gain, index) => {
            var Obj = {
              "band": 0,
              "gain": 0,
            };
            Obj.band = Number(index);
            Obj.gain = Number(gain)
            return Obj;
          }),
        timescale: {
              "speed": Number(args[0]),
              "pitch": 1.0,
              "rate": 1.0
          },
      });
      const lll = new MessageEmbed()
      .setColor(ee.color)
      .setAuthor(`| Speed Is Set to ${args[0]}%`, message.author.displayAvatarURL( { dynamic: true } ))
      
      .setFooter(`Tip : ${prefix}clearfilters`)
      return message.reply({embeds: [lll], allowedMentions: { repliedUser: false }});
        
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const emesdf = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setAuthor(`An Error Occurred`)
      .setDescription(`\`\`\`${e.message}\`\`\``);
      return message.channel.send({embeds: [emesdf]})
    }
  }
};
