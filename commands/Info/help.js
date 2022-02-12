
const {
    MessageEmbed,MessageButton,MessageActionRow
    
  } = require("discord.js");
  const config = require("../../botconfig/config.json");
  const ee = require("../../botconfig/embed.json");
  const emoji = require("../../botconfig/emojis.json");
  
  module.exports = {
    name: "help",
    category: "Miscellaneous",
    description: "Show's the help menu",
    run: async (client, message, args, guildData, player, prefix) => {
      if (args[0]) {
        const embed = new MessageEmbed()
        .setColor(ee.color);
        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        var cat = false;
        if (!cmd) {
          cat = client.categories.find(cat => cat.toLowerCase().includes(args[0].toLowerCase()))
        }
        if (!cmd && (!cat || cat == null)) {
          embed.setColor(ee.wrongcolor);
          embed.setDescription(`Nothing found for **${args[0].toLowerCase()}**`)
          return message.channel.send({embeds: [embed]});
        } else if (!cmd && cat) {
          var category = cat;

          const catcommands = client.commands.filter(x => x.category === category).map(x => '`' + x.name + '`').join(", ")

          const embed = new MessageEmbed()
          .setColor(ee.color)
          .setDescription(` To get help on a specific command type \`${prefix}help <command>\`!`)
          .setThumbnail(client.user.displayAvatarURL())
          .setTimestamp()
          .addField(` **${category} - (${client.commands.filter((cmd) => cmd.category === category).size})**`, catcommands)
          .setFooter(ee.footertext, client.user.displayAvatarURL());
        
          return message.channel.send({embeds: [embed]})
        }
        if (cmd.name) embed.addField(` **Command name**`, `\`${cmd.name}\``);
        
        if (cmd.description) embed.addField(" **Description**", `\`${cmd.description}\``);
        if (cmd.aliases) try {
          embed.addField(" **Aliases**", cmd.aliases.length > 0 ? cmd.aliases.map(a => "`" + a + "`").join("\n") : "No Aliases")
        } catch {}
        if (cmd.cooldown) embed.addField(" **Cooldown**", `\`${cmd.cooldown} Seconds\``);
        else embed.addField(" **Cooldown**", `\`3 Seconds\``);
        if (cmd.usage) {
          embed.addField(" **Usage**", `\`${prefix}${cmd.usage}\``);
        }
        if (cmd.useage) {
          embed.addField(" **Useage**", `\`${prefix}${cmd.useage}\``);
        }
      embed.setThumbnail(ee.footericon);
        embed.setColor(ee.color)
        return message.channel.send({embeds: [embed]});
      } 
    
     
        
  const row = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setLabel("Invite Me")
      .setStyle("LINK")
      .setEmoji("<:invite:924601909250256937>")
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=807855659173150781&permissions=534789880176&redirect_uri=https%3A%2F%2Fdiscord.gg%2Fj7E5759ffc&response_type=code&scope=bot%20applications.commands%20guilds.join`),
    new MessageButton()
      .setLabel("Support Server")
      .setStyle("LINK")
      .setURL("https://discord.gg/r5y7s8sJss")
      .setEmoji("<:G_question:924602362876788766>"),
    new MessageButton()
     .setLabel("Vote Me")
     .setStyle("LINK")
     .setEmoji("<:Alex_topgg:914364754624147507>")
     .setURL(`https://top.gg/bot/807855659173150781/vote`),
     new MessageButton()
     .setLabel("Website")
     .setStyle("LINK")
     .setEmoji("<:website:941687370091216897>")
     .setURL(`https://www.music-boat.cf`)
     )
  
  
        const mainmenu = new MessageEmbed()
         .setAuthor("Music-Boat Help Panel", ee.footericon)
        .setThumbnail(client.user.avatarURL())
        .setDescription(`Music-Boat is the easiest way to play music in your Discord server. It supports Spotify, YouTube, and more`)
        .addField(`● Config [3]`, `\`autoplay\`, \`prefix\`, \`announce\``)
        .addField(`● Filters [13]`, `\`8d\`, \`bassboost\`, \`nightcore\`, \`daycore\`, \`reset\`, \`speed\`,\`chipmunk\`,\`darthvader\`,\`deepbass\`,\`soft\`,\`pop\`,\`soft\`,\`vibrate\``)
        .addField(`● Music [19]`, `\`clearqueue\`, \`join\`, \`loop\`, \`nowplaying\`, \`pause\`, \`play\`, \`queue\`, \`remove\`, \`replay\`, \`resume\`, \`restart\`, \`resume\`, \`search\`, \`seek\`, \`shuffle\`, \`skip\`, \`skipto\`, \`stop\`, \`volume\``)
        .addField(`● Owner [4]`,`\`reload\`, \`eval\`, \`execute\`,\`restart\``)
        .addField(`● Info [8]`, `\`help\`, \`invite\`, \`node\`, \`ping\`,\`report\`,\`stats\`,\`shards\`, \`uptime\`,\`vote\``)
  
  
  message.channel.send({ embeds: [mainmenu], components: [row] }).catch (e => {
      console.log(String(e.stack).bgRed)
			const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return message.channel.send({embeds: [emesdf]});
    })
      }
    
  };
  
  
