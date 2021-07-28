const util = require("../util");

module.exports = {
    name: "message",
    exec: async (client, msg) => {
        if (!msg.guild) return;
        if (msg.author.bot) return;
        if (msg.channel.type === "dm") return;
        
        let prefix = db.get(`prefix_${msg.guild.id}`);
        if (prefix === null) prefix = process.env.PREFIX;
        
        if(msg.content === `<@${client.user.id}>` || msg.content === `<@!${client.user.id}>`){
            msg.channel.send(util.embed().setDescription(`My prefix here is \`${prefix}\` . You can play music by joining a voice channel and typing \`${prefix}play\`. The command accepts song names, video links, and playlist links.`).setColor("BLACK"));   
        }
        const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);

        if(!prefixRegex.test(msg.content)) return;
        const [, matchedPrefix] = msg.content.match(prefixRegex);
        const args = msg.content.slice(matchedPrefix.length).trim().split(/ +/g);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(c => c.aliases && c.aliases.includes(commandName));
        if (command) {
            try {
                await command.exec(msg,args);
            } catch (e) {
                console.error(e);
            }
        }
    }
};
