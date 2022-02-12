const { MessageEmbed, MessageActionRow, MessageButton} = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const { autojoin } = require("../../handlers/autojoin");
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');

module.exports = {
    name: `24/7`,
    aliases: [`247`, `autojoin`],
    perms: [ `SEND_MESSAGES` ],
    botperms: [ `SEND_MESSAGES`, `EMBED_LINK` ],
    category: `Music`,
    description: `Enable 24/7 mode in your server`,
    usage: `24/7`,
    memberpermissions: [`MANAGE_CHANNELS`],
  parameters: {"type":"music", "activeplayer": false, "previoussong": false},
    run: async (client, message, args, guildData, player, prefix) => {
        try {

                     {
            
        const memchannel = message.member.voice.channel;
            if(!memchannel) {
                const eme = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setAuthor(` |  You aren't connected to a voice channel.`, message.author.displayAvatarURL({ dynamic: true }))
                return message.reply({embeds: [eme], allowedMentions: { repliedUser: false }})
            }
                       if(!player.queue.current) {
                            const no = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setAuthor(`|  Currently Not Playing anything.`, message.author.displayAvatarURL({ dynamic: true }))
                            return message.reply({embeds: [no], allowedMentions: { repliedUser: false }})
                                                  } 
                       

guildData.ajenabled = !guildData.ajenabled
            guildData.textChannel = guildData.ajenabled ? null : message.channel.id;
            guildData.voiceChannel = guildData.ajenabled ? null : memchannel.id;
            guildData.save()

await autojoin(message.guild.id, message.member.voice.channel.id, message.channel.id)
             
            const suc = new MessageEmbed()
            .setColor(ee.color)
            .setAuthor(`| ${guildData.ajenabled ? `Enabled` : `Disabled`} 24/7 mode in ${message.guild.name}`, message.author.displayAvatarURL({ dynamic: true }))
            message.reply({embeds: [suc], allowedMentions: { repliedUser: false }})
      }
  
        
            
            
        } catch (e) {
            console.log(String(e.stack).bgRed)
            const emesdf = new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setAuthor(`An Error Occurred`)
            .setDescription(`\`\`\`${e.message}\`\`\``);
            return message.channel.send({embeds: [emesdf]});
        }
    }
};
