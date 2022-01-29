const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("../botconfig/config.json");

module.exports = mongoose.model("Guild", new Schema({

	
	id: { type: String }, 
    
	
	prefix: { type: String, default: config.prefix }, 

	ajenabled: { type: Boolean, default: false },
	voiceChannel: { type: String, default: null },
	textChannel: { type: String, default: null },

	
    pruning: { type: Boolean, default: true },
	announce: { type: Boolean, defaylt: true },
	djonlycmds: { type: Array, default: ["autoplay", "clearqueue", "forward", "loop", "pause", "resume", "remove", "restart", "rewind", "seek", "shuffle", "skip", "stop", "volume"] },
	djRoles: { type: Array, default: [] },
	botChannels: { type: Array, default: [] }
}));
