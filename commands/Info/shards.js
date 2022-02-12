
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const bytes = require('bytes');
const { mem } = require('node-os-utils');
const prettyMilliseconds = require("pretty-ms")
const emoji = require("../../botconfig/emojis.json");
const moment = require('moment');
const { memoryUsage } = require("process");
module.exports = {
  name: "shards",
  category: "Miscellaneous",
  description: "Shows the shards info",
  aliases: ["sd", "shrd"],
  run: async (client, message, args, guildData, player, prefix) => {
	
	const { usedMemMb } = await mem.info();
	const memusage = process.memoryUsage();
	const duck = await client.shard.fetchClientValues('guilds.cache.size')
	const users = await client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)).then(x => x.reduce((a, b) => a + b, 0))
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
			const d = moment.duration(client.uptime);
			const days = (d.days() == 1) ? `${d.days()}d` : `${d.days()}d`;
			const hours = (d.hours() == 1) ? `${d.hours()}h` : `${d.hours()}h`;
			const minutes = (d.minutes() == 1) ? `${d.minutes()}m` : `${d.minutes()}m`;
			const seconds = (d.seconds() == 1) ? `${d.seconds()}s` : `${d.seconds()}s`;
			const up = `${days}${hours}${minutes}${seconds}`;
	
			const emee = new MessageEmbed()
				
				.setColor(ee.color);
	
	
				
			shardInfo.forEach(i => {
				console.log(i)
	
				const status = i[0] === 'process' ? "<:alexdnd:921053948020924456>" : "<:alexOnline:917518181436915763>" ;
	
				emee.addField(`${status} Shard ${(parseInt(i.id) + 1).toString()}`, `
\`\`\`cs
Shards   : ${(parseInt(i.id) + 1).toString()}/${client.shard.count}
Servers  : ${i.guilds.toLocaleString()}
Channels : ${i.channels.toLocaleString()}
Users    : ${i.members.toLocaleString()}
Memory   : ${Number(i.memoryUsage).toLocaleString()}mb
Ping     : ${i.ping.toLocaleString()}ms
Streams  : ${i.players.toLocaleString()}
uptime   : ${up}
\`\`\``, true);
	})
	emee.addField(`<:Idle:921053747403194468> Total `, `
\`\`\`cs
Total memory   :${bytes(bytes(`${usedMemMb}MB`))}
Total Servers  : ${duck.reduce((a, b) => a + b)}
Total Members  : ${users}
Total shards   :${client.shard.count}
Ping           : ${client.ws.ping}ms
\`\`\``, true);
	
			
	
	
				
	
	
	message.channel.send({
		embeds: [emee]
	})
},
};
