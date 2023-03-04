const { Telegraf, Markup } = require('telegraf');
const Product = require('./productModel');
const User = require('./userModel');
const initProducts = require('./initProducts');
const { getCategoryMenu } = require('./menu');



function setupCatalog(bot) {
  bot.hears('📦 Каталог', async (ctx) => {});

  bot.hears(['🍔 Burgers', '🌭 Hot Dogs', '🍟 Sides', '🥤 Drinks'], async (ctx) => {
    try {
      const products = await Product.find({ category: ctx.match });
      for (const product of products) showMessage(ctx, product);

    } catch (error) {
      console.error(error);
      ctx.reply('Oops! Something went wrong. Please try again later.');
    }
  });
  
  bot.action(/^buy_(\d+)$/, async (ctx) => {
    const productId = ctx.match[1];
    try {
      const product = await Product.findById(productId);
      if (!product) throw new Error(`Product with id ${productId} not found`);
          
      // Update the cart array with new item
      const cartItemIndex = user.cart.findIndex(({productId}) => String(productId) === String(product._id)); // check if product already in cart
      cartItemIndex >= 0 ? user.cart[cartItemIndex].quantity += 1 : 
                            user.cart.push({
                                  productId: product._id,
                                  name: product.name,
                                  price: product.price,
                                  quantity: 1
                                });

      // Save the user object back to the database
      await user.save();
      
      // Change the button text to "In Cart" and increment the cart count every time the button is pressed for the same product
      const cartItemCount = user.cart.reduce((sum, {quantity}) => sum + quantity, 0);
      ctx.editMessageReplyMarkup({
        inline_keyboard: [
          [
            {
              text: `In Cart (${cartItemCount})`,
              callback_data: `remove_${cartItemCount - 1}`,
            },
          ],
        ],
      });
      await ctx.answerCbQuery(`'${product.name}' added to cart`);
    } catch (error) {
      console.error(error);
      ctx.reply('Oops! Something went wrong. Please try again later.');
    }
  });

  function showMessage(ctx, product){
    let message = `<b>${product.name} (${product.price} руб.)</b>\n\n`;
    if (product.description)
      message += `<b>Описание:</b> ${product.description}\n\n`;

    ctx.replyWithPhoto(product.photoUrl, {
          caption: message,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `Купить за ${product.price} руб.`, 
                  callback_data: `buy_${product.id}`
                }
              ]
            ] 
          }   
        });
  }

}

module.exports = { setupCatalog, initProducts };
