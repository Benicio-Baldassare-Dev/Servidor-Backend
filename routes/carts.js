const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Ruta del archivo JSON para los carritos
const cartsFilePath = path.join(__dirname, '../carts.json');

// Función para leer los carritos del archivo
const readCarts = () => {
    const data = fs.readFileSync(cartsFilePath);
    return JSON.parse(data);
};

// Obtener los productos de un carrito por ID
router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cartId = parseInt(req.params.cid);
    const cart = carts.find(c => c.id === cartId);
    
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    
    res.json(cart.products);
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCarts();
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    
    const cart = carts.find(c => c.id === cartId);
    
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Buscar el producto en el carrito
    const existingProduct = cart.products.find(p => p.product === productId);

    if (existingProduct) {
        // Si el producto ya existe, incrementar la cantidad
        existingProduct.quantity += 1;
    } else {
        // Si no existe, agregar el nuevo producto
        const newProduct = { product: productId, quantity: 1 };
        cart.products.push(newProduct);
    }

    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2)); // Guardar cambios en el JSON
    res.status(200).json(cart.products);
});

module.exports = router;
