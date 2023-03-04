// discountController.js
const User = require('./userModel');
const Discount = require('./discountModel');

/* ... */

exports.applyDiscount = async (ctx) => {
  const { userId, discountCode } = ctx.session;

  try {
      // Получить ссылку на скидку по коду 
      const discount = await Discount.findOne({ code: discountCode });

      if (!discount) {
          throw new Error(`Discount ${discountCode} not found`);
      }

      // Обновить список ссылок на используемые пользователем скидки
      await User.updateOne({_id: userId}, {$push: {discountsApplied: discount._id}});

      // Применить скидку к текущему заказу ...
  } catch (err) {
      console.error(err);
  }
};
