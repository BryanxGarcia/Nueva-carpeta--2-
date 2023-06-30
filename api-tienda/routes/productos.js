const express = require('express');
const ProductController = require('../controllers/productosController');

const router = express.Router();

router.get("/", ProductController.obtenerProductos);
router.post("/", ProductController.agregarProductos);
router.put("/:codigo", ProductController.actualizarProductos);
router.delete("/:codigo", ProductController.eliminarProductos);


module.exports = router;