const db = require("quick.db");

module.exports = {
  name: "setprefix",  
  description: "Change the guild prefix",
  exec: async (msg, args) => {
   
    //PERMISSION
    if(!msg.member.hasPermission("ADMINISTRATOR")) {
      return msg.channel.send("You are not allowed or do not have permission to change prefix")
    }
    
    if(!args[0]) {
      return msg.channel.send("**Please give the prefix that you want to set**")
    } 
         
    if(args[1]) {
      return msg.channel.send("You can not set prefix a double argument")
    }
    
    if(args[0].length > 3) {
      return msg.channel.send("You can not send prefix more than 3 characters")
    }
    
    if(args.join("") === process.env.PREFIX) {
      db.delete(`prefix_${msg.guild.id}`)
     return await msg.channel.send("Reseted Prefix ✅")
    }
    
    db.set(`prefix_${msg.guild.id}`, args[0])
    await msg.channel.send(`Seted Bot Prefix to ${args[0]}`)
    
  }
}
