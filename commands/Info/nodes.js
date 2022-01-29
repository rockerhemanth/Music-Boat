
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require("../../botconfig/emojis.json");
module.exports = {
  name: "node",
  category: "Info",
  description: "Lund Lelo",
  run: async (client, message, args, guildData, player, prefix) => {

    const all = client.manager.nodes.map(node => 
      `
Node Id   ::  ${(node.options.identifier)}
State     ::  Connected
Players   ::  ${node.stats.playingPlayers}/${node.stats.players}
Utipme    ::  ${new Date(node.stats.uptime).toISOString().slice(11, 19)}
Memory    ::  ${Math.round(node.stats.memory.free / 1024 / 1024)}/${Math.round(node.stats.memory.used / 1024 / 1024)}mb
Cores     ::  ${node.stats.cpu.cores}
`
        ).join('\n\n- - - - - - - - - - - - - -\n');

        const embed = new MessageEmbed()
            .setColor(ee.color)
            .setAuthor(`${message.author.tag} - Nodes`,  message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`\`\`\`asciidoc\n${all}\n\`\`\``)
           
        message.channel.send({embeds: [embed]})

  }
}
   
