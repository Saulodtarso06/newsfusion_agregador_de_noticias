## Agregador de Notícias - NewsFusion

Um agregador de notícias com **Node.js + React + Elasticsearch**.   Permite listar notícias e realizar buscas full-text em tempo real.

* Crawler coleta notícias de várias fontes e envia para API REST.

* Elasticsearch: indexa por título, categoria, palavras-chave.

* React: frontend estilo “Google News” com pesquisa em tempo real.

* Extra: análise de trending topics usando agregações do Elasticsearch.

---
## Tecnologias do projeto

- **Backend:** Node.js + Express
- **Frontend:** React + Vite
- **Busca:** Elasticsearch
- **Infra:** Docker Compose

---
## Estrutura de Pastas

```lua
news-aggregator/
│── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── newsRoutes.js
│   │   ├── controllers/
│   │   │   └── newsController.js
│   │   ├── services/
│   │   │   └── elasticsearchService.js
│   │   ├── app.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
│
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   └── NewsList.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
│── docker-compose.yml
│── README.md

```
---

## Como rodar o projeto

### 1. Subir o Elasticsearch
```bash
docker-compose up -d
```
---

### 2. Rodar o Backend
```bash
cd backend

npm install

npm run dev
```
---
### 3. Rodar o Frontend
```bash
cd frontend

npm install

npm run dev
```
---
## Exemplos de rotas

* GET /api/news → lista notícias

* GET /api/news/search?q=politica → busca por palavra-chave

📌 Melhorias Futuras

Integração com APIs de notícias (GNews, NewsAPI)

Armazenar e indexar notícias reais no Elasticsearch

Painel com gráficos e estatísticas

👨‍💻 Desenvolvido por Saulo de Tarso