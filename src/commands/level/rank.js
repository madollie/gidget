import Command from '../../utils/command.js';
import Discord from 'discord.js';
import db from "../../database/models/levels.js";
import Levels from "../../utils/discord-xp.js";
import rankimage from "../../utils/rank.js";

export default class extends Command {
  constructor(options) {
    super(options);
    this.aliases = ["level"];
    this.description = "Rank";
    this.guildonly = true;
    this.permissions = {
      user: [0, 0],
      bot: [0, 16384]
    };
  }
  async run(message, args) {
    const msgDocument = message.guild.cache.levelconfig ? message.guild.levelconfig : await message.guild.getLevelConfig()
    if (!msgDocument) return message.channel.send("The levels on this server are disabled! Use `togglelevel system` to enable the system!")
    if (msgDocument && !msgDocument.levelsystem) return message.channel.send("The levels on this server are disabled! Use `togglelevel system` to enable the system!")
    const target = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(u => u.displayName === args.slice(1).join(" ")) || message.guild.members.cache.find(u => u.user.username === args.slice(1).join(" ")) || (args[1] ? await message.guild.members.fetch(args[1]).catch(err => { }) : undefined) || message.member; // Grab the target.
    if (target.user.bot) return message.reply("bots can't earn XP");
    const user = await Levels.fetch(target.id, message.guild.id);// Selects the target from the database.
    if (!user) return message.channel.send("Seems like this user has not earned any xp so far."); // If there isnt such user in the database, we send a message in general.
    var lb = await db
      .find({ guildID: message.guild.id })
      .sort([["xp", "descending"]])
      .exec()
    let index = -1;
    for (let i in lb) {
      if (lb[i].userID === target.user.id) {
        index = Number(i) + 1;
        break;
      }
    }
    const attachment = new Discord.MessageAttachment(await rankimage({ username: target.user.username, discrim: target.user.discriminator, level: user.level, rank: index, neededXP: (Levels.xpFor(user.level + 1) - Levels.xpFor(user.level)), currentXP: (user.xp - Levels.xpFor(user.level)) !== 0 ? user.xp - Levels.xpFor(user.level) : (user.xp - Levels.xpFor(user.level)) + 1, avatarURL: target.user.displayAvatarURL({ format: "png" }) }), "rank.png")
    await message.channel.send(attachment);
  }
}