const { MessageEmbed } = require("discord.js");
const redeemCode = require("../../models/redeemCode");
const premiumGuild = require("../../models/premiumGuild");
const ee = require("../../botconfig/embed.json");
const emoji = require(`../../botconfig/emojis.json`);
const prettyMiliSeconds = require("pretty-ms");

module.exports = {
  name: "redeem",
  aliases: ["redeemcode"],
  category: "Premium",
  description: "Redeeem A Premium Code",
   run: async (client, message, args, guildData) => {


       const isPremiumGuild = await premiumGuild.findOne({
        GuildID: message.guild.id
      })

      if (isPremiumGuild) {
         let alr = new MessageEmbed()
        .setAuthor(`${message.author.tag} - Redeem`, message.author.displayAvatarURL())
        .setDescription(`${emoji.msg.ERROR} | Server Is Already Premium`)
        .setColor(ee.color) 
        message.channel.send({embeds: [alr]})
      } else if (!isPremiumGuild) {

      if (!args[0]) {
        return message.channel.send(`No Code Provided!!`)
      }

      const CodeOk = await redeemCode.findOne({ Code: args[0] });

      if (!CodeOk) {
        let exp = new MessageEmbed()
        .setAuthor(`${message.author.tag} - Redeem`, message.author.displayAvatarURL())
            .setDescription(`${emoji.msg.ERROR} | Code Is Invalid Or Expired`)
            .setColor(ee.color) 
            message.channel.send({embeds: [exp]})
            
      }

      const newPrem = new premiumGuild({
        GuildID: message.guild.id,
        Expire: CodeOk.Expiry,
        Permanent: false,
      });

      await newPrem.save();

      if (CodeOk.Usage <= 1) {
        await CodeOk.delete();
      } else {
        await redeemCode.findOneAndUpdate({ Code: args[0] }, { Usage: CodeOk.Usage - 1 });
      }
      let success = new MessageEmbed()
      .setAuthor(`${message.author.tag} - Redeem`, message.author.displayAvatarURL())
.setDescription(
`
${emoji.msg.SUCCESS} | \`Msv Music Premium Activated Successfully\`
\`\`\`asciidoc
Code       :: ${args[0]}
Usage      :: 1
Server     :: ${message.guild.name}
Server Id  :: ${message.guild.id}
Type       :: ${CodeOk.Expiry < Date.now() ? "Permanent" : "Temporary"}
Expiry     :: ${prettyMiliSeconds(CodeOk.Expiry - Date.now())}
\`\`\`
`
)
.setColor(ee.color) 
      message.channel.send({embeds: [success]})
      }
  }
   
}
