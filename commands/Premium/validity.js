const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js")
const premSchema = require("../../models/premiumGuild");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const day = require("dayjs");
const prettyMiliSeconds = require('pretty-ms');


module.exports = {
  name: "validity",
  aliases: ["v"],
  description: "Check your premium Time",
  category: "Premium",
  run: async (client, message, args) => {
    try {
      const isPremium = await premSchema.findOne({
        GuildID: message.guild.id,
      });

      if (!isPremium) {
        let noprem = new MessageEmbed()
        .setAuthor(`${message.author.tag} - Validity`, message.author.displayAvatarURL())
.setDescription(`This Guild Has No Premium Subscription [\`Contact Developers\`](${config.links.server}) To Buy Premium`)
.setColor(ee.color) 
 message.channel.send({ embeds: [noprem] })
 
      } else {
        if (isPremium.Expire < Date.now() && !isPremium.Permanent) {
          await isPremium.delete();
          let expired = new MessageEmbed()
          .setAuthor(`${message.author.tag} - Validity`, message.author.displayAvatarURL())
          .setDescription(`Premium Expired On \`${day(isPremium.Expire)}\``)
          .setColor(ee.color) 
          return message.channel.send({
            embeds: [expired]
          })
        }
        
        if (!isPremium.Permanent) {
          let premp = new MessageEmbed()
          .setAuthor(`${message.author.tag} - Validity`, message.author.displayAvatarURL())
          .setDescription(`Premium Will Expire On : \`${prettyMiliSeconds(isPremium.Expire-Date.now())}\``)
          .setColor(ee.color) 
          return message.channel.send({
            embeds: [premp]
          })
        }
        let prem = new MessageEmbed()
          .setAuthor(`${message.author.tag} - Validity`, message.author.displayAvatarURL())
          .setDescription(`Premium Will Expire On : \`Never\``)
          .setColor(ee.color) 
          return message.channel.send({
            embeds: [prem]
          })
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
