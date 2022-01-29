const {
    MessageEmbed
  } = require("discord.js");
  const config = require("../../botconfig/config.json");
  const ee = require("../../botconfig/embed.json");
  const emoji = require("../../botconfig/emojis.json");
  module.exports = {
    name: "announce",
    aliases: ["toggleannounce", "announce"],
    category: "Settings",
    description: "Toggles pruning. If its true a message of playing a new track will be sent, even if your afk. If false it wont send any message if a new Track plays! | Default: true aka send new Track information",
    usage: "togglepruning",
    memberpermissions: ["ADMINISTRATOR"],
    run: async (client, message, args, guildData, player, prefix) => {
      try {
        //set the new prefix
        guildData.announce = !guildData.announce
        guildData.save()
        //return success embed
        const tt = new MessageEmbed()
        .setColor(ee.color)
        .setAuthor(`| Announcing of tracks is Now ${guildData.announce ? `Enabled` : `Disabled`}`, message.author.displayAvatarURL({ dynamic: true }))
        return message.reply({embeds: [tt], allowedMentions: { repliedUser: false }});
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
