const connectDB = require('../config/db');
const { ObjectId } = require('mongodb');

// Obtener el carrito de un usuario específico
const getCartByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const db = await connectDB();
        const cart = await db.collection('carts').findOne({ userId: new ObjectId(userId) });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        res.json(cart);
    } catch (error) {
        console.error('Error getting cart:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Añadir un producto al carrito de un usuario específico
const addItemToCart = async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity, price } = req.body;
    if (!productId || quantity <= 0 || price <= 0) {
        return res.status(400).json({ error: 'Invalid productId, quantity, or price' });
    }
    try {
        const db = await connectDB();
        let cart = await db.collection('carts').findOne({ userId: new ObjectId(userId) });
        if (!cart) {
            await db.collection('carts').insertOne({
                userId: new ObjectId(userId),
                items: [{ productId: new ObjectId(productId), quantity, price }],
                totalPrice: quantity * price,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        } else {
            const existingItem = cart.items.find(item => item.productId.equals(new ObjectId(productId)));
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId: new ObjectId(productId), quantity, price });
            }
            cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
            cart.updatedAt = new Date();
            await db.collection('carts').updateOne({ userId: new ObjectId(userId) }, { $set: cart });
        }
        res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
        console.error('Error adding item to cart:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Actualizar la cantidad de un producto en el carrito
const updateItemQuantity = async (req, res) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    if (quantity < 0) {
        return res.status(400).json({ error: 'Quantity cannot be negative' });
    }
    try {
        const db = await connectDB();
        const cart = await db.collection('carts').findOne({ userId: new ObjectId(userId) });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        const item = cart.items.find(item => item.productId.equals(new ObjectId(productId)));
        if (!item) return res.status(404).json({ error: 'Item not found' });
        if (quantity === 0) {
            cart.items = cart.items.filter(item => !item.productId.equals(new ObjectId(productId)));
        } else {
            item.quantity = quantity;
        }
        cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
        cart.updatedAt = new Date();
        await db.collection('carts').updateOne({ userId: new ObjectId(userId) }, { $set: cart });
        res.json({ message: 'Item quantity updated' });
    } catch (error) {
        console.error('Error updating item quantity:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Eliminar un producto del carrito
const removeItemFromCart = async (req, res) => {
    const { userId, productId } = req.params;
    try {
        const db = await connectDB();
        const cart = await db.collection('carts').findOne({ userId: new ObjectId(userId) });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        const itemIndex = cart.items.findIndex(item => item.productId.equals(new ObjectId(productId)));
        if (itemIndex === -1) return res.status(404).json({ error: 'Item not found' });
        cart.items.splice(itemIndex, 1);
        cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
        cart.updatedAt = new Date();
        await db.collection('carts').updateOne({ userId: new ObjectId(userId) }, { $set: cart });
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing item from cart:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Nueva función para eliminar un producto específico del carrito
const removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const db = await connectDB();
        const cart = await db.collection('carts').findOne({ _id: new ObjectId(cid) });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        const itemIndex = cart.items.findIndex(item => item.productId.equals(new ObjectId(pid)));
        if (itemIndex === -1) return res.status(404).json({ error: 'Product not found in cart' });
        cart.items.splice(itemIndex, 1);
        cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
        cart.updatedAt = new Date();
        await db.collection('carts').updateOne({ _id: new ObjectId(cid) }, { $set: cart });
        res.json({ message: 'Product removed from cart' });
    } catch (error) {
        console.error('Error removing product from cart:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Nueva función para actualizar el carrito con un arreglo de productos
const updateCart = async (req, res) => {
    const { cid } = req.params;
    const { items } = req.body;
    try {
        const db = await connectDB();
        const cart = await db.collection('carts').findOne({ _id: new ObjectId(cid) });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        cart.items = items.map(item => ({
            productId: new ObjectId(item.productId),
            quantity: item.quantity,
            price: item.price
        }));
        cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
        cart.updatedAt = new Date();
        await db.collection('carts').updateOne({ _id: new ObjectId(cid) }, { $set: cart });
        res.json({ message: 'Cart updated' });
    } catch (error) {
        console.error('Error updating cart:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Nueva función para actualizar solo la cantidad de un producto en el carrito
const updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const db = await connectDB();
        const cart = await db.collection('carts').findOne({ _id: new ObjectId(cid) });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        const item = cart.items.find(item => item.productId.equals(new ObjectId(pid)));
        if (!item) return res.status(404).json({ error: 'Product not found in cart' });
        item.quantity = quantity;
        cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
        cart.updatedAt = new Date();
        await db.collection('carts').updateOne({ _id: new ObjectId(cid) }, { $set: cart });
        res.json({ message: 'Product quantity updated' });
    } catch (error) {
        console.error('Error updating product quantity:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Nueva función para eliminar todos los productos del carrito
const clearCart = async (req, res) => {
    const { cid } = req.params;
    try {
        const db = await connectDB();
        const cart = await db.collection('carts').findOne({ _id: new ObjectId(cid) });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
        cart.items = [];
        cart.totalPrice = 0;
        cart.updatedAt = new Date();
        await db.collection('carts').updateOne({ _id: new ObjectId(cid) }, { $set: cart });
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error('Error clearing cart:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getCartByUserId,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    removeProductFromCart,
    updateCart,
    updateProductQuantity,
    clearCart
};
