const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;


app.use(express.json());


const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
