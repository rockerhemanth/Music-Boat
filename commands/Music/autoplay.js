const Discord = require(`discord.js`);
const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const playermanager = require(`../../handlers/playermanager`);
module.exports = {
  name: `autoplay`,
  category: `Music`,
  aliases: [`ap`, `toggleauto`, `toggleautoplay`, `toggleap`],
  description: `Toggles Autoplay on/off`,
  usage: `autoplay`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try {
      player.set(`autoplay`, !player.get(`autoplay`))
      //Send Success Message
      const embed = new MessageEmbed()
      .setAuthor(`${message.author.tag} - Autoplay`, message.author.displayAvatarURL( { dynamic: true } ))
      .setDescription(`${emoji.msg.SUCCESS} | Successfully ${player.get(`autoplay`) ? `\`Enabled\`` : `\`Disabled\``} Autoplay`)
      .setColor("#fd6260")
      return message.channel.send({embeds: [embed]});
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
