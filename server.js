import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "@elastic/elasticsearch";

const app = express();
const PORT = process.env.PORT || 3000;
const esClient = new Client({
  node: "http://localhost:9200", // ajuste para o endereço do seu Elasticsearch
});

// Resolve __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir arquivos estáticos da pasta 'dist' (gerada pelo Vite)
app.use(express.static(path.join(__dirname, "dist")));

// Rota para servir o index.html para qualquer rota (SPA)
app.get('all', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
