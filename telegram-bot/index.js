const axios = require('axios');
const { Telegraf } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_API_KEY);
// set telegram webhook
// bot.telegram.setWebhook('https://asia-south1-dotted-axle-382514.cloudfunctions.net/telegramBot').then(() => {
//     console.log("webhook set");
// }).catch((err) => {
//     console.log(err);
// });
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
    await axios.post("https://ai-chatbot-backend-vbtjd5yyqq-el.a.run.app/application/ask", msgObj).then(
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
exports.botHandler = async (req, res) => {
    try {
      await bot.handleUpdate(req.body);
      res.status(200).send('OK');
    } catch (error) {
      console.error(error);
      res.status(400).send('Error');
    }
  };
  