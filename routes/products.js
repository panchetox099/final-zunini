const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Asegúrate de que esta ruta es correcta

/**
 * @route   GET /products
 * @desc    Obtener productos con filtros, paginación y ordenamiento
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        // Extraer parámetros de consulta
        const { limit = 10, page = 1, sort = 'asc', query = '', category, available } = req.query;

        // Validar parámetros
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);
        const sortOrder = sort === 'desc' ? -1 : 1;

        // Construir el filtro de búsqueda
        const filter = {};

        if (query) {
            filter.$text = { $search: query };
        }

        if (category) {
            filter.category = category;
        }

        if (available) {
            filter.available = available === 'true';
        }

        // Configurar opciones de paginación
        const options = {
            limit: parsedLimit,
            skip: (parsedPage - 1) * parsedLimit,
            sort: { price: sortOrder }
        };

        // Ejecutar la consulta
        const products = await Product.find(filter, null, options);
        const totalProducts = await Product.countDocuments(filter);

        // Calcular total de páginas y links
        const totalPages = Math.ceil(totalProducts / parsedLimit);
        const hasPrevPage = parsedPage > 1;
        const hasNextPage = parsedPage < totalPages;
        const prevPage = hasPrevPage ? parsedPage - 1 : null;
        const nextPage = hasNextPage ? parsedPage + 1 : null;
        const prevLink = hasPrevPage ? `/products?limit=${parsedLimit}&page=${prevPage}&sort=${sort}&query=${query}&category=${category}&available=${available}` : null;
        const nextLink = hasNextPage ? `/products?limit=${parsedLimit}&page=${nextPage}&sort=${sort}&query=${query}&category=${category}&available=${available}` : null;

        // Enviar respuesta
        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page: parsedPage,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
    }
});

module.exports = router;
