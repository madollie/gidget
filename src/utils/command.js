import Discord from 'discord.js';

export default class Command {
    constructor(opciones) {
        if(typeof opciones.name !== "string") throw new Error("opciones.name must be a string");
        if(typeof opciones.category !== "string") throw new Error("opciones.category must be a string");
        if(!(opciones.bot instanceof Discord.Client)) throw new Error("opciones.client must be an instance of <discord.js>.Client");
        this.name = opciones.name;
        this.category = opciones.category;
        this.bot = opciones.bot;
        this.aliases = [];
        this.description = "*Without description*";
        this.permissions = {
            user: [0, 0],
            bot: [0, 0]
        }
        this.owner = false;
        this.guildonly = false;
        this.onlyguild = false;
        this.dev = false;
        this.secret = false;
    }
    /**
     * Command code
     * @param {Discord.Message} message The Discord.js message object
     * @param {String[]} args The pre-converted args
     * @returns {Promise<void>} In most of the cases, void.
     */
    async run(message, args) {
        console.log(`${this.name} command was executed`);
        await message.channel.send(`${this.name} command was executed`);
    }
    delete() {
        this.client.commands.delete(this.name);
    }
}