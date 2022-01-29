const {
  MessageEmbed
} = require(`discord.js`);
const DBL = require('@top-gg/sdk');
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);

const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `8d`,
  category: `Filter`,
  aliases: [ ],
  description: `Applies a 8D Filter`,
  usage: `8d`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try {

        
     
           
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
          rotation: {
            "rotationHz": 0.6, 
        },
      });
      const df = new MessageEmbed()
      .setColor(ee.color)
      .setAuthor(`|  8d mode has been enabled.`, message.author.displayAvatarURL( { dynamic: true } ))
      
      .setFooter(`Tip : ${prefix}clearfilters`)
      return message.reply ({embeds: [df], allowedMentions: { repliedUser: false }});
            
  
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
