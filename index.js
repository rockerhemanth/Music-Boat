const Discord = require("discord.js"); 
const { Intents, WebhookClient , Collection} = require("discord.js");
const app = require("express")
const colors = require("colors"); 
const fs = require("fs"); 
require('discord-reply'); 
const config = require("./botconfig/config.json");
const fetch = require("node-fetch");
const mongoose = require("mongoose")
const { findOrCreateGuild } = require("./handlers/functions")
const web = new WebhookClient({ url: config.webhookurl });
const { readdirSync } = require("fs")

const intents = new Intents([ "GUILD_MEMBERS" ]);

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
  allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
  presence: {
    status: "dnd",
    activities: [{
      name: "@Music-Boat",
      type: "LISTENING"
    }]
  },
  ws: { intents },
  fetchAllMembers: false,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  disableEveryone: true,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});


require('events').EventEmitter.defaultMaxListeners = 100;
process.setMaxListeners(100);

["clientvariables", "command", "events", "erelahandler"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});


client.databaseCache = {};

client.guildsData = require("./models/Guild");
client.databaseCache.guilds = new Discord.Collection();

mongoose.connect(config.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(() => {
 
 client.login(config.token)


  client.on("voiceStateUpdate", async (oldState, newState) => {
    if (newState.channelId && newState.channel.type == "GUILD_STAGE_VOICE" && newState.guild.me.voice.suppress) {
      try {
        await newState.guild.me.voice.setSuppressed(false);
      } catch (e) {
        console.log(e)
      }
    }
  })
  client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const { createBar, format, swap_pages2, autoplay } = require(`./handlers/functions`);

    const { channel } = interaction.member.voice;

    const nomusic = new MessageEmbed()
      .setDescription(`${emoji.msg.ERROR} There is nothing playing`)
      .setColor(ee.color)

    const empty = new MessageEmbed()
      .setTitle('No song currently playing')
      .setDescription(`[Invite](${config.links.opbotinv}) • [Support server](${config.links.server})`)
      .setColor(ee.color)
      .setImage(ee.nosongbanner)

    let playrow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setStyle("SECONDARY")
          .setCustomId("reducev")
          .setEmoji(emoji.msg.reduce_volume),
        new MessageButton()
          .setStyle("SECONDARY")
          .setCustomId("previous")
          .setEmoji(emoji.msg.previous_track),
        new MessageButton()
          .setStyle("SECONDARY")
          .setCustomId("pause-play")
          .setEmoji(emoji.msg.pause_resume),
        new MessageButton()
          .setStyle("SECONDARY")
          .setCustomId("skip")
          .setEmoji(emoji.msg.skip_track),
        new MessageButton()
          .setStyle("SECONDARY")
          .setCustomId("raisev")
          .setEmoji(emoji.msg.raise_volume)
      )

    interaction.deferUpdate().catch(() => {
      return
    })

    const player = client.manager.players.get(interaction.guild.id);
    const tracks = player.queue;

    console.log(client.setups)


    if (!channel) {
      const opop = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`| You need to join a voice channel.`)
      return interaction.followUp({ embeds: [opop], ephemeral: true });
    }

    if (!player.queue.current) {
      const opop = new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setDescription(`|  Currently Not Playing anything` )
      return interaction.followUp({ embeds: [opop], ephemeral: true });
    }

    if(interaction.customId === 'reducev') {
        if(player.volume === '0') {
            const yto = new MessageEmbed()
            .setDescription(`${emoji.msg.raise_volume} Volume way to quiet at \`${player.volume} %\``)
            .setColor(ee.color)
            interaction.followUp({ embeds: [yto] }).then(responce => {
                setTimeout(() => {
                    try {
                        responce.delete().catch(() => {
                            return
                        })
                    } catch(err) {
                        return
                    }
                }, 12000)
            })
            return
        }
        
        player.setVolume(player.volume - 10); // Keep it I wanna know if it works

        const yto = new MessageEmbed()
        .setDescription(`${emoji.msg.raise_volume} Volume set to \`${player.volume} %\``)
        .setColor(ee.color)
        interaction.followUp({ embeds: [yto] }).then(responce => {
            setTimeout(() => {
                try {
                    responce.delete().catch(() => {
                        return
                    })
                } catch(err) {
                    return
                }
            }, 12000)
        })
    }


    if (interaction.customId === 'pause-resume') {
      if (player.paused === true) {
        player.pause(false);
      } else {
        player.pause(true);
      }
      const yto = new MessageEmbed()
        .setAuthor(`${player.playing ? ` | Resumed` : `| Paused`} the Player.` )
        .setColor(ee.color)
      interaction.followUp({ embeds: [yto]}).then(responce => {
        setTimeout(() => {
          try {
            responce.delete().catch(() => {
              return
            })
          } catch (err) {
            return
          }
        }, 12000)
      })
    }
    if (interaction.customId === 'stop') {
      if (interaction.member.permissions.has("MANAGE_CHANNELS")) {
        const ppl = new MessageEmbed()
          .setDescription(`You not have administrator`)
        interaction.followUp({ embeds: [ppl], ephemeral: true })
      };
      const yto = new MessageEmbed()
        .setAuthor(`| Stopped the player`)
        .setColor(ee.color)
      interaction.followUp({ embeds: [yto]})
      const autoplay = player.get("autoplay")
      if (autoplay === true) {
        player.set("autoplay", false);
      }
      player.stop();
      player.queue.clear();
    }
    
    if (interaction.customId === 'skip') {
      if (player.queue.size == 0) {
        if (player.get("autoplay")) {
          const idkd = new MessageEmbed()
            .setAuthor(`| Skipped` )
            .setColor(ee.color)
          interaction.followUp({ embeds: [idkd]}).then(responce => {
            setTimeout(() => {
              try {
                responce.delete().catch(() => {
                  return
                })
              } catch (err) {
                return
              }
            }, 12000)
          });
          return autoplay(client, player, "skip")
        } else {
          player.stop();
          const idkd = new MessageEmbed()
            .setAuthor(`| Stopped the player.`)
            .setColor(ee.color)
          return interaction.followUp({ embeds: [idkd], ephemeral: true }).then(responce => {
            setTimeout(() => {
              try {
                responce.delete().catch(() => {
                  return
                })
              } catch (err) {
                return
              }
            }, 12000)
          });
        }
      }

      player.stop();
      const yto = new MessageEmbed()
        .setAuthor(`Skipped`)
        .setColor(ee.color)
      interaction.followUp({ embeds: [yto], ephemeral: true }).then(responce => {
        setTimeout(() => {
          try {
            responce.delete().catch(() => {
              return
            })
          } catch (err) {
            return
          }
        }, 1200)
      })

    }  if(interaction.customId === 'raisev') {
        player.setVolume(player.volume + 10); // Keep it I wanna know if it works

        if (player.volume < 0 || player.volume > 150) {
            const yto = new MessageEmbed()
            .setDescription(`${emoji.msg.raise_volume} Volume is way to high at \`${player.volume} %\``)
            .setColor(ee.color)
            interaction.followUp({ embeds: [yto] }).then(responce => {
                setTimeout(() => {
                    try {
                        responce.delete().catch(() => {
                            return
                        })
                    } catch(err) {
                        return
                    }
                }, 12000)
            })
            return
        }
        const yto = new MessageEmbed()
        .setDescription(`${emoji.msg.raise_volume} Volume set to \`${player.volume} %\``)
        .setColor(ee.color)
        interaction.followUp({ embeds: [yto] }).then(responce => {
            setTimeout(() => {
                try {
                    responce.delete().catch(() => {
                        return
                    })
                } catch(err) {
                    return
                }
            }, 12000)
        })
    }

    
  });

  client.on('guildCreate', async (guild) => {
    try {
        const owner = await guild.fetchOwner()
        const embed = new Discord.MessageEmbed()           
        .setTitle("Joined A New Server")
        .setColor("GREEN")
        .setThumbnail(guild.iconURL())
       
        .addField("**Server Name**", guild.name, true)
        .addField("**Server ID**", guild.id, true)
        .addField("**Owner**", `Tag - ${owner.user.tag}\nID - ${owner.id}`, true)
        .addField("**Members**", `${guild.memberCount} + <@807855659173150781>`, true)
    try { embed.addField("**Region**", guild.region, true) } catch {/** */}
    
    client.channels.cache.get("941923468616806410").send({embeds: [embed]})
  } catch (e) { console.log(e) }


 
});

client.on('guildDelete', async (guild) => {
    try {
        const owner = await guild.fetchOwner()
        const embed = new Discord.MessageEmbed()
        .setTitle("Left A New Server")
        .setColor("RED")
        .setThumbnail(guild.iconURL())
       
        .addField("**Server Name**", guild.name, true)
        .addField("**Server ID**", guild.id, true)
        .addField("**Owner**", `Tag - ${owner.user.tag}\nID - ${owner.id}`, true)
        .addField("**Members**", `${guild.memberCount} + <@807855659173150781>`, true)
        client.channels.cache.get("941923513953054761").send({ embeds: [embed] })
    } catch (e) { console.log(e) }
});


});


process.on('unhandledRejection', (error) => {
  web.send(`\`\`\`js\n${error.stack}\`\`\``)
});
process.on("uncaughtException", (err, origin) => {
  web.send(`\`\`\`js\n${err.stack}\`\`\``)
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  web.send(`\`\`\`js\n${err.stack}\`\`\``)
});
process.on('beforeExit', (code) => {
  web.send(`\`\`\`js\n${code}\`\`\``)
});
process.on('exit', (code) => {
  web.send(`\`\`\`js\n${code}\`\`\``)
});
process.on('multipleResolves', (type, promise, reason) => {
}); 
