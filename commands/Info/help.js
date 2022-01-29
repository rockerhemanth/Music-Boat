
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require("../../botconfig/emojis.json");
module.exports = {
  name: "help",
  category: "Info",
  description: "Lund Lelo",
  run: async (client, message, args, guildData, player, prefix) => {
    try {

      


      const mainmenu = new MessageEmbed()
        .setAuthor("Msv Music • Help Panel", ee.footericon)
        .setThumbnail(client.user.avatarURL())
        .setDescription(`A Msv Music Music Bot Which Aims To Provide High Quality Music To People Without Any Obstacles`)
        .addField(`● Config [3]`, `\`24/7\`, \`prefix\`, \`announce\``)
        .addField(`● Filters [6]`, `\`8d\`, \`bassboost\`, \`nightcore\`, \`daycore\`, \`reset\`, \`speed\``)
        .addField(`● Music [19]`, `\`autoplay\`, \`clearqueue\`, \`join\`, \`loop\`, \`nowplaying\`, \`pause\`, \`play\`, \`queue\`, \`remove\`, \`replay\`, \`resume\`, \`restart\`, \`resume\`, \`search\`, \`seek\`, \`shuffle\`, \`soundcloud\`, \`skip\`, \`skipto\`, \`stop\`, \`volume\``)
        .addField(`● Owner [4]`, `\`addcode\`, \`reload\`, \`eval\`, \`execute\``)
        .addField(`● Premium [3]`, `\`premium\`, \`redeem\`, \`validity\``)
        .addField(`● Info [6]`, `\`help\`, \`invite\`, \`node\`, \`ping\`, \`stats\`, \`uptime\``)
        .addField(`● Links [2]`, `[Invite Me](${config.links.msvmusicinv}) | [Support Server](${config.links.server})`)
        .setColor("#fd6260")



      message.channel.send({ embeds: [mainmenu] })
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const emesdf = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setAuthor(`An Error Occurred`)
        .setDescription(`\`\`\`${e.message}\`\`\``);
      return message.channel.send({ embeds: [emesdf] });
    }
  }
};

