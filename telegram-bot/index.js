const axios = require('axios');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.telegram_bot_api_key);
console.log("bot started");

bot.start((ctx) => ctx.reply(`Hello ${ctx.chat.first_name} \n\nI am a bot with the power of ChatGPT.`));

// help method
bot.command('help', (ctx) => {
    ctx.reply('Ask literally anything that you want to know!');
});

// bot hears any message
bot.on('message', async (ctx) => {
    const question = ctx.message.text;
    if (question === "/start") {
        return;
    }
    else if (question === "/help") {
        return;
    }
    const msgObj = {
        "prompt": question,
    }
    await axios.post("https://ai-chatbot-backend-vbtjd5yyqq-uc.a.run.app/application/ask", msgObj).then(
        (res) => {
            console.log(res.data);
            if (res.data.image_requested) {
                ctx.replyWithPhoto(res.data.image_link);
            }
            else {
                ctx.reply(res.data);
            }
        }
    )
});
// Launch the bot
// bot.launch({
//     webhook: {
//       // Public domain for webhook; e.g.: example.com
//       domain: 'https://telegramgptchatbot.000webhostapp.com/',
  
//       // Port to listen on; e.g.: 8080
//       port: 3000,
  
//       // Optional path to listen for.
//       // `bot.secretPathComponent()` will be used by default
//       //   hookPath: webhookPath,
  
//       // Optional secret to be sent back in a header for security.
//       // e.g.: `crypto.randomBytes(64).toString("hex")`
//     //   secretToken: randomAlphaNumericString,
//     },
//   });  
    bot.launch();

