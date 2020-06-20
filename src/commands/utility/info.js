const Discord = require('discord.js');
const { version } = require("../../index.js");
module.exports = {
    run: async (bot, message, args) => {
      
        if(args[1] === 'morse'){
            message.channel.send(`.. / .- -- / --. .. -.. --. . - --..-- / .- / .-. --- -... --- - / .... --- ... - . -.. / --- -. / --. .-.. .. - -.-. .... --..-- / -.-. .-. . .- - . -.. / -... -.-- / .-- .. -.. --. . - .-.-.- / .. / .... --- .--. . / - --- / -... . / ..- ... . ..-. ..- .-.. / ... --- -- . -.. .- -.-- -.-.--\n\n- .... . / .-- .- -.-- / .. / -.-. --- -- -- ..- -. .. -.-. .- - . / .-- .. - .... / - .... . / -.. .. ... -.-. --- .-. -.. / .- .--. .. / .. ... / .-- .-. .. - - . -. / .. -. / .--- .- ...- .- ... -.-. .-. .. .--. - / ..- ... .. -. --. / -.. .. ... -.-. --- .-. -.. .-.-.- .--- ... / ...- .---- ..--- .-.-.- .---- .-.-.- .---- --..-- / - .... .- -. -.- ... / - --- / .- -. -.. .-. . -- --- .-. / ..-. --- .-. / .-- .-. .. - .. -. --. / - .... . / -.-. --- -.. . .-.-.-\n\n.. / .... .- ...- . / -- -.-- / --- .-- -. / -.. .- - .- -... .- ... . / .... --- ... - . -.. / .. -. / -- --- -. --. --- -.. -... / .- - .-.. .- ... --..-- / .. / ..- ... . / -- --- -. --. --- --- ... . / - --- / .- -.-. -.-. . ... ... / .. - .-.-.-`);
        } else {
            message.channel.send('I am Gidget, a robot hosted on Heroku, created by Widget. I hope to be useful someday!\n\nThe way I communicate with the Discord API is written in JavaScript using Discord.js v' + Discord.version + ', thanks to AndreMor for writing the code.\n\nI have my own database hosted in MongoDB Atlas, I use Mongoose to access it.\n\nVersion ' + version);
        }
    },
    aliases: [],
    description: "Info about Gidget in plain text",
}