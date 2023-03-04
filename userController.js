const mongoose = require('mongoose');
const User = require('./userModel');


async function createUser(ctx) {
  try {
    let user =  await User.findOne({ telegramId: ctx.from.id });
    if (!user) {
      user = await User.create({
        telegramId: ctx.from.id,
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
        languageCode: ctx.from.language_code,
        totalSpent: 0,
        totalOrders: 0,
        referralCount: 0,
        discountApplied: [],
        cart: []
      });
    }
    return user;
  } catch (err) {
    console.error(err);
  }
}


async function getTotalOrdersCount(userId) {
  try {
    const user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
    return user.totalOrders;
  } catch (err) {
    console.error(err);
  }
} 

async function getTotalSpent(userId) {
  try {
    const user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
    return user.totalSpent;
  } catch (err) {
    console.error(err);
  }
}

async function getReferralCount(userId) {
  try {
    const user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) });
    return user.referralCount;
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  createUser,
  getTotalOrdersCount,
  getTotalSpent,
  getReferralCount,
}
