const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `daycore`,
  category: `Filter`,
  aliases: [ ],
  description: `Applies a Tremolo Filter`,
  usage: `tremolo`,
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
        timescale: {
              "speed": 0.975,
              "pitch": 0.5,
              "rate": 0.8
          },
      });
      const ooe = new MessageEmbed()
      .setAuthor(`| Daycore mode is Enabled`,message.author.displayAvatarURL({ dynamic: true }))
        .setFooter(`Tip : ${prefix}clearfilters`)
       .setColor(ee.color) 
      return message.reply({embeds: [ooe], allowedMentions: { repliedUser: false }});
            
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
