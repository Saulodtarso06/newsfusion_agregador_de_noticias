
import React, { useState, useEffect, useCallback } from "react";
import { News } from "@/entities/News";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Filter, Layout, List } from "lucide-react";

import SearchBar from "../components/news/SearchBar";
import NewsCard from "../components/news/NewsCard";
import TrendingTopics from "../components/news/TrendingTopics";

export default function HomePage() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setIsLoading(true);
    try {
      const fetchedNews = await News.list("-created_date", 50);
      setNews(fetchedNews);
      setFilteredNews(fetchedNews);
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
    }
    setIsLoading(false);
  };

  const refreshNews = async () => {
    setIsRefreshing(true);
    await loadNews();
    setIsRefreshing(false);
  };

  const filterNews = useCallback((search, category, newsData) => {
    let filtered = newsData || news;

    if (search) {
      filtered = filtered.filter(article => 
        article.title?.toLowerCase().includes(search.toLowerCase()) ||
        article.summary?.toLowerCase().includes(search.toLowerCase()) ||
        article.content?.toLowerCase().includes(search.toLowerCase()) ||
        article.keywords?.some(keyword => keyword.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (category && category !== "all") {
      filtered = filtered.filter(article => article.category === category);
    }

    setFilteredNews(filtered);
  }, [news]); // 'news' is a dependency because it's accessed if newsData is not provided

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    filterNews(term, categoryFilter);
  }, [categoryFilter, filterNews]); // filterNews is now a dependency

  const handleCategoryFilter = useCallback((category) => {
    setCategoryFilter(category);
    filterNews(searchTerm, category);
  }, [searchTerm, filterNews]); // filterNews is now a dependency

  const handleNewsRead = async (newsItem) => {
    // Incrementar visualizações
    await News.update(newsItem.id, { 
      views: (newsItem.views || 0) + 1 
    });
    
    // Atualizar estado local
    const updatedNews = news.map(n => 
      n.id === newsItem.id ? { ...n, views: (n.views || 0) + 1 } : n
    );
    setNews(updatedNews);
    filterNews(searchTerm, categoryFilter, updatedNews); // Pass updatedNews to ensure filtering on current data
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-80 mb-8" />
          <Skeleton className="h-24 w-full mb-8 rounded-2xl" />
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6">
                    <Skeleton className="h-48 w-full mb-4 rounded-xl" />
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Últimas Notícias
            </h1>
            <p className="text-slate-600 text-lg">
              Mantenha-se atualizado com as principais notícias do mundo
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="flex items-center gap-2"
            >
              {viewMode === "grid" ? <List className="w-4 h-4" /> : <Layout className="w-4 h-4" />}
              {viewMode === "grid" ? "Lista" : "Grade"}
            </Button>
            <Button
              onClick={refreshNews}
              disabled={isRefreshing}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </motion.div>

        <SearchBar onSearch={handleSearch} onCategoryFilter={handleCategoryFilter} />

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {filteredNews.length === 0 ? (
              <Card className="p-12 text-center bg-white border-0 shadow-lg rounded-2xl">
                <CardContent>
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Filter className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    Nenhuma notícia encontrada
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Tente ajustar os filtros ou termos de busca para encontrar o que procura.
                  </p>
                  <Button onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                    // When clearing filters, use the original news array
                    setFilteredNews(news);
                  }}>
                    Limpar filtros
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <motion.div 
                layout
                className={
                  viewMode === "grid" 
                    ? "grid md:grid-cols-2 gap-6" 
                    : "space-y-4"
                }
              >
                <AnimatePresence>
                  {filteredNews.map((article) => (
                    <NewsCard
                      key={article.id}
                      news={article}
                      onRead={handleNewsRead}
                      variant={viewMode}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-1">
            <TrendingTopics news={news} />
          </div>
        </div>
      </div>
    </div>
  );
}
