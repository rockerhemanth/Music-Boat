const util = require("../util");
module.exports = {
  name: "24/7",
  description: "Stays in Voice Channel When Enabled.",
  aliases: ["24*7", "24/7", "twentyfourseven", "247"],
  exec: async (msg) => {
    try {
      const { music } = msg.guild;

      if (!msg.member.permissions.any(["MANAGE_GUILD", "ADMINISTRATOR"]))
        return msg.channel.send(util.embed()
          .setAuthor(" |  Missing Permission", msg.author.displayAvatarURL({ dynamic: true })));

      let x = await msg.client.db.get(`247_${msg.guild.id}`);

      if (x == true) {
        if (!msg.member.voice.channel)
          return msg.channel.send(util.embed().setAuthor(" |    You Must Join A Voice Channel", msg.author.displayAvatarURL({ dynamic: true })));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
          return msg.channel.send(util.embed().setDescription(" |  You Aren't Connected To The Same Voice Channel As I Am"));
        await msg.client.db.set(`247_${msg.guild.id}`, false);
        await msg.client.db.delete(`vcid_${msg.guild.id}`);
        msg.channel.send(util.embed()
          .setAuthor(` |  Disabled 24/7 mode in ${msg.guild.name}`, msg.author.displayAvatarURL({ dynamic: true }))
        );
      }
      else if (!x) {
        if (!msg.member.voice.channel)
          return msg.channel.send(util.embed().setAuthor(" |  You Aren't Connected To A Voice channel", msg.author.displayAvatarURL({ dynamic: true })));
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
          return msg.channel.send(util.embed().setAuthor(" |  You Aren't Connected To The Same Voice Channel As I Am", msg.author.displayAvatarURL({ dynamic: true })));
        await msg.client.db.set(`vcid_${msg.guild.id}`, msg.member.voice.channelID);
        await msg.client.db.set(`247_${msg.guild.id}`, true);
        if (!music.player || !music.player.playing) {
          if (msg.guild.me.voice.channel) { msg.guild.member(msg.client.user.id).voice.setChannel(msg.member.voice.channel); }
          if (!msg.guild.me.voice.channel) {
            await music.join(msg.member.voice.channel);
          }
        }
        return msg.channel.send(util.embed()
          .setAuthor(` |  Enabled 24/7 mode in ${msg.guild.name}`, msg.author.displayAvatarURL({ dynamic: true })));
      }
    } catch (err) {
      msg.channel.send(util.embed().setDescription(`An error occured: ${err.message}.\nPlease use report command or Join [support Server](https://discord.gg/K9BnjfEwqy)`));
      return util.web().send(`Error from **${msg.guild.name}**\nCmd:24/7 \n\n${err.message}`);
    }
  }

};
