const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: `leaveguild`,
  category: `Owner`,
  aliases: [`leaveg`, `gleave`],
  description: `Leaves A Guild`,
  usage: `leaveguild <guild id>`,
  run: async (client, message, args, guildData, player, prefix) => {
    if (!config.ownerIDS.includes(message.author.id)) {
      const nop = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setAuthor(`| You are not allowed to run this command! Only Developers is allowed to run this command`, message.author.displayAvatarURL({ dynamic: true }))
      return message.reply({embeds: [nop], allowedMentions: { repliedUser: false }})
    }
    try {
      const gleave = args[0];
 
      if (!gleave) {
        return message.reply({content: "Please provide an id"});
      }
         
      const guild = client.guilds.cache.find((g) => g.id === gleave);
         
      if (!guild) {
        return message.channel.send({content: "That guild wasn't found"});
      }
         
      try {
        await guild.leave();
        message.reply({content: `I have left the Guild: **${guild.name}**`});
      } catch (error) {
        console.error(error);
        return message.reply({content: "I Couldent leave the Guild!"});
      } 
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const emesdf = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setAuthor(`An Error Occurred`)
      .setDescription(`\`\`\`${e.message}\`\`\``);
      return message.channel.send({embeds: [emesdf]});
    }
  },
};
