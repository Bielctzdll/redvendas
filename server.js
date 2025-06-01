const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para JSON e arquivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Headers para evitar cache
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    next();
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota produtos
app.get('/produtos', (req, res) => {
    res.sendFile(path.join(__dirname, 'produtos.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
