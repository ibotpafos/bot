// category.js

const { Markup } = require('telegraf');
const Product = require('./productModel');

// задаем наши категории и соответствующие им теги товаров
const categories = {
  fruit: ['apple', 'banana', 'orange'],
  vegetable: ['carrot', 'broccoli', 'cucumber'],
  dairy: ['milk', 'cheese', 'yogurt']
};

// генерируем текст сообщения для каждой категории
const categoryMsg = Object.keys(categories).map(category => {
  const productsInCategory = categories[category].map(async productName => {
    const product = await Product.findOne({ name: productName });
    return `${productName} - $${product.price.toFixed(2)}`;
  });

  return `*${category.toUpperCase()}*\n${productsInCategory.join('\n')}\n\n`;
}).join('');

exports.setupCategories = bot => {
  bot.command('categories', async ctx => {
    try {
      ctx.replyWithMarkdown(
        `Here are our available categories:\n\n` +
        `${categoryMsg}` +
        `[See all products](/products)`,
        Markup.keyboard(Object.keys(categories)).resize(true).extra()
      );
    } catch (err) {
      console.error(err);
      ctx.reply('Oops! Something went wrong while retrieving the product categories. Try again later.');
    }
  });

  bot.hears(Object.keys(categories), async ctx => {
    try {
      const categoryName = ctx.message.text;
      const productList = categories[categoryName].map(async productName => {
        const product = await Product.findOne({ name: productName });
        return Markup.callbackButton(`${productName} - $${product.price.toFixed(2)}`, `add_${product._id}`);
      });

      ctx.replyWithMarkdown(`${categoryName.toUpperCase()}:`, 
        Markup.inlineKeyboard(productList.map(button => [button])).extra()
      );
    } catch (err) {
      console.error(err);
      ctx.reply('Oops! Something went wrong while retrieving the products in this category. Try again later.');
    }
  });

  bot.action(/\/add_(\w+)/, async ctx => {
    try {
      const [_, productId] = ctx.match;
      const user = await User.findOne({ telegramId: ctx.from.id });
      user.cart.push(productId);
      await user.save();
      ctx.answerCbQuery(`"${product.name}" added to your cart.`);
    } catch (err) {
      console.error(err);
      ctx.reply('Oops! Something went wrong while adding the item to your cart. Try again later.');
    }
  });
};
