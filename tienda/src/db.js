const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario_mysql',
  password: 'tu_contraseña_mysql',
  database: 'tienda',
});

connection.connect((error) => {
  if (error) throw error;
  console.log('Conexión exitosa a la base de datos.');
});

module.exports = connection;
