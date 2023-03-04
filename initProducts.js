const Product = require('./productModel');

const initProducts = async () => {
    try {
        const productsToAdd = [
            { name: 'Burger', price: 10.99, category: '🍔 Burgers', description: 'тут будет описание', photoUrl: 'https://img.freepik.com/premium-vector/photo-frame-icon-empty-photo-blank-vector-on-isolated-transparent-background-eps-10_399089-1290.jpg?w=826' },
            { name: 'Cheese Burger', price: 12.49, category: '🍔 Burgers', description: 'тут будет описание', photoUrl: 'https://img.freepik.com/premium-vector/photo-frame-icon-empty-photo-blank-vector-on-isolated-transparent-background-eps-10_399089-1290.jpg?w=826' },
            { name: 'Chicken Burger', price: 11.99, category: '🍔 Burgers', description: 'тут будет описание', photoUrl: 'https://img.freepik.com/premium-vector/photo-frame-icon-empty-photo-blank-vector-on-isolated-transparent-background-eps-10_399089-1290.jpg?w=826' },
            { name: 'Hot Dog', price: 8.49, category: '🌭 Hot Dogs', description: 'тут будет описание', photoUrl: 'https://img.freepik.com/premium-vector/photo-frame-icon-empty-photo-blank-vector-on-isolated-transparent-background-eps-10_399089-1290.jpg?w=826' },
            { name: 'Chili Hot Dog', price: 9.99, category: '🌭 Hot Dogs', description: 'тут будет описание', photoUrl: 'https://img.freepik.com/premium-vector/photo-frame-icon-empty-photo-blank-vector-on-isolated-transparent-background-eps-10_399089-1290.jpg?w=826' },
            { name: 'French Fries', price: 4.99, category: '🍟 Sides', description: 'тут будет описание', photoUrl: 'https://img.freepik.com/premium-vector/photo-frame-icon-empty-photo-blank-vector-on-isolated-transparent-background-eps-10_399089-1290.jpg?w=826' },
            { name: 'Onion Rings', price: 5.49, category: '🍟 Sides', description: 'тут будет описание', photoUrl: 'https://img.freepik.com/premium-vector/photo-frame-icon-empty-photo-blank-vector-on-isolated-transparent-background-eps-10_399089-1290.jpg?w=826' },
            { name: 'Coca Cola', price: 1.99, category: '🥤 Drinks', description: 'тут будет описание', photoUrl: 'https://img.freepik.com/premium-vector/photo-frame-icon-empty-photo-blank-vector-on-isolated-transparent-background-eps-10_399089-1290.jpg?w=826' },
            { name: 'Pepsi', price: 1.99, category: '🥤 Drinks', description: 'тут будет описание', photoUrl: 'https://img.freepik.com/premium-vector/photo-frame-icon-empty-photo-blank-vector-on-isolated-transparent-background-eps-10_399089-1290.jpg?w=826' }
        ];

        await Promise.all(productsToAdd.map(async productObj => {
            const productExists = await Product.exists({ name: productObj.name });
            if (!productExists) {
                const newProduct = new Product(productObj);
                await newProduct.save();
            }
        }));
    } catch (err) {
        console.error(err);
    }
};

module.exports = initProducts;
