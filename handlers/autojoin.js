const autojoinSchema = require("../models/autojoin");

module.exports.autojoin = autojoin;
module.exports.gettc = gettc;
module.exports.getvc = getvc;

async function autojoin(guildID, vcID, tcID) {
    const data = await autojoinSchema.findOne({ guildID: guildID })
    if(!data) {
        new autojoinSchema({
            guildID: guildID,
            voiceChannel: vcID,
            textChannel: tcID
        }).save()
    } else if(data) {
        await autojoinSchema.findOneAndUpdate({
            guildID: guildID
        },
        {
            $set: {
                voiceChannel: vcID,
                textChannel: tcID
            }
        })
    }
}

async function getvc(guildID) {
    const data = await autojoinSchema.findOne({guildID: guildID})
    if(!data) {
        return null;
    } else if(data) {
        return data.voiceChannel;
    }
}

async function gettc(guildID) {
    const data = await autojoinSchema.findOne({guildID: guildID})
    if(!data) {
        return null;
    } else if(data) {
        return data.textChannel;
    }}
