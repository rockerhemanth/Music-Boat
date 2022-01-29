const config = require("../../botconfig/config.json");
const { findOrCreateGuild } = require("../../handlers/functions"); //Loading all needed functions
const autoplay = require(`../../handlers/playermanagers/autoplay`);
const Discord = require("discord.js")
const { getvc, gettc } = require('../../handlers/autojoin')
module.exports = (client) => {
  client.manager
    .on("nodeConnect", async (node) => {
      const guildids = client.guilds.cache.map((r) => r.id);
        guildids.forEach(async guildID  => {
          const guildData = await findOrCreateGuild(client, { id: guildID})
          if(guildData) {
            const guild = client.guilds.cache.get(guildID)
            const vcid = await getvc(guildID)
            const vc = guild.channels.cache.get(vcid)
            if(!vc) return;
            const vcperm = vc.permissionsFor(client.user).has(Discord.Permissions.FLAGS.CONNECT)
            if(!vcperm) return;
            const tcid = await gettc(guildID)
            const tc = guild.channels.cache.get(tcid)
            if(!tc) return;
            let seconds = [ 500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000 ];
            const player = await client.manager.create({
              guild: guildID,
              voiceChannel: vcid,
              textChannel: tcid,
              selfDeafen: true
            });
            player.connect();
            setTimeout(async () => {   
              if(vc.type === "stage") {
                try { await client.guilds.cache.get(guildID).me.voice.setSuppressed(false) } catch {/* */}
              }
            });
          } else {
            return;
          }
        })
      console.log("\n")
      console.log(`[NODE] => [CONNECTED] SUCCESSFULLY CONNECTED: ${node.options.identifier}!`.bold.green)
    })
    .on("nodeCreate", (node) => {
      console.log("\n")
      console.log(`[NODE] => [CREATED] SUCCESSFULLY CREATED: ${node.options.identifier}!`.bold.green)
    })
    .on("nodeReconnect", (node) => {
      console.log("\n")
      console.log(`[NODE] => [RECONNECTED] SUCCESSFULLY RECONNECTED: ${node.options.identifier}!`.bold.brightYellow)
    })
    .on("nodeDisconnect", (node) => {
      console.log("\n")
      console.log(`[NODE] => [DISCONNECTED] NODE DISCONNECTED: ${node.options.identifier}`.bold.red)
    })
    .on("nodeError", (node, error) => {
      console.log("\n")
      console.log(`[NODE] => [DISCONNECTED] NODE RECONNECTED: ${node.options.identifier}`.bold.brightRed)
    })
};
