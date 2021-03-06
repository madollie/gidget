const constants = [[302.7, 420], [305.2, 325.3], [385.5, 325.3], [378, 420.8]];
import commons from '../../utils/commons.js'
const { __dirname } = commons(import.meta.url);
import path from 'path';
import Canvas from 'canvas';
import { MessageAttachment, User } from 'discord.js';
import Command from '../../utils/command.js';
let sprite;

export default class extends Command {
    constructor(options) {
        super(options);
        this.description = "The Wubphone :)";
    }
    async run(message, args) {
        if (!sprite) sprite = await Canvas.loadImage(path.join(__dirname + "/../../utils/wubphone.png"));
        const mentions = message.mentions.users.first(4);
        const source1 = mentions[0] || this.bot.users.cache.get(args[1]) || await this.bot.users.fetch(args[1]).catch(err => { }) || message.author;
        const source2 = mentions[1] || this.bot.users.cache.get(args[2]) || await this.bot.users.fetch(args[2]).catch(err => { });
        const source3 = mentions[2] || this.bot.users.cache.get(args[3]) || await this.bot.users.fetch(args[3]).catch(err => { });
        const source4 = mentions[3] || this.bot.users.cache.get(args[4]) || await this.bot.users.fetch(args[4]).catch(err => { });
        const sources = [source1, source2, source3, source4];
        const realsources = [];
        for (let i in sources) {
            if (sources[i] && sources[i] instanceof User) {
                realsources[i] = sources[i].displayAvatarURL({ size: 64, format: "png" });
            }
        }
        const canvasimages = [];
        for (let i in realsources) {
            canvasimages[i] = await Canvas.loadImage(realsources[i]);
        }
        const canvas = Canvas.createCanvas(1280, 720);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(sprite, 0, 0)
        for (let i in canvasimages) {
            if (parseInt(i) > 3) break;
            if (i == 0) ctx.setTransform(1.4, 0, 0.465, 1, 0, 0);
            if (i == 2) ctx.setTransform(1.4, 0, 0.53, 1, 0, 0);
            ctx.drawImage(canvasimages[i], constants[i][0], constants[i][1], 62, 57.6)
        }
        const att = new MessageAttachment(canvas.toBuffer(), "algo.png");
        await message.channel.send((realsources.length <= 1 ? "Usage: `wubphone [user1] [user2] [user3] [user4]`" : ""), att);
    }
}