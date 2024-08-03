const connectDB = require('../config/db');

const getProducts = async (req, res) => {
  const { limit = 10, page = 1, sort = 'asc', query } = req.query;

  // Validar y parsear limit y page
  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);
  if (isNaN(parsedLimit) || parsedLimit <= 0) {
    return res.status(400).json({ error: 'Invalid limit parameter' });
  }
  if (isNaN(parsedPage) || parsedPage <= 0) {
    return res.status(400).json({ error: 'Invalid page parameter' });
  }

  // Configurar el filtro de búsqueda
  const db = await connectDB();
  const filter = {};

  if (query) {
    // Aplica filtros de búsqueda general, como búsqueda de texto
    filter.$text = { $search: query };
  }

  // Configurar el sort
  const sortOptions = {};
  if (sort === 'asc') {
    sortOptions.price = 1;
  } else if (sort === 'desc') {
    sortOptions.price = -1;
  }

  try {
    const products = await db.collection('products')
      .find(filter)
      .sort(sortOptions)
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .toArray();

    const totalProducts = await db.collection('products').countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parsedLimit);

    res.json({
      totalProducts,
      totalPages,
      currentPage: parsedPage,
      products
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getProducts,
  // Exporta otros métodos aquí
};
