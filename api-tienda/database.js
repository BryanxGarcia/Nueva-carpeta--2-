const mysql = require('mysql2');


// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost', // Cambia esto si tu base de datos está en un host diferente
    user: 'root', // Reemplaza con tu usuario de MySQL
    password: 'root', // Reemplaza con tu contraseña de MySQL
    database: 'tienda', // Reemplaza con el nombre de tu base de datos
  }); 
  
  // Conecta a la base de datos
  connection.connect((error) => {
    if (error) {
      console.error('Error al conectar a la base de datos', error);
    } else {
      console.log('Conexión a la base de datos establecida correctamente');
    }
  });

  module.exports = connection;

  