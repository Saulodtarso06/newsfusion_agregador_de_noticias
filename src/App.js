import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/layout";
import Home from "./pages/home";
import Trending from "./pages/trending";
import Collector from "./pages/collector";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/trending" element={<Trending />} />
                    <Route path="/collector" element={<Collector />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;

app.get("/api/search", async (req, res) => {
    const { q } = req.query;
    try {
        const result = await esClient.search({
            index: "news",
            query: {
                multi_match: {
                    query: q,
                    fields: ["title", "summary", "content", "keywords"]
                }
            }
        });
        res.json(result.hits.hits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/news", async (req, res) => {
    const news = req.body;
    try {
        const result = await esClient.index({
            index: "news",
            document: news
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});