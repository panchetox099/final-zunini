const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const app = express();

// Rutas
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

// Configuración de Handlebars
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear JSON y datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de la API
app.use('/api/products', productRoutes); // Endpoint para productos
app.use('/api/carts', cartRoutes);       // Endpoint para carritos

// Ruta principal para la vista de productos
app.get('/', (req, res) => {
    res.redirect('/products');
});

// Ruta para la vista de productos con paginación
app.get('/products', (req, res) => {
    res.render('index'); // Renderiza la vista de productos
});

// Ruta para ver detalles del producto
app.get('/products/:pid', (req, res) => {
    res.render('product-detail'); // Renderiza los detalles del producto
});

// Ruta para ver detalles del carrito
app.get('/carts/:cid', (req, res) => {
    res.render('cart-detail'); // Renderiza los detalles del carrito
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
