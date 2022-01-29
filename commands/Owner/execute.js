const { MessageEmbed } = require(`discord.js`);
const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const emoji = require(`../../botconfig/emojis.json`);
module.exports = {
    name: `execute`,
    category: `Owner`,
    aliases: [ ],
    description: `execute custom Command`,
    usage: `execute`,
    run: async (client, message, args, guildData, player, prefix) => {
        if (!config.ownerIDS.includes(message.author.id)) {
            const nope = new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setAuthor(`| You are not allowed to run this command! Only the developers is allowed to run this command`, message.author.displayAvatarURL({ dynamic: true }))
            return message.reply({embeds: [nope],  allowedMentions: { repliedUser: false }})
        }

        try {

            const { findOrCreateGuild } = require("../../handlers/functions");
            const guilds  = client.guilds.cache.map(g => g)
            guilds.forEach(async g => {
                const guildD = await findOrCreateGuild(client, { id: g.id });
                guildD.announce = true;
                guildD.save();
            })
            message.channel.send(`Changed ${guilds.length} files`)

        } catch (e) {
            console.log(String(e.stack).bgRed)
            const emesdf = new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setAuthor(`An Error Occurred`)
            .setDescription(`\`\`\`${e.message}\`\`\``);
            return message.channel.send({embeds: [emesdf]});
        }
    },
};
