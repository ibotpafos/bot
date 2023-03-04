//menu.js
const { Markup } = require('telegraf');

exports.mainMenuKeyboard = Markup.keyboard([
  [{ text: '👤 Профиль', callback_data: 'goToProfile' }, { text: '📦 Каталог' }],
  [{ text: '🛒 Корзина' }, { text: '❓ Помощь' }]
]).resize();

exports.categoryKeyboard = Markup.keyboard([
  [{ text: '🍔 Burgers' }, { text: '🌭 Hot Dogs' }],
  [{ text: '🍟 Sides' }, { text: '🥤 Drinks' }],
  [{ text: 'Назад' }]
]).resize();

exports.helpmenuKeyboard = Markup.keyboard([
  [{ text: 'FAQ', callback_data: 'faq' }],
  [{ text: 'Связь с менеджером', callback_data: 'contact_manager' }],
  [{ text: 'Назад' }]
]).resize();

exports.getCategoryMenu = Markup.keyboard([ 
  ['🍔 Бургеры', '🌭 Хот-доги'],
  ['🍟 Гарниры', '🥤 Напитки'],
  ['📦 Каталог'],
]).resize();

exports.CartMenuKeyboard = Markup.keyboard([
  [{ text: '📦 Каталог' }],
  [{ text: 'Назад' }]
]).resize();

exports. profileKeyboard = Markup.keyboard([
  [{ text: '🔧 Редактировать профиль', callback_data: 'editProfile' }],
  [{ text: 'История заказов', callback_data: 'history' }],
  [{ text: 'Назад' }]
]).resize();

exports.editProfileKeyboard = Markup.keyboard([
  [{ text: 'Изменить имя', callback_data: 'changeName' }], 
  [{ text:'Изменить номер телефона', callback_data: 'changePhone' }],
  [{ text: 'Изменить адрес', callback_data: 'changeAddress' }],
  [{ text: 'Назад' }]
]).resize();
