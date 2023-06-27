const express = require('express');
const fabricantesController = require('../controllers/fabricantesController');

const router = express.Router();

// Rutas para los fabricantes
router.get('/', fabricantesController.obtenerFabricantes);
router.post('/', fabricantesController.agregarFabricante);
router.delete('/eliminar/:codigo', fabricantesController.eliminarFabricante);
router.put('/actualizar/:codigo', fabricantesController.actualizarFabricante);

module.exports = router;
