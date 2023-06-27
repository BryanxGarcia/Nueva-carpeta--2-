const express = require('express');
const ProductController = require('../controllers/productosController');

const router = express.Router();

router.get("/", ProductController.obtenerProductos);
router.post("/", ProductController.agregarProductos);
router.put("/actualizar/:codigo", ProductController.actualizarProductos);
router.delete("/eliminar/:codigo", ProductController.eliminarProductos);


module.exports = router;