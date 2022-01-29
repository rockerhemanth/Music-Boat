const {
  MessageEmbed
} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `shuffle`,
  category: `Music`,
  aliases: [`mix`],
  description: `Shuffles the Queue`,
  usage: `shuffle`,
  parameters: {"type":"music", "activeplayer": true, "previoussong": false},
  run: async (client, message, args, guildData, player, prefix) => {
    try{
      //set into the player instance an old Queue, before the shuffle...
      player.set(`beforeshuffle`, player.queue.map(track => track));
      //shuffle the Queue
      player.queue.shuffle();
      //return success message
      const opop = new MessageEmbed()
      .setAuthor(`${message.author.tag} - Shuffle`, message.author.displayAvatarURL( { dynamic: true } ))
      .setDescription(`${emoji.msg.SUCCESS} | Successfully Shuffled the Queue`)
      .setColor("#fd6260")
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
