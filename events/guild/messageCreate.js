const config = require("../../botconfig/config.json"); 
const ee = require("../../botconfig/embed.json"); 
const emoji = require(`../../botconfig/emojis.json`);
const Discord = require("discord.js"); 
const { escapeRegex, databasing, findOrCreateGuild} = require("../../handlers/functions"); 
const {
  MessageEmbed
} = require(`discord.js`);

module.exports = async (client, message,guild) => {
    
    if (!message.guild || !message.channel) return;
    
    if (message.channel.partial) await message.channel.fetch();
    
    if (message.partial) await message.fetch();
    
    if (message.author.bot) return;
    
    const guildData = await findOrCreateGuild(client, { id: message.guild.id });
   
    let prefix = guildData.prefix;
    
    if (prefix === null) prefix = config.prefix;
    
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    
    if (!prefixRegex.test(message.content)) return;
   
    const [, matchedPrefix] = message.content.match(prefixRegex);

    let not_allowed = false;
    
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    //creating the cmd argument by shifting the args by 1
    const cmd = args.shift().toLowerCase();
    //if no cmd added return error
    if (cmd.length === 0){
      not_allowed = true;
      if(matchedPrefix.includes(client.user.id)){
        const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
          
					.setURL("https://discord.com/api/oauth2/authorize?client_id=807855659173150781&permissions=534991339329&redirect_uri=https%3A%2F%2Fdiscord.gg%2Fj7E5759ffc&response_type=code&scope=bot%20applications.commands%20guilds.join")
          .setLabel("Invite Me!") 
					.setStyle("LINK")
          .setEmoji("<:invite:918184240431124480>"),  
          new MessageButton()
					.setURL("https://discord.gg/j7E5759ffc")
          .setLabel("Support Server!")
          .setEmoji("<:G_question:917238164085678131>")
					.setStyle("LINK"),
          
			);
        const embed = new MessageEmbed()
        .setColor('87fdea')
        .setAuthor('Music-Boat', 'https://media.discordapp.net/attachments/940526488783040523/941910800292016138/qsffqs.png?width=427&height=427','https://discord.com/api/oauth2/authorize?client_id=807855659173150781&permissions=534789880176&redirect_uri=https%3A%2F%2Fdiscord.gg%2FkpjYgY35Vt&response_type=code&scope=bot%20applications.commands%20guilds.join')
        .setDescription(`Hey, I'm Music-Boat \n **Server Prefix**: \`${prefix}\`\n \n Nike is the easiest way to play music in your discord server.It Supports Spotify,Youtude, Soundcloud and more!! \n \n To get started. join a voice channel and \`${prefix}play\` a song. You can use song names, video links, and playlist links  \n \n **Commands** \n For full list of commands Type \`${prefix}help\``)
        .setThumbnail("https://media.discordapp.net/attachments/940526488783040523/941910800292016138/qsffqs.png?width=427&height=427");
        
        message.channel.send({embeds: [embed] ,  components: [row]})
      
      }
      return;
    }
    
    let command = client.commands.get(cmd);


 if (!command) command = client.commands.get(client.aliases.get(cmd));
    if(command){
     
      if(guildData.botChannels.toString() !== ""){
        if (!guildData.botChannels.includes(message.channel.id) && !message.member.permissions.has(Discord.Permissions.FLAGS.SEND_MESSAGES)) {
          let leftb = "";
          for(let i = 0; i < guildData.botChannels.length; i++){
              leftb  +="<#" +guildData.botChannels[i] + "> / "
          }
          try{ message.react(emoji.msg.ERROR); }catch{}
          not_allowed = false;
          return;
    
        }
      }
}


    if (!command) command = client.commands.get(client.aliases.get(cmd));
    
    //if the command is now valid
    if (command){
      if(!message.channel.permissionsFor(message.guild.me).has("SEND_MESSAGES")) return;
      if(!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")){
        const x = await message.channel.send({content: `${emoji.msg.ERROR} | I don't have \`EMBED LINKS\` permssion`})
        setTimeout(() => x.delete().catch(e=>console.log("Could not delete, this prevents a bug")), 5000)
        return;
      }
        if (!client.cooldowns.has(command.name)) { //if its not in the cooldown, set it too there
            client.cooldowns.set(command.name, new Discord.Collection());
        }
        const now = Date.now(); //get the current time
        const timestamps = client.cooldowns.get(command.name); //get the timestamp of the last used commands
        const cooldownAmount = (command.cooldown || 2.5) * 1000; 
        if (timestamps.has(message.author.id)) { 
          const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
          if (now < expirationTime) { 
            const timeLeft = (expirationTime - now) / 1000; 
            try{ message.react(emoji.msg.ERROR); }catch{}
            not_allowed = true;
            const idkd = new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setDescription(`${emoji.msg.ERROR} Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
            return message.reply({embeds: [idkd], allowedMentions: { repliedUser: false }}); 
          }
        }
        timestamps.set(message.author.id, now); 
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount); 
      try{
        
        if(command.memberpermissions) {
          if (!message.member.permissions.has(command.memberpermissions)) {
            try{ message.react(emoji.msg.ERROR); }catch{}
            not_allowed = true;
            const idkf = new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
            .setDescription(`${emoji.msg.ERROR} | You need these Permissions: \`${command.memberpermissions.join("`, ``")}\``)
            const x = await message.reply({embeds: [idkf], allowedMentions: { repliedUser: false }})
            setTimeout(() => x.delete().catch(e=>console.log("Could not delete, this prevents a bug")), 5000)
            return;
          }
        }
        

        if(command.category.toLowerCase().includes("settings") || command.category.toLowerCase().includes("music") || command.category.toLowerCase().includes("owner")) {
          let neededPermissions = [];
          let required_perms = ["VIEW_CHANNEL"]
          required_perms.forEach(perm => {
            if(!message.channel.permissionsFor(message.guild.me).has(perm)){
              neededPermissions.push(perm);
            }
          })
          if(neededPermissions.length > 0){
            const MISSING_BOT_PERMS = new MessageEmbed()
            .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
            .setDescription(`${emoji.msg.ERROR} | I need ${neededPermissions.map((p) => `\`${p}\``).join(", ")} to execute this command`)
            .setColor(ee.color)
            return message.reply({embeds: [MISSING_BOT_PERMS], allowedMentions: { repliedUser: false }});
          }    
        }

        const player = client.manager.players.get(message.guild.id);
        
        if(command.parameters) {
          if(command.parameters.type == "music"){
             //get the channel instance
            const { channel } = message.member.voice;
            const mechannel = message.guild.me.voice.channel;
            //if not in a voice Channel return error
            if (!channel) {
              not_allowed = true;
              const opop = new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setAuthor(`|  You aren't connected to a voice channel.`, message.author.displayAvatarURL( { dynamic: true } ))
              return message.reply({embeds: [opop], allowedMentions: { repliedUser: false }});
            }
            //If there is no player, then kick the bot out of the channel, if connected to
            if(!player && mechannel) {
              const newPlayer = client.manager.create({
                guild: message.guild.id,
                voiceChannel: message.member.voice.channel.id,
                textChannel: message.channel.id,
                selfDeafen: true,
              })
              newPlayer.destroy();
            }
            //if no player available return error | aka not playing anything
            if(command.parameters.activeplayer){
              if (!player){
                not_allowed = true;
                const udfj = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setAuthor(`| Currently Not Playing anything`, message.author.displayAvatarURL( { dynamic: true } ))
                return message.reply({embeds: [udfj] , allowedMentions: { repliedUser: false }});
              }
              if (!mechannel){
                if(player) try{ player.destroy() }catch{ }
                not_allowed = true;
                const mmmm = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setAuthor(`| The bot Not connected to a voice channel.`, message.author.displayAvatarURL( { dynamic: true } ))
                return message.reply({embeds: [mmmm], allowedMentions: { repliedUser: false }});
              }
              if(!player.queue.current) {
                const no = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setAuthor(`|  Currently Not Playing anything`, message.author.displayAvatarURL( { dynamic: true } ))
                return message.reply({embeds: [no], allowedMentions: { repliedUser: false }})
              }
            }
            //if no previoussong
            if(command.parameters.previoussong){
              if (!player.queue.previous || player.queue.previous === null){
                not_allowed = true;
                const ifkf = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setAuthor(`| There is no previous song yet!`, message.author.displayAvatarURL( { dynamic: true } ))
                return message.reply({embeds: [ifkf], allowedMentions: { repliedUser: false }});
              }
            }
            //if not in the same channel --> return
            if (player && channel.id !== player.voiceChannel && !command.parameters.notsamechannel) {
              const ikkkk = new MessageEmbed()
              .setColor(ee.wrongcolor)
          
              .setAuthor(`| You aren't connected to the same voice channel as I am`, message.author.displayAvatarURL( { dynamic: true } ))
              return message.reply({embeds: [ikkkk], allowedMentions: { repliedUser: false }});
            }
            //if not in the same channel --> return
            if (mechannel && channel.id !== mechannel.id && !command.parameters.notsamechannel) {
              const ikk = new MessageEmbed()
              .setColor(ee.wrongcolor)
              .setAuthor(` | You aren't connected to the same voice channel as I am`, message.author.displayAvatarURL( { dynamic: true } ))
              return message.reply({embeds: [ikk], allowedMentions: { repliedUser: false }}); 
            }
          }
        }
        //run the command with the parameters:  client, message, args, user, text, prefix,
        if(not_allowed) return;
        command.run(client, message, args, guildData, player, prefix, guild);
        console.log(`${message.author.tag} ran ${command.name}`)
      }catch (e) {
        console.log(String(e.stack).red)
        const dkdk = new Discord.MessageEmbed()
        .setColor(ee.wrongcolor)
        .setAuthor("An Error Occured")
        .setDescription(`\`\`\`${e.message}\`\`\``)
        const x = await message.channel.send({embeds: [dkdk]})
        setTimeout(() => x.delete().catch(e=>console.log("Could not delete, this prevents a bug")), 5000)
        return;
      }
    }
    else //if the command is not found send an info msg
    return;
