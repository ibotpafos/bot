//cart.js
const Product = require('./productModel');

class Cart {
  constructor({ items = [], totalQuantity = 0, totalPrice = 0 }) {
    this.items = items.map(i => ({
      product: new Product(i.product),
      quantity: i.quantity,
    }));
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  addItem(product, quantity = 1) {
    const existingItemIndex = this.items.findIndex(
      i => i.product._id.toString() === product._id.toString()
    );
    if (existingItemIndex !== -1) {
      this.items[existingItemIndex].quantity += quantity;
    } else {
      this.items.push({ product: new Product(product), quantity });
    }
    this.calculateTotals();
  }

  removeItem(productId, quantity = 1) {
    const existingItemIndex = this.items.findIndex(
      i => i.product._id.toString() === productId.toString()
    );
    if (existingItemIndex !== -1) {
      if (this.items[existingItemIndex].quantity > quantity) {
        this.items[existingItemIndex].quantity -= quantity;
      } else {
        this.items.splice(existingItemIndex, 1);
      }
    }
    this.calculateTotals();
  }

  removeAllItems() {
    this.items = [];
    this.totalPrice = 0;
    this.totalQuantity = 0;
  }

  displayItems() {
    return (
      this.items
        .map(
          i =>
            `${i.product.name} (${i.quantity} шт. x ${i.product.price} руб./шт.)`
        )
        .join('\n') +
      `\n\nИтого: ${this.totalQuantity} товаров на сумму ${this.totalPrice} руб.`
    );
  }

  calculateTotals() {
    this.totalQuantity = this.items.reduce(
      (accumulator, item) => accumulator + item.quantity,
      0
    );
    this.totalPrice = this.items.reduce(
      (accumulator, item) => accumulator + item.product.price * item.quantity,
      0
    );
  }
}

module.exports = Cart;
