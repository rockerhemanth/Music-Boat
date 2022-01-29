const {MessageEmbed} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require(`../../botconfig/emojis.json`);
  module.exports = {
    name: "bugreport",
    category: "Info",
    aliases: ["report", "bug report", "bug"],
    cooldown: 2,
    usage: "bugreport",
    description: "report your faced Bug",
    run: async (client, message, args, guildData, player, prefix) => {



    const channel = client.channels.cache.get(config.botupdatechannelid);
    const query = args.join(" ");
    if(!query[0]) return message.reply({embeds: [new MessageEmbed()
        .setAuthor(`| Please provide a message to send`, message.author.displayAvatarURL({ dynamic: true }))
        .setColor(ee.color)
    ], allowedMentions: { repliedUser: false }});
    const embed = new MessageEmbed()
    .setTitle("- Bug Reported")
    .setColor(ee.color)
    .setThumbnail(message.author.displayAvatarURL())
    .addFields(
      {name: 'Author', value: `${message.author.tag}`},
      {name: 'User Id', value: `${message.author.id}`},
      {name: 'Server', value: `${message.guild.name}`},
      {name: 'Bug Message', value: `${query}`}
      )
      message.reply({embeds: [new MessageEmbed()
        .setAuthor(`| Bug Reported Successfully`, message.author.displayAvatarURL({ dynamic: true }))
        .setColor(ee.color)
    ]});
      channel.send({embeds: [embed], allowedMentions: { repliedUser: false }});
      
    
     
    }
    }
    
