import Command from "../../utils/command.js";

export default class extends Command {
  constructor(options) {
    super(options);
    this.description = "Loops the song";
    this.guildonly = true;
  }
  async run(message, args) {
    const serverQueue = message.guild.queue
    const musicVariables = message.guild.musicVariables;
    if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to loop the music!");
    if (musicVariables && musicVariables.other) {
      if (!musicVariables.loop) {
        musicVariables.loop = true;
        return message.channel.send("🔁 The song repeat has been enabled.");
      } else {
        musicVariables.loop = false;
        return message.channel.send("🔁 The song repeat has been disabled.");
      }
    }
    if (!serverQueue || !musicVariables) return message.channel.send("There is nothing playing.");
    if (serverQueue.voiceChannel.id !== message.member.voice.channel.id)
      return message.channel.send("I'm on another voice channel!");

    if (!serverQueue.loop) {
      serverQueue.loop = true;
      return message.channel.send("🔁 The song repeat has been enabled.");
    } else {
      serverQueue.loop = false;
      return message.channel.send("🔁 The song repeat has been disabled.");
    }
  }
}