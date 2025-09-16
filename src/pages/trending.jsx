import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, BarChart3, Hash, Eye, Calendar, ArrowUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function TrendingPage() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("keywords");

  useEffect(() => {
    loadNews();
  }, []);

  // Consome a API do backend para buscar notícias do Elasticsearch
  const loadNews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/search?q=trending");
      const fetchedNews = await response.json();
      setNews(fetchedNews.map(hit => hit._source));
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
    }
    setIsLoading(false);
  };

  const getTrendingKeywords = () => {
    const keywordCount = {};
    news.forEach(article => {
      article.keywords?.forEach(keyword => {
        if (!keywordCount[keyword]) {
          keywordCount[keyword] = {
            count: 0,
            articles: [],
            totalViews: 0
          };
        }
        keywordCount[keyword].count += 1;
        keywordCount[keyword].articles.push(article);
        keywordCount[keyword].totalViews += (article.views || 0);
      });
    });

    return Object.entries(keywordCount)
      .map(([keyword, data]) => ({
        keyword,
        count: data.count,
        avgViews: Math.round(data.totalViews / data.count),
        articles: data.articles.slice(0, 3),
        score: data.count * 2 + (data.totalViews / data.count)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  };

  const getCategoryTrends = () => {
    const categoryStats = {};
    news.forEach(article => {
      if (!categoryStats[article.category]) {
        categoryStats[article.category] = {
          count: 0,
          totalViews: 0,
          articles: []
        };
      }
      categoryStats[article.category].count += 1;
      categoryStats[article.category].totalViews += (article.views || 0);
      categoryStats[article.category].articles.push(article);
    });

    return Object.entries(categoryStats)
      .map(([category, data]) => ({
        category,
        count: data.count,
        totalViews: data.totalViews,
        avgViews: Math.round(data.totalViews / data.count),
        topArticle: data.articles.sort((a, b) => (b.views || 0) - (a.views || 0))[0]
      }))
      .sort((a, b) => b.totalViews - a.totalViews);
  };

  const getTopArticles = () => {
    return news
      .filter(article => article.views > 0)
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10);
  };

  const trendingKeywords = getTrendingKeywords();
  const categoryTrends = getCategoryTrends();
  const topArticles = getTopArticles();

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-80 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-32 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Análise de Tendências
          </h1>
          <p className="text-slate-600 text-lg">
            Descubra os tópicos mais populares e tendências do momento
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trending Keywords */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl rounded-2xl overflow-hidden h-fit">
              <CardHeader className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600">
                <CardTitle className="flex items-center gap-3 text-white">
                  <Hash className="w-6 h-6" />
                  Palavras-chave em Alta
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {trendingKeywords.slice(0, 10).map((item, index) => (
                    <motion.div
                      key={item.keyword}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${index < 3
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                              : index < 5
                                ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                                : 'bg-slate-400'
                            }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">#{item.keyword}</p>
                            <p className="text-xs text-slate-500">{item.count} artigos</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-green-600">
                            <ArrowUp className="w-3 h-3" />
                            <span className="text-xs font-semibold">{item.avgViews}</span>
                          </div>
                          <p className="text-xs text-slate-500">visualizações médias</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl rounded-2xl overflow-hidden h-fit">
              <CardHeader className="p-6 bg-gradient-to-r from-purple-500 to-pink-600">
                <CardTitle className="flex items-center gap-3 text-white">
                  <BarChart3 className="w-6 h-6" />
                  Categorias Populares
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {categoryTrends.map((item, index) => (
                    <motion.div
                      key={item.category}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="capitalize font-semibold text-sm">
                          {item.category}
                        </Badge>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{item.count}</p>
                          <p className="text-xs text-slate-500">artigos</p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.totalViews / Math.max(...categoryTrends.map(c => c.totalViews))) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>{item.totalViews} visualizações</span>
                        <span>~{item.avgViews}/artigo</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Articles */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl rounded-2xl overflow-hidden h-fit">
              <CardHeader className="p-6 bg-gradient-to-r from-green-500 to-emerald-600">
                <CardTitle className="flex items-center gap-3 text-white">
                  <TrendingUp className="w-6 h-6" />
                  Mais Visualizados
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {topArticles.map((article, index) => (
                    <motion.div
                      key={article.id || article._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${index < 3
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                            : 'bg-slate-400'
                          }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 mb-2">
                            {article.title}
                          </h4>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{article.source}</span>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span className="font-semibold">{article.views}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {article.category}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {format(new Date(article.created_date), "dd/MM", { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
setIsLoading(false);
const getTrendingKeywords = () => {
  const keywordCount = {};
  news.forEach(article => {
    article.keywords?.forEach(keyword => {
      if (!keywordCount[keyword]) {
        keywordCount[keyword] = {
          count: 0,
          articles: [],
          totalViews: 0
        };
      }
      keywordCount[keyword].count += 1;
      keywordCount[keyword].articles.push(article);
      keywordCount[keyword].totalViews += (article.views || 0);
    });
  });

  return Object.entries(keywordCount)
    .map(([keyword, data]) => ({
      keyword,
      count: data.count,
      avgViews: Math.round(data.totalViews / data.count),
      articles: data.articles.slice(0, 3),
      score: data.count * 2 + (data.totalViews / data.count)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
};

const getCategoryTrends = () => {
  const categoryStats = {};
  news.forEach(article => {
    if (!categoryStats[article.category]) {
      categoryStats[article.category] = {
        count: 0,
        totalViews: 0,
        articles: []
      };
    }
    categoryStats[article.category].count += 1;
    categoryStats[article.category].totalViews += (article.views || 0);
    categoryStats[article.category].articles.push(article);
  });

  return Object.entries(categoryStats)
    .map(([category, data]) => ({
      category,
      count: data.count,
      totalViews: data.totalViews,
      avgViews: Math.round(data.totalViews / data.count),
      topArticle: data.articles.sort((a, b) => (b.views || 0) - (a.views || 0))[0]
    }))
    .sort((a, b) => b.totalViews - a.totalViews);
};

const getTopArticles = () => {
  return news
    .filter(article => article.views > 0)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);
};

const trendingKeywords = getTrendingKeywords();
const categoryTrends = getCategoryTrends();
const topArticles = getTopArticles();

if (isLoading) {
  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-12 w-80 mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

return (
  <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Análise de Tendências
        </h1>
        <p className="text-slate-600 text-lg">
          Descubra os tópicos mais populares e tendências do momento
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Trending Keywords */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl rounded-2xl overflow-hidden h-fit">
            <CardHeader className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600">
              <CardTitle className="flex items-center gap-3 text-white">
                <Hash className="w-6 h-6" />
                Palavras-chave em Alta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {trendingKeywords.slice(0, 10).map((item, index) => (
                  <motion.div
                    key={item.keyword}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${index < 3
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                            : index < 5
                              ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                              : 'bg-slate-400'
                          }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">#{item.keyword}</p>
                          <p className="text-xs text-slate-500">{item.count} artigos</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600">
                          <ArrowUp className="w-3 h-3" />
                          <span className="text-xs font-semibold">{item.avgViews}</span>
                        </div>
                        <p className="text-xs text-slate-500">visualizações médias</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl rounded-2xl overflow-hidden h-fit">
            <CardHeader className="p-6 bg-gradient-to-r from-purple-500 to-pink-600">
              <CardTitle className="flex items-center gap-3 text-white">
                <BarChart3 className="w-6 h-6" />
                Categorias Populares
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {categoryTrends.map((item, index) => (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="capitalize font-semibold text-sm">
                        {item.category}
                      </Badge>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{item.count}</p>
                        <p className="text-xs text-slate-500">artigos</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.totalViews / Math.max(...categoryTrends.map(c => c.totalViews))) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>{item.totalViews} visualizações</span>
                      <span>~{item.avgViews}/artigo</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Articles */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl rounded-2xl overflow-hidden h-fit">
            <CardHeader className="p-6 bg-gradient-to-r from-green-500 to-emerald-600">
              <CardTitle className="flex items-center gap-3 text-white">
                <TrendingUp className="w-6 h-6" />
                Mais Visualizados
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${index < 3
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                          : 'bg-slate-400'
                        }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 mb-2">
                          {article.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{article.source}</span>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span className="font-semibold">{article.views}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {article.category}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {format(new Date(article.created_date), "dd/MM", { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  </div>
);
