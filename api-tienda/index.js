const express = require('express');
const cors = require('cors');
const fabricantesRoutes = require('./routes/fabricantes'); // Importa las rutas de los fabricantes desde un archivo separado
const productosRoutes = require('./routes/productos');
const app = express();

// Configura el middleware cors
app.use(cors());

// Middleware para analizar el cuerpo de las solicitudes como JSON
app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

// Rutas de los fabricantes
app.use('/fabricantes', fabricantesRoutes);
app.use('/productos', productosRoutes);

// Configuración del puerto
const port = 3001; // Puedes cambiar el puerto si es necesario

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor API en ejecución en http://localhost:${port}`);
});
