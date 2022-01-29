const { MessageEmbed } = require(`discord.js`);
const { autojoin } = require("../../handlers/autojoin");
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const DBL = require('@top-gg/sdk');
const emoji = require(`../../botconfig/emojis.json`);




module.exports = {
    name: `24/7`,
    aliases: [`247`, `autojoin`],
    premium: true,
    perms: [ `SEND_MESSAGES` ],
    botperms: [ `SEND_MESSAGES`, `EMBED_LINK` ],
    category: `Settings`,
    description: `Enable 24/7 mode in your server`,
    usage: `24/7`,
    premium: true,
    memberpermissions: [`ADMINISTRATOR`],
    run: async (client, message, args, guildData, player, prefix) => {



const isPermGuild = require("../../models/premiumGuild");

      const isPremium = await isPermGuild.findOne({
             GuildID: message.guild.id,
           });
     
           if (!isPremium) {
             let noprem = new MessageEmbed()
             .setTitle(`No Premium Subscription`)
             .setDescription(`This This A Premium Command Dm developers To Buy Premium [ [ Free Till Verification ] ](${config.links.server})`)
              .setColor(ee.color) 

             message.reply({embeds : [noprem]})
           }
      
        if (isPremium) {
        const memchannel = message.member.voice.channel;
            if(!memchannel) {
                const eme = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
              .setDescription(`${emoji.msg.ERROR} | You have to be connected to a voice channel before you can use this command.`)
                return message.channel.send({embeds: [eme]})
            }

            guildData.ajenabled = !guildData.ajenabled
            guildData.textChannel = guildData.ajenabled ? null : message.channel.id;
            guildData.voiceChannel = guildData.ajenabled ? null : memchannel.id;
            guildData.save()

            
await autojoin(message.guild.id, message.member.voice.channel.id, message.channel.id)

             
            const suc = new MessageEmbed()
            .setAuthor(`${message.author.tag} - 24/7`, message.author.displayAvatarURL( { dynamic: true } ))
            .setDescription(`${guildData.ajenabled ? emoji.msg.SUCCESS : emoji.msg.ERROR} | 24/7 Mode is now **${guildData.ajenabled ? `Enabled` : `Disabled`}** Successfully`)
            .setColor(ee.color)
          
            message.channel.send({embeds: [suc]})
      
        }
   
          
           
   
            
        
    }
};
