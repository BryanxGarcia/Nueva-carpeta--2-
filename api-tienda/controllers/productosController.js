const connection = require('../database'); // Importa la conexión a la base de datos desde un archivo separado

// Controlador para obtener los producto
const obtenerProductos = (req, res) => {
  connection.query('SELECT * FROM producto', (error, results) => {
    if (error) {
      console.error('Error al obtener los producto', error);
      res.status(500).json({ error: 'Error al obtener los producto' });
    } else {
      res.json(results);
    }
  });
};

// Controlador para agregar un nuevo producto
const agregarProductos = (req, res) => {
  const producto = req.body;
  console.log(producto);
  console.log(producto);
  connection.query('INSERT INTO producto SET ?', producto, (error, results) => {
    if (error) {
      console.error('Error al agregar el producto', error);
      res.status(500).json({ error: 'Error al agregar el producto' });
    } else {
      res.json({ message: 'Producto agregado correctamente' });
    }
  });
};

// Controlador para eliminar un producto
const eliminarProductos = (req, res) => {
  const codigoproducto = req.params.codigo;
  connection.query('DELETE FROM producto WHERE codigo = ?', codigoproducto, (error, results) => {
    if (error) {
      console.error('Error al eliminar el producto', error);
      res.status(500).json({ error: 'Error al eliminar el producto' });
    } else {
      res.json({ message: 'Producto eliminado correctamente' });
    }
  });
};

// Controlador para actualizar un producto
const actualizarProductos = (req, res) => {
  const codigoProducto = req.params.codigo;
  const nuevoProducto = req.body;

  connection.query('UPDATE producto SET ? WHERE codigo = ?', [nuevoProducto, codigoProducto], (error, results) => {
    if (error) {
      console.error('Error al actualizar el producto', error);
      res.status(500).json({ error: 'Error al actualizar el producto' });
    } else {
      res.json({ message: 'Producto actualizado correctamente' });
    }
  });
};

module.exports = {
  obtenerProductos,
  agregarProductos,
  eliminarProductos,
  actualizarProductos,
};
