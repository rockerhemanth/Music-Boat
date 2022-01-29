const moment = require('moment');
const { mem, cpu, os } = require('node-os-utils');
const { stripIndent } = require('common-tags');
const bytes = require('bytes');
const prettyMilliseconds = require("pretty-ms")
const Discord  = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require(`../../botconfig/emojis.json`);
const {
  getRandomInt
} = require("../../handlers/functions")
module.exports = {
  name: "stats",
  category: "Info",
  aliases: ["musicstats"],
  cooldown: 10,
  usage: "stats",
  description: "Shows music Stats, like amount of Commands and played Songs etc.",
  run: async (client, message, args, guildData, player, prefix) => {
    
    try {
      let totalSeconds = message.client.uptime / 1000;
      let days = Math.floor(totalSeconds / 86400);
      totalSeconds %= 86400;
      let hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = Math.floor(totalSeconds % 60);
      
      let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
  


      let connectedchannelsamount = 0;
      let guilds = client.guilds.cache.map((guild) => guild);
      for (let i = 0; i < guilds.length; i++) {
        if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
      }
      if (connectedchannelsamount > client.guilds.cache.size) connectedchannelsamount = client.guilds.cache.size;

      let users = 0;
      client.guilds.cache.forEach(guild => {
        users += guild.memberCount;
      })
      const { totalMemMb, usedMemMb } = await mem.info();
        
        const memusage = process.memoryUsage();
        
      const clmao = stripIndent`
↳ Version    :: v2.1.0
↳ Birth Date :: ${new Date(client.user.createdAt).toLocaleString('en-US', { timezone: 'America/Los_Angeles' }, true)}
↳ Shard      :: ${parseInt(client.shard.ids) + 1}/${client.shard.count}
↳ Clusters   :: ${parseInt(client.shard.ids) + 1}
↳ Servers    :: ${message.client.guilds.cache.size.toLocaleString()}
↳ Users      :: ${users.toLocaleString()}
↳ Players    :: ${connectedchannelsamount}
    `;
    const slmao = stripIndent`
↳ Node.js    :: v16.6.13
↳ Memory     :: ${Math.round(memusage.heapUsed / 1024 / 1024)}/${Math.round(memusage.heapTotal / 1024 / 1024)}mb
↳ Platform   :: ${await os.oos()}
↳ CPU        :: ${cpu.model()}
  `;

      const statsEmbed = new Discord.MessageEmbed()
      .setColor("#fd6260")
      .setFooter(ee.footertext, ee.footericon)
      .setThumbnail(ee.footericon)
.addField(`GENERAL:`, `\`\`\`asciidoc\n${clmao}\n\`\`\``)
.addField(`STATISTICS:`, `\`\`\`asciidoc\n${slmao}\n\`\`\``)
.setAuthor(`${message.author.tag} - Stats`,  message.author.displayAvatarURL({ dynamic: true }))
      message.channel.send({embeds: [statsEmbed]});

    } catch (e) {
      console.log(String(e.stack).bgRed)
			const emesdf = new MessageEmbed()
			.setColor(ee.wrongcolor)
			.setAuthor(`An Error Occurred`)
			.setDescription(`\`\`\`${e.message}\`\`\``);
			return message.channel.send({embeds: [emesdf]});
    }
  }
}
