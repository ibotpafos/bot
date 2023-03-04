require('dotenv').config();
const { Telegraf, Markup, session } = require('telegraf');
const mongoose = require('mongoose');
const { mainMenuKeyboard, categoryKeyboard, helpmenuKeyboard, CartMenuKeyboard, profileKeyboard, editProfileKeyboard, } = require('./menu');

const { setupCatalog, initProducts } = require('./catalog');
const User  = require('./userModel');
const { createUser, updateTotalSpent, getTotalOrdersCount, getTotalSpent, getReferralCount } = require('./userController');
const { getCart, addItemToCart } = require('./cartModule');
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
    initProducts();
  } catch (error) {
    console.error(error);
  }
};

connectToDatabase();

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(session());

bot.command('start', async (ctx) => {
  try{
    const user = await createUser(ctx);
    const { firstName } = user;
  
    ctx.reply(`С возвращением, ${firstName}!`, mainMenuKeyboard);
  }
  catch (err) {
    console.error(err);
  }
});



const backToMainMenu = (ctx) => {
  ctx.reply('Выберите действие', mainMenuKeyboard);
};

bot.hears('Назад', (ctx) => {
  backToMainMenu(ctx);
});

bot.hears('👤 Профиль', async (ctx) => {
  try {
    const {id: telegramId, first_name: firstName} = ctx.from;

    const totalPurchases = await getTotalOrdersCount(telegramId);
    const purchaseAmount = await getTotalSpent(telegramId);
    const referralCount = await getReferralCount(telegramId);

    const discount = purchaseAmount >= 500 ? 10 : (purchaseAmount >= 100) ? 5 : 0;    

    const message = `Ваш профиль, ${firstName}:\nКоличество покупок: ${totalPurchases}\nОбщая сумма покупок: ${purchaseAmount} руб.\nКоличество приглашенных: ${referralCount}\nСкидка: ${discount}%`;
    
    ctx.reply(message, profileKeyboard);
  } catch (error) {
    console.error(error);
    ctx.reply('Упс! Что-то пошло не так. Пожалуйста, попробуйте еще раз позже.');
  }
});

bot.hears('🔧 Редактировать профиль', async (ctx) => {
  try {
    const { id: telegramId, first_name: firstName } = ctx.from;

    // Asking user what field they want to update
    await ctx.reply('Выберите поле для обновления', editProfileKeyboard);

    bot.on('callback_query', async (ctx) => {
      const { data } = ctx.callbackQuery;

      if (data === 'name') {
        // Ask user for new name
        await ctx.reply(`Введите свое имя`);

        bot.on('text', async (ctx) => {
          const newName = ctx.message.text;

          // Update the user's name
          await User.updateOne(
            { telegramId },
            { $set: { firstName: newName } }
          );

          // Notify the user that their profile has been updated
          await ctx.reply(`Ваш профиль был успешно обновлен, ${newName}!`, mainMenuKeyboard);

          // Remove these listeners since we only need them once
          bot.off('callback_query');
          bot.off('text');
        });
      } else if (data === 'phone') {
        // Ask user for new phone number
        await ctx.reply(`Введите свой номер телефона`);

        bot.on('text', async (ctx) => {
          const newPhone = ctx.message.text;

          // Update the user's phone number
          await User.updateOne(
            { telegramId },
            { $set: { phone: newPhone } }
          );

          // Notify the user that their profile has been updated
          await ctx.reply(`Ваш профиль был успешно обновлен, ${firstName}!`, mainMenuKeyboard);

          // Remove these listeners since we only need them once
          bot.off('callback_query');
          bot.off('text');
        });
      }
    });
  } catch (error) {
    console.error(error);
    ctx.reply('Упс! Что-то пошло не так. Пожалуйста, попробуйте еще раз позже.');
  }
});



bot.hears('📦 Каталог', async (ctx) => {
  try {
    await setupCatalog(bot);
    ctx.reply('Viewing catalog...', categoryKeyboard);  
  } catch (error) {
    console.error(error);
    ctx.reply('Error occurred while loading catalog.');
  }
});

bot.hears('🛒 Корзина', async (ctx) => {
  try {
    const telegramId = ctx.from.id;
    const user = await User.findOne({ telegramId });

    if (!user || !user.cart || user.cart.length === 0) {
      return ctx.reply(
        'Ваша корзина пуста!', CartMenuKeyboard);
    }

    const cart = new Cart(user.cart);

    await bot.telegram.sendMessage(
      ctx.chat.id,
      `Ваша корзина:\n\n${cart.displayItems()}`,
      Markup.inlineKeyboard([
        [Markup.button.callback('Очистить корзину', 'removeAllFromCart')],
        [Markup.button.callback('Перейти к оплате', 'goToCheckout')]
      ]).extra()
    );
  } catch (e) {
    console.error(e);
    ctx.reply('Ошибка при открытии корзины. Пожалуйста, попробуйте позже.');
  }
});


bot.hears('❓ Помощь',  (ctx) => {
  ctx.replyWithMarkdown(`This is the help section.`, helpmenuKeyboard);
});

bot.launch();
