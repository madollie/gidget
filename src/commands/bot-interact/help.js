import Command from '../../utils/command.js';
import def from "../../utils/definitions.json";
import Discord from "discord.js";
export default class extends Command {
  constructor(options) {
    super(options);
    this.aliases = ["h"];
    this.description = "Help command";
    this.permissions = {
      user: [0, 0],
      bot: [0, 16384]
    }
  }
  async run(message, args) {
    const c = this.bot.commands.clone();
    const arr = []
    for (const o of Object.entries(def)) {
      arr.push({
        catname: o[0],
        cat: o[1].name,
        secret: o[1].secret,
        onlyguild: o[1].onlyguild,
        commands: c.filter(z => z.category === o[0]).map(e => e)
      })
    }
    if (args[1] && arr.find(d => d.catname === args[1])) {
      const g = arr.find(d => d.catname === args[1]);
      const embed = new Discord.MessageEmbed()
        .setThumbnail("https://vignette.wikia.nocookie.net/wubbzy/images/7/7d/Gidget.png")
        .setColor("#FF8000")
        .addField('Links', `[Bot's page (in progress)](https://gidget.xyz/) | [Source code](https://github.com/AndreMor955/gidget) | [AndreMor's page](https://wubbzy.gidget.xyz) | [Discord.js documentation](https://discord.js.org/#/docs/)`)
        .setTitle(g.cat + " (" + g.commands.length + " commands)")
        .setDescription(Discord.Util.splitMessage(g.commands.filter(s => {
          if (s.secret) return false
          if (s.onlyguild && (message.guild ? (message.guild.id !== process.env.GUILD_ID) : true)) return false
          return true
        }).map(s => "**" + s.name + "**: " + s.description).join("\n"))[0])
        .setTimestamp()
      return message.channel.send(embed)
    } else if (args[1] && (this.bot.commands.get(args[1].toLowerCase()) || this.bot.commands.find(c => c.aliases.includes(args[1].toLowerCase())))) {
      const command = this.bot.commands.get(args[1].toLowerCase()) || this.bot.commands.find(c => c.aliases.includes(args[1].toLowerCase()))
      if (!command) return message.channel.send('That command doesn\'t exist or isn\'t loaded.');
      if (command.dev || command.owner) return message.channel.send("Exclusive command for the owner or developers");
      let alias = "Without alias";
      if (command.aliases.length !== 0) {
        alias = command.aliases.join(", ");
      }
      const embed = new Discord.MessageEmbed()
        .setThumbnail("https://vignette.wikia.nocookie.net/wubbzy/images/7/7d/Gidget.png")
        .setTitle("Gidget help - " + args[1])
        .addField("Description", command.description ? command.description : "Without description")
        .addField("Required permissions", `User: \`${!(new Discord.Permissions(command.permissions.user[0]).has(8)) ? (new Discord.Permissions(command.permissions.user[0]).toArray().join(", ") || "None") : "ADMINISTRATOR"}\`\nBot: \`${!(new Discord.Permissions(command.permissions.bot[0]).has(8)) ? (new Discord.Permissions(command.permissions.bot[0]).toArray().join(", ") || "None") : "ADMINISTRATOR"}\``)
        .addField("Required permissions (channel)", `User: \`${!(new Discord.Permissions(command.permissions.user[1]).has(8)) ? (new Discord.Permissions(command.permissions.user[1]).toArray().join(", ") || "None") : "ADMINISTRATOR"}\`\nBot: \`${!(new Discord.Permissions(command.permissions.bot[1]).has(8)) ? (new Discord.Permissions(command.permissions.bot[1]).toArray().join(", ") || "None") : "ADMINISTRATOR"}\``)
        .addField("Environment", (command.guildonly || command.onlyguild) ? "Server" : "Server and DMs")
        .addField("Alias", alias)
        .setColor('#FFFFFF')
        .setFooter('Requested by: ' + message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();
      return message.channel.send(embed);
    } else {
      const embed = new Discord.MessageEmbed()
        .setThumbnail("https://vignette.wikia.nocookie.net/wubbzy/images/7/7d/Gidget.png")
        .setColor("#BDBDBD")
        .setTitle("Help command")
        .addField('Links', `[Bot's page (in progress)](https://gidget.xyz/) | [Source code](https://github.com/AndreMor955/gidget) | [AndreMor's page](https://wubbzy.gidget.xyz) | [Discord.js documentation](https://discord.js.org/#/docs/)`)
      let text = "Use `help <category>` to obtain the category's commands\n\n" + Discord.Util.splitMessage(arr.filter(s => {
        if (s.secret) return false
        if (s.onlyguild && (message.guild ? (message.guild.id !== process.env.GUILD_ID) : true)) return false
        return true
      }).map(s => "**" + s.catname + "**: " + s.cat).join("\n"))[0]
      embed.setDescription(text || "?");
      await message.channel.send(embed);
    }
  }
}