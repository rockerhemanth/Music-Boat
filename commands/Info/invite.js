const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
  name: "invite",
  category: "Info",
  aliases: ["add", "inv"],
  cooldown: 5,
  usage: "invite",
  description: "Gives you an Invite link for this Bot",
  run: async (client, message, args, guildData, player, prefix) => {
      const emee = new MessageEmbed()
      .setColor(ee.color)
    
        .setThumbnail(client.user.displayAvatarURL())
      .setAuthor(`- Invite & Support Server`,  message.author.displayAvatarURL({ dynamic: true }))
.addField(`__**Admin**__`, `
[Music-Boat](https://discord.com/api/oauth2/authorize?client_id=807855659173150781&permissions=8&redirect_uri=https%3A%2F%2Fdiscord.gg%2Fj7E5759ffc&response_type=code&scope=bot%20applications.commands%20guilds.join)`)

.addField(`__**Without Admin**__`,`[Music-Boat (Recommended)](https://discord.com/api/oauth2/authorize?client_id=807855659173150781&permissions=534789880176&redirect_uri=https%3A%2F%2Fdiscord.gg%2Fj7E5759ffc&response_type=code&scope=bot%20applications.commands%20guilds.join)`)
    .addField(`__**Support Server**__`,`[Music-Boat Support Server](https://discord.gg/r5y7s8sJss)`)
      .setFooter(ee.footertext, ee.footericon)
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
          .setEmoji("<:invite:940159571316604938>") .setLabel("Invite Me!")
         .setStyle("LINK")
          .setURL("https://discord.com/api/oauth2/authorize?client_id=807855659173150781&permissions=534789880176&redirect_uri=https%3A%2F%2Fdiscord.gg%2Fj7E5759ffc&response_type=code&scope=bot%20applications.commands%20guilds.join"),
          new MessageButton()
					.setURL("https://discord.gg/r5y7s8sJss")
          .setLabel("Support Server!")
          .setEmoji("<:G_question:917238164085678131>")
					.setStyle("LINK"),
			);
      message.reply({embeds: [emee],components: [row], allowedMentions: { repliedUser: false }}).catch(e=>{
      const ememe = new MessageEmbed()
      .setColor(ee.wrongcolor)
      .setAuthor(`| Cannot Send Dms, Make Sure your Dms Are Opened `, message.author.displayAvatarURL({ dynamic: true }))
      return message.reply({embeds: [ememe], allowedMentions: { repliedUser: false }})
    })
  }
}
    
      
    
  
  
