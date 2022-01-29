const config = require("../../botconfig/config.json"); //loading config file with token and prefix, and settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const emoji = require(`../../botconfig/emojis.json`);
const Discord = require("discord.js"); 
const { escapeRegex, databasing, findOrCreateGuild} = require("../../handlers/functions"); 

const { MessageEmbed } = require(`discord.js`);

const web = new Discord.WebhookClient({ url: config.webhookurl });

module.exports = async (client, interaction) => {
    
    if (!interaction.guild || !interaction.channel) return;
    
    if (interaction.user.bot) return;
    
    const guildData = await findOrCreateGuild(client, { id: interaction.guild.id });
    
    let prefix = guildData.prefix;
    
    if (prefix === null) prefix = config.prefix;
   
    const cmd = interaction.commandName
    
    let not_allowed = false;
   
    let command = client.commands.get(cmd);
    
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if(command){
       
        if(guildData.botChannels.toString() !== ""){
            if (!guildData.botChannels.includes(interaction.channel.id) && !interaction.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                let leftb = "";
                for(let i = 0; i < guildData.botChannels.length; i++){
                    leftb  +="<#" +guildData.botChannels[i] + "> / "
                }
                not_allowed = true;
                
                return;
            }
        }  
    }

    if (command)    {
        if(!interaction.channel.permissionsFor(interaction.guild.me).has("SEND_MESSAGES")) return;
        if(!interaction.channel.permissionsFor(interaction.guild.me).has("EMBED_LINKS")){
            interaction.reply({ content: `${emoji.msg.ERROR} I don't have \`EMBED LINKS\` permssion`, ephemeral: true })
            return;
        }
            if (!client.cooldowns.has(command.name)) {
                client.cooldowns.set(command.name, new Discord.Collection());
            }
            const now = Date.now(); //get the current time
            const timestamps = client.cooldowns.get(command.name); 
            const cooldownAmount = (command.cooldown || 2.5) * 1000; 
            if (timestamps.has(interaction.user.id)) { 
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                if (now < expirationTime) { 
                    const timeLeft = (expirationTime - now) / 1000; 
                    not_allowed = true;
                    const idkd = new Discord.MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setDescription(`${emoji.msg.ERROR} Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
                    return interaction.reply({embeds: [idkd]}); 
                }
            }
            timestamps.set(interaction.user.id, now); 
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount); 
        try{
            
            if(command.memberpermissions) {
                if (!interaction.member.permissions.has(command.memberpermissions)) {
                    not_allowed = true;
                    const idkf = new Discord.MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
            .setDescription(`${emoji.msg.ERROR} | You need these Permissions: \`${command.memberpermissions.join("`, ``")}\``)
                    interaction.reply({ embeds: [idkf], ephemeral: true })
                    return;
                }
            }
            

            if(command.category.toLowerCase().includes("settings") || command.category.toLowerCase().includes("music") || command.category.toLowerCase().includes("owner")) {
                let neededPermissions = [];
                let required_perms = [ "ADD_REACTIONS", "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "CONNECT", "SPEAK", "MOVE_MEMBERS" , "READ_MESSAGE_HISTORY"]
                required_perms.forEach(perm => {
                    if(!interaction.channel.permissionsFor(interaction.guild.me).has(perm)){
                        neededPermissions.push(perm);
                    }
                })
                if(neededPermissions.length > 0){
                    const MISSING_BOT_PERMS = new MessageEmbed()
                    .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
            .setDescription(`${emoji.msg.ERROR} | I need ${neededPermissions.map((p) => `\`${p}\``).join(", ")} to execute this command`)
                    .setColor("RED");
                    return interaction.editReply({embeds: [MISSING_BOT_PERMS]});
                }    
            }

            const player = client.manager.players.get(interaction.guild.id);
        
            if(command.parameters) {
                if(command.parameters.type == "music"){
                  
                    const { channel } = interaction.member.voice;
                    const mechannel = interaction.guild.me.voice.channel;
                   
                    if (!channel) {
                        not_allowed = true;
                        const opop = new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
              .setDescription(`${emoji.msg.ERROR} | You have to be connected to a voice channel before you can use this command.`)
                        return interaction.reply({ embeds: [opop] });
                    }
                    if(!player && mechannel) {
                        const newPlayer = client.manager.create({
                            guild: interaction.guild.id,
                            voiceChannel: interaction.member.voice.channel.id,
                            textChannel: interaction.channel.id,
                            selfDeafen: true,
                        })
                        newPlayer.destroy();
                    }
                   
                    if(command.parameters.activeplayer){
                        if (!player){
                            not_allowed = true;
                            const udfj = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setDescription(`${emoji.msg.ERROR} | There is nothing playing`)
                            return interaction.editReply({embeds: [udfj]});
                        }
                        if (!mechannel){
                            if(player) try{ player.destroy() }catch{ }
                            not_allowed = true;
                            const mmmm = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
                .setDescription(`${emoji.msg.ERROR} | I am not connected to a Channel`)
                            return interaction.editReply({embeds: [mmmm]});
                        }
                        if(!player.queue.current) {
                            const no = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
                .setDescription(`${emoji.msg.ERROR} | There is nothing playing`)
                            return interaction.editReply({embeds: [no]})
                        }
                    }
                   
                    if(command.parameters.previoussong){
                        if (!player.queue.previous || player.queue.previous === null){
                            not_allowed = true;
                            const ifkf = new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
                .setDescription(`${emoji.msg.ERROR} | There is no previous song`)
                            return interaction.editReply({embeds: [ifkf]});
                        }
                    }
                
                    if (player && channel.id !== player.voiceChannel && !command.parameters.notsamechannel) {
                        const ikkkk = new MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
              .setDescription(`${emoji.msg.ERROR} | You Need To Join My Channel To Use This Command`)
                        return interaction.editReply({embeds: [ikkkk]});
                    }
                  
                    if (mechannel && channel.id !== mechannel.id && !command.parameters.notsamechannel) {
                        const ikk = new MessageEmbed()
                        .setColor(ee.wrongcolor)
                       .setAuthor(`${message.author.tag} - Error`, message.author.displayAvatarURL( { dynamic: true } ))
              .setDescription(`${emoji.msg.ERROR} | You Need To Join My Channel To Use This Command`)
                        return interaction.editReply({embeds: [ikk]});
                    }
                }
            }
         
            if(not_allowed) return;

            if(command.runslash === undefined) {
                const hahafunnylol = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setDescription(`${emoji.msg.ERROR} \`${command.name}\` Is probably not coded right or theres an error`)
                return interaction.reply({ embeds: [hahafunnylol], ephemeral: true })
            }
            command.runslash(client, interaction, guildData, player, prefix);
            web.send(`${interaction.user.tag} ran ${command.name}`)
        } catch (e) {
            console.log(String(e.stack).red)
            const dkdk = new Discord.MessageEmbed()
            .setColor(ee.wrongcolor)
            .setAuthor("An Error Occured")
            .setDescription(`\`\`\`${e.message}\`\`\``)
            interaction.reply({ embeds: [dkdk] })
            return;
        }
    }
    else 
    return;
}
