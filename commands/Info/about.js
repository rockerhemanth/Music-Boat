const { MessageEmbed } = require("discord.js");
const emoji = require(`../../botconfig/emojis.json`);
const embed = require(`../../botconfig/embed.json`);


module.exports = {
    name: "about",
    description: "About",
    category: "Info",
    run: async (client, message, args, guildData, player, guild) => {
        let premium = new MessageEmbed()
        .setAuthor(`${message.author.tag} - About`,  message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(
`
**Msv Music's**
\`\`\`asciidoc
Team Members :: Msv
\`\`\`
`
)
.setColor(`#fd6260`) 

message.channel.send({embeds: [premium]})
    }
}
