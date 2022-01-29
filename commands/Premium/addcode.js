const { MessageEmbed } = require("discord.js");
const redeemCode = require("../../models/redeemCode");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
const prettyMiliSeconds = require("pretty-ms");
const ms = require("ms");

module.exports = {
  name: "addcode",
  aliases: ["generatecode", "createcode", "gc"],
  description: "owner only",
  category: "Premium",
  run: async (client, message, args, guildData) => {
    try {
        if (!config.ownerIDS.includes(message.author.id)) return;

      if (!args[0]) {
        let xd = new MessageEmbed()
.setColor(`#303037`)
.setDescription(`${emoji.msg.ERROR} | Please Provide A Time For Expiry`)
message.reply({ embeds: [ xd ] })
      }

      const Expiry = ms(args[2]) + Date.now();
      let Usage = 1;
      if (args[1] && !isNaN(args[1])) {
        Usage = args[1];
      }

      const Code = args[0];

      let success = new MessageEmbed()
.setTitle(`✨ Code Added To Database`)
.setDescription(
`
\`\`\`
Code      :: ${Code}
Validity  :: ${prettyMiliSeconds(Expiry-Date.now())}
Usage     :: ${guildData.prefix}redeem ${Code}
\`\`\`
`)
.setColor(`#303037`)
message.channel.send({embeds: [success]})

      const premObj = {
        Usage: Usage,
        Code: Code,
        Expiry: Expiry,
      };

      const saveCode = new redeemCode(premObj);
      await saveCode.save();

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
