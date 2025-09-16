import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Hash, BarChart3 } from "lucide-react";

export default function TrendingTopics({ news }) {
  const getTrendingKeywords = () => {
    const keywordCount = {};
    news.forEach(article => {
      article.keywords?.forEach(keyword => {
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      });
    });
    
    return Object.entries(keywordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([keyword, count], index) => ({ keyword, count, rank: index + 1 }));
  };

  const getCategoryStats = () => {
    const categoryCount = {};
    news.forEach(article => {
      categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
    });
    
    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
  };

  const trendingKeywords = getTrendingKeywords();
  const categoryStats = getCategoryStats();

  return (
    <div className="space-y-6">
      {/* Trending Keywords */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {trendingKeywords.map((item, index) => (
              <motion.div
                key={item.keyword}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    item.rank <= 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-slate-400'
                  }`}>
                    {item.rank}
                  </div>
                  <Hash className="w-3 h-3 text-blue-500" />
                </div>
                <p className="font-semibold text-slate-900 text-sm truncate">{item.keyword}</p>
                <p className="text-xs text-slate-500">{item.count} menções</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg rounded-2xl">
        <CardHeader className="p-6 pb-3">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-900">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Distribuição por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-3">
            {categoryStats.map((item, index) => {
              const percentage = Math.round((item.count / news.length) * 100);
              return (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="capitalize font-medium">
                      {item.category}
                    </Badge>
                    <span className="text-sm font-bold text-slate-700">{item.count} artigos</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{percentage}% do total</p>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}