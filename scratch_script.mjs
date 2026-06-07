import fs from 'fs';

fetch('http://localhost:3001/api/products')
  .then(r => r.json())
  .then(d => {
    fs.writeFileSync('products_dump.json', JSON.stringify(d.products, null, 2));
    console.log('Saved to products_dump.json');
  });
