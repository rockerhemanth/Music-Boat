const { Schema, model } = require("mongoose");

const autojoinSchema = new Schema({
    guildID: String,
    voiceChannel: String,
    textChannel: String
})

module.exports = model('autojoin', autojoinSchema);
