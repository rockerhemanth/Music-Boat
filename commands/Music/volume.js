const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `volume`,
  category: `Music`,
  aliases: [`vol`],
  description: `Changes the Volume`,
  usage: `volume <0-100>`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try{

        
     
          
      //if the Volume Number is out of Range return error msg
      if (Number(args[0]) <= 0 || Number(args[0]) > 100) {
        const ypy = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setAuthor(`| You may set the volume 1 - 100`, message.author.displayAvatarURL({ dynamic: true }))
        return message.reply({embeds: [ypy],  allowedMentions: { repliedUser: false }})
      }
      //if its not a Number return error msg
      if (isNaN(args[0])) {
        const poopp = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setAuthor(`| Currently Volume is  ${player.volume}%.`, message.author.displayAvatarURL({ dynamic: true }))
        return message.reply({embeds: [poopp], allowedMentions: { repliedUser: false }})
      }
      //change the volume
      player.setVolume(Number(args[0]));
      //send success message
      const yto = new MessageEmbed()
      
      .setAuthor(`| Volume set to: ${player.volume} %`, message.author.displayAvatarURL({ dynamic: true }))
      .setColor(ee.color)
      return message.reply({embeds: [yto], allowedMentions: { repliedUser: false }});
            
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
