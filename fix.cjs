const fs = require('fs');
let code = fs.readFileSync('src/data/products.js', 'utf8');
code = code.replace(/priceMin:\s*(\d+),\s*priceMax:\s*\d+,/g, 'price: $1,');
code = code.replace(/originalPriceMin:\s*(\d+),\s*originalPriceMax:\s*\d+,/g, 'originalPrice: $1,');
code = code.replace(/export function formatPrice[\s\S]*?\}[\n\r]*export function getProduct/, "export function formatPrice(price) {\n  const currency = new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' });\n  return currency.format(price);\n}\n\nexport function getProduct");
fs.writeFileSync('src/data/products.js', code);
