const { ShardingManager } = require('discord.js');
const config = require("./botconfig/config.json");

const manager = new ShardingManager('./index.js', { totalShards: 3,token: config.token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
respawn: true
manager.spawn();
