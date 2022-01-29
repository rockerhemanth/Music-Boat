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
  name: `pause`,
  category: `Music`,
  aliases: [`break`],
  description: `Pauses the Current Song`,
  usage: `pause`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try{
      //if the player is paused return error
      if (!player.playing) {
        const fff = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`${emoji.msg.ERROR} The song is already paused!\n\nYou can resume it with: \`${prefix}resume\``)
        return message.channel.send({embeds: [fff]})
      }
      //pause the player
      player.pause(true);
      //return success message
      const idkd = new MessageEmbed()
      .setAuthor(`${message.author.tag} - Pause`, message.author.displayAvatarURL( { dynamic: true } ))
      .setTitle(`${player.playing ? `${emoji.msg.SUCCESS} | Resumed` : `${emoji.msg.SUCCESS} | Paused`} the Player Successfully.`)
      .setColor("#fd6260")
      return message.channel.send({embeds: [idkd]});
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
