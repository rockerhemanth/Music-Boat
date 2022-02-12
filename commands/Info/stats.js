const { MessageEmbed } = require("discord.js");
const Discord  = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const emoji = require(`../../botconfig/emojis.json`);
const bytes = require('bytes');
const { mem, cpu, os } = require('node-os-utils');
const { stripIndent } = require('common-tags');
const prettyMilliseconds = require("pretty-ms")
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
            
            let uptime = `${days} d, ${hours} h, ${minutes} m,${seconds} s`;
  
            let connectedchannelsamount = 0;
            let guilds = client.guilds.cache.map((guild) => guild);
            for (let i = 0; i < guilds.length; i++) {
                if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
            }
            if (connectedchannelsamount > client.guilds.cache.size) connectedchannelsamount = client.guilds.cache.size;
            const shardInfo = await client.shard.broadcastEval(c => ({
                id: c.shard.ids,
                status: c.shard.mode,
                guilds: c.guilds.cache.size,
                channels: c.channels.cache.size,
                members: c.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0),
                memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
                players: c.manager.players.size,
                ping: c.ws.ping,
            }));
          
            const memusage = process.memoryUsage();
            const users = await client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)).then(x => x.reduce((a, b) => a + b, 0))
            const servers = await client.shard.fetchClientValues('guilds.cache.size')
            const duck = await client.shard.fetchClientValues('guilds.cache.size')
            const { usedMemMb } = await mem.info();
           
            
            const clmao = stripIndent`
             Total Servers       :: ${duck.reduce((a, b) => a + b)}
             Total Users         :: ${users} 
             Ping                :: ${client.ws.ping}
             Used Memory         :: ${Math.round(memusage.heapUsed / 1024 / 1024)}/${Math.round(memusage.heapTotal / 1024 / 1024)}mb
             Platform            :: ${await os.oos()}
             CPU                 :: ${cpu.model()}
             server used memory  :: ${bytes(bytes(`${usedMemMb}MB`))}
             Shard ID            :: ${message.guild.shardId}
             Total shards        :: ${client.shard.count}               
              `;
            
              const statsEmbed = new Discord.MessageEmbed()
                  .setColor(ee.color)
                  .setAuthor('STATS')
            .setDescription(`\`\`\`asciidoc\n${clmao}\n\`\`\``)
          
        
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
