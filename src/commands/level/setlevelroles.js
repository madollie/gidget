import Command from '../../utils/command.js';
import MessageModel from "../../database/models/levelconfig.js";
//I don't think on rewrite this.
export default class extends Command {
    constructor(options) {
        super(options);
        this.aliases = [];
        this.description = "Put a role that will be given when a user reaches a level.";
        this.guildonly = true;
        this.permissions = {
            user: [8, 0],
            bot: [0, 0]
        };
    }
    async run(message, args) {
        if (!args[1]) return message.channel.send("Usage: `setlevelroles add <level> <roles> / setlevelroles remove <level>`");
        let mode = args[1];
        if (mode !== "add" && mode !== "remove") return message.channel.send("Invalid mode!");
        if (!args[2]) return message.channel.send("Put a level!");
        if (isNaN(args[2])) return message.channel.send("Invalid level!");
        if (mode === "add" && !args[3]) return message.channel.send("Put the roles to be delivered when the level is reached");

        let add = async (leve, toadd) => {
            const level = parseInt(leve);
            if (!level) return;
            if (level < 1) return message.channel.send("Invalid number");
            const msgDocument = await MessageModel.findOne({ guildId: message.guild.id });
            if (msgDocument) {
                let { roles } = msgDocument;
                roles[level - 1] = toadd;
                await msgDocument.updateOne({ roles: roles }).then(async () => {
                    message.guild.cache.levelconfig = false;
                    await message.channel.send("Updated");
                }).catch(err => message.channel.send("Some error ocurred! " + err));
            } else {
                let arr = [];
                arr[level - 1] = toadd;
                await new MessageModel({
                    guildId: message.guild.id,
                    levelnotif: false,
                    levelsystem: false,
                    roles: arr
                }).save().then(async () => {
                    message.guild.cache.levelconfig = false;
                    await message.channel.send("Updated");
                }).catch(err => message.channel.send("Some error ocurred! " + err));
            }
        };
        let remove = async (leve) => {
            const level = parseInt(leve);
            if (!level) return;
            if (level < 1) return message.channel.send("Invalid number");
            const msgDocument = await MessageModel.findOne({ guildId: message.guild.id });
            if (!msgDocument) {
                await message.channel.send("There are no records of that level");
                await new MessageModel({
                    guildId: message.guild.id,
                    levelnotif: false,
                    levelsystem: false,
                    roles: arr
                }).save().then(async () => {
                    message.guild.cache.levelconfig = false;
                    await message.channel.send("Updated");
                }).catch(err => message.channel.send("Some error ocurred! " + err));
            } else {
                let { roles } = msgDocument;
                if (!roles[level - 1]) return message.channel.send("There are no records of that level");
                roles[level - 1] = undefined;
                await msgDocument.updateOne({ roles: roles }).then(async () => {
                    message.guild.cache.levelconfig = false;
                    await message.channel.send("Updated");
                }).catch(err => message.channel.send("Some error ocurred! " + err));
            }
        };

        if (mode === "add") {
            let roles = message.mentions.roles.first() ? message.mentions.roles.map(e => e.id) : args.slice(3);
            if (!roles.every(e => message.guild.roles.cache.has(e))) return message.channel.send("Invalid roles!");
            add(args[2], roles);
        } else if (mode === "remove") {
            remove(args[2]);
        }
    }
}