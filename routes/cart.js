const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/carts/:userId', cartController.getCartByUserId);

router.post('/carts/:userId/items', cartController.addItemToCart);

router.put('/carts/:userId/items/:productId', cartController.updateItemQuantity);

router.delete('/carts/:userId/items/:productId', cartController.removeItemFromCart);

router.delete('/carts/:cid/products/:pid', cartController.removeProductFromCart);

router.put('/carts/:cid', cartController.updateCart);

router.put('/carts/:cid/products/:pid', cartController.updateProductQuantity);

router.delete('/carts/:cid', cartController.clearCart);


module.exports = router;
