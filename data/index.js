const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.put('/:pid', (req, res) => {
    const pid = req.params.pid;
    const updateFields = req.body;

    console.log(`Actualizando producto con ID ${pid} con los siguientes campos:`, updateFields);

    res.send(`Producto con ID ${pid} actualizado`);
});

app.delete('/:pid', (req, res) => {
    const pid = req.params.pid;

    console.log(`Eliminando producto con ID ${pid}`);

    res.send(`Producto con ID ${pid} eliminado`);
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
