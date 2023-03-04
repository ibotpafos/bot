const Cart = require('./cart');
const User = require('./userModel');

async function getCart(telegramId) {
  const user = await User.findOne({ telegramId });
  if (!user) return null;

  return user.getCart();
}

async function updateCart(telegramId, cart) {
  const user = await User.findOne({ telegramId });
  if (!user) return false;

  user.setCart(cart);
  await user.save();

  return true;
}

async function addItemToCart(telegramId, product, quantity) {
  let cart = await getCart(telegramId);

  if (cart) {
    cart.addItem(product, quantity);
  } else {
    const items = [{ product, quantity }];
    cart = new Cart({ items });
  }

  return await updateCart(telegramId, cart);
}

async function removeItemFromCart(telegramId, productId, quantity) {
  const cart = await getCart(telegramId);
  if (!cart) return false;

  cart.removeItem(productId, quantity);
  return await updateCart(telegramId, cart);
}

async function removeAllItemsFromCart(telegramId) {
  const cart = await getCart(telegramId);
  if (!cart) return false;

  cart.removeAllItems();
  return await updateCart(telegramId, cart);
}

module.exports = {
  getCart,
  addItemToCart,
  removeItemFromCart,
  removeAllItemsFromCart,
};
