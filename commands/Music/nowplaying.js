const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require("../../botconfig/emojis.json");
const { createBar, format } = require(`../../handlers/functions`);
module.exports = {
    name: `nowplaying`,
    category: `Music`,
    aliases: [`np`, `current`],
    description: `Shows information about the current Song`,
    usage: `nowplaying`,
    parameters: {"type":"music", "activeplayer": true, "previoussong": false},
    run: async (client, message, args, guildData, player, prefix) => {
        try {
            //if no current song return error
            if (!player.queue.current) {
                const no = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setAuthor(`|  Currently Not Playing anything`, message.author.displayAvatarURL({ dynamic: true }))
                return message.reply({embeds: [no], allowedMentions: { repliedUser: false }})
            }
            //Send Now playing Message
            const np = new MessageEmbed()
            .setAuthor(`| Now Playing`, message.author.displayAvatarURL({dynamic: true}), config.links.opmusicvote)
            
            .setColor(ee.color)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`**${player.queue.current.title}**`)
            .addField(`Duration: `, `\`${!player.queue.current.isStream ? `${new Date(player.queue.current.duration).toISOString().slice(11, 19)}` : '◉ LIVE'}\``, true)
            .addField(`Song By: `, `\`${player.queue.current.author}\``, true)
            .addField(`Queue length: `, `\`${player.queue.length} Songs\``, true)
            try { } catch {/** */}
            np.setFooter(`Requested by: ${player.queue.current.requester.tag}`, player.queue.current.requester.displayAvatarURL({ dynamic: true }) )
            return message.reply({embeds: [np], allowedMentions: { repliedUser: false }});
        } catch (e) {
            console.log(String(e.stack).bgRed)
            const emesdf = new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setAuthor(`An Error Occurred`)
            .setDescription(`\`\`\`${e.message}\`\`\``);
            return message.channel.send({embeds: [emesdf]});
        }
    },

    runslash: async (client, interaction, guildData, player, prefix) => {
        try {
            //if no current song return error
            if (!player.queue.current) {
                const no = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setAuthor(`|  Currently Not Playing anything`, message.author.displayAvatarURL({ dynamic: true }))
                return interaction.reply({ embeds: [no] })
            }
            //Send Now playing Message
            const np = new MessageEmbed()
            .setAuthor(`Now Playing:`, message.author.displayAvatarURL({dynamic: true}), config.links.opmusicvote)
            .setURL(player.queue.current.uri)
            .setColor("#2F3136")
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`${player.playing ? `${emoji.msg.playing}` : `${emoji.msg.pause}`} **${player.queue.current.title}**`)
            .addField(`${emoji.msg.time} Duration: `, `\`${!player.queue.current.isStream ? `${new Date(player.queue.current.duration).toISOString().slice(11, 19)}` : '◉ LIVE'}\``, true)
            .addField(`${emoji.msg.song_by} Song By: `, `\`${player.queue.current.author}\``, true)
            .addField(`${emoji.msg.repeat_mode} Queue length: `, `\`${player.queue.length} Songs\``, true)
            try { np.addField(` Progress: `, createBar(player), true) } catch {/** */}
            np.setFooter(`Requested by: ${player.queue.current.requester.tag}`, player.queue.current.requester.displayAvatarURL({ dynamic: true }) )
            return interaction.reply({embeds: [np]});
        } catch (e) {
            console.log(String(e.stack).bgRed)
            const emesdf = new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setAuthor(`An Error Occurred`)
            .setDescription(`\`\`\`${e.message}\`\`\``);
            return interaction.reply({ embeds: [emesdf] });
        }
    }
};
