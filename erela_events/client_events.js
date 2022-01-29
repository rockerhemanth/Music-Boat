var {
    Manager
  } = require("erela.js"), {
      MessageEmbed
    } = require("discord.js"),

    Discord = require("discord.js"),
    config = require("../../botconfig/config.json"),
    emoji = require("../../botconfig/emojis.json"),
    ee = require("../../botconfig/embed.json");

  module.exports = (client) => {

      client.on("ready", () => {
        client.manager.init(client.user.id);
      });
      
      client.on("raw", (d) => client.manager.updateVoiceState(d));
      
      
      client.on("channelDelete", async channel => {
        try {
          if (channel.type === "voice") {
            if (channel.members.has(client.user.id)) {
              var player = client.manager.players.get(channel.guild.id);
              if (!player) return;
              if (channel.id === player.voiceChannel) {
                //destroy
                player.destroy();
              }
            }
          }
        } catch {}
      })
      
      client.on("guildDelete", async guild => {
        try {
          var player = client.manager.players.get(guild.id);
          if (!player) return;
          if (guild.id == player.guild) {
            player.destroy();
          }
        } catch {/* */ }
      })
      client.on("voiceStateUpdate", async (oldState, newState) => {
        if (oldState.channelID && !newState.channelID) {
          //if bot left
          try {
            if (oldState.member.user.id === client.user.id) {
              var player = client.manager.players.get(oldState.guild.id);
              if (!player) return;
              player.destroy();
            }
          } catch {}
        }
        var player = client.manager.players.get(newState.guild.id);
        if (!player) return;
        if (config.settings.leaveOnEmpty_Channel.enabled && oldState && oldState.channel) {
          player = client.manager.players.get(oldState.guild.id);
          //if not connect return player.destroy()
          if (!oldState.guild.me.voice.channel){
            return player.destroy();
          }
          //wait some time...
        }
      });
  };
