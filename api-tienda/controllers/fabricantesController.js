const connection = require('../database'); // Importa la conexión a la base de datos desde un archivo separado

// Controlador para obtener los fabricantes
const obtenerFabricantes = (req, res) => {
  connection.query('SELECT * FROM fabricante', (error, results) => {
    if (error) {
      console.error('Error al obtener los fabricantes', error);
      res.status(500).json({ error: 'Error al obtener los fabricantes' });
    } else {
      res.json(results);
    }
  });
};

// Controlador para agregar un nuevo fabricante
const agregarFabricante = (req, res) => {
  const fabricante = req.body;
  connection.query('INSERT INTO fabricante SET ?', fabricante, (error, results) => {
    if (error) {
      console.error('Error al agregar el fabricante', error);
      res.status(500).json({ error: 'Error al agregar el fabricante' });
    } else {
      res.json({ message: 'Fabricante agregado correctamente' });
    }
  });
};

// Controlador para eliminar un fabricante
const eliminarFabricante = (req, res) => {
  const codigoFabricante = req.params.codigo;
  connection.query('DELETE FROM fabricante WHERE codigo = ?', codigoFabricante, (error, results) => {
    if (error) {
      console.error('Error al eliminar el fabricante', error);
      res.status(500).json({ error: 'Error al eliminar el fabricante' });
    } else {
      console.error('Eliminado correctamente');
      res.json({ message: 'Fabricante eliminado correctamente' });
    }
  });
}; 

// Controlador para actualizar un fabricante
const actualizarFabricante = (req, res) => {
  const codigoFabricante = req.params.codigo;
  const nuevoFabricante = req.body;

  connection.query('UPDATE fabricante SET ? WHERE codigo = ?', [nuevoFabricante, codigoFabricante], (error, results) => {
    if (error) {
      console.error('Error al actualizar el fabricante', error);
      res.status(500).json({ error: 'Error al actualizar el fabricante' });
    } else {
      res.json({ message: 'Fabricante actualizado correctamente' });
    }
  });
};

module.exports = {
  obtenerFabricantes,
  agregarFabricante,
  eliminarFabricante,
  actualizarFabricante,
};
