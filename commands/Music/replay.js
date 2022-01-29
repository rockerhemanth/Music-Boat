const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const {
  createBar,
  format
} = require(`../../handlers/functions`);
module.exports = {
  name: `restart`,
  category: `Music`,
  aliases: [  ],
  description: `Replay the current song`,
  usage: `replay`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try{
      //seek to 0
      player.seek(0);
      //send informational message
      const opop = new MessageEmbed()
      .setAuthor(`${message.author.tag} - Replay`, message.author.displayAvatarURL( { dynamic: true } ))
      .addField(`${emoji.msg.SUCCESS} | Successfully Restarted the current Song!`)
      .setColor(ee.color)
      return message.channel.send({embeds: [opop]});
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
