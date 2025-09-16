# NewsFusion - Legado

Um agregador de notícias desenvolvido com Node.js + React + Elasticsearch. Permite listar notícias e realizar buscas full-text em tempo real.

* Crawler coleta notícias de várias fontes e envia para API REST.

* Elasticsearch: indexa por título, categoria, palavras-chave.

* React: frontend estilo “Google News” com pesquisa em tempo real.

* Análise de trending topics usando agregações do Elasticsearch.

---

## 📦 Estrutura do Projeto

```
NewsFusion
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── sidebar/
│   │   │       ├── Sidebar.js
│   │   │       ├── SidebarTrigger.js
│   │   │       ├── SidebarGroupContent.js
│   │   │       └── ... (outros componentes)
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Trending.jsx
│   │   ├── Collector.jsx
│   ├── utils/
│   │   └── createPageUrl.js
│   ├── index.js
│   └── styles.css

├── server.js
├── package.json + package-lock.json
└── README.md
```
---
## 🚀 Como rodar localmente

1. **Pré-requisitos**
   - Node.js 18+
   - npm

2. **Instale as dependências**
   ```
   npm install
   ```

3. **Build do frontend**
   ```
   npm run build
   ```

4. **Inicie o servidor**
   ```
   npm start
   ```
   > O app estará disponível em [http://localhost:3000](http://localhost:3000).

## 🛠️ Scripts disponíveis

- `npm run dev` — Inicia o servidor Express em modo desenvolvimento (com nodemon).
- `npm start` — Inicia o servidor Express.
- `npm run build` — Compila o frontend com Vite.
- `npm run preview` — Pré-visualiza o build do Vite.

## Principais funcionalidades

- Sidebar com navegação dinâmica
- Páginas de notícias, tendências e coleta
- Componentização e responsividade
- Backend Express para servir o frontend
---

## Estrutura dos componentes

Os componentes da sidebar estão em:
```
src/components/ui/sidebar/
```
---

## Tecnologias utilizadas

- React
- Node.js
- Express
- Vite
- JavaScript/TypeScript
- Elasticsearch

---

## Exemplos de rotas
* GET /api/news → lista notícias

* GET /api/news/search?q=politica → busca por palavra-chave

---

## 📌 Melhorias Futuras:

* Integração com APIs de notícias (GNews, NewsAPI).

* Armazenar e indexar notícias reais no Elasticsearch.

* Painel com gráficos e estatísticas.

---
## 📄 Licença

MIT

---
👨‍💻 Desenvolvido por Saulo de Tarso - fullstack developer.

Linkedin: https://www.linkedin.com/in/saulo-de-tarso-8a2b00133/

> Projeto desenvolvido para fins acadêmicos.