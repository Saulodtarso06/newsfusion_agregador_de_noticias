import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Eye, ExternalLink, Share2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const categoryColors = {
  tecnologia: "bg-blue-50 text-blue-700 border-blue-200",
  politica: "bg-red-50 text-red-700 border-red-200",
  economia: "bg-green-50 text-green-700 border-green-200",
  esportes: "bg-orange-50 text-orange-700 border-orange-200",
  saude: "bg-emerald-50 text-emerald-700 border-emerald-200",
  entretenimento: "bg-pink-50 text-pink-700 border-pink-200",
  ciencia: "bg-purple-50 text-purple-700 border-purple-200",
  mundial: "bg-indigo-50 text-indigo-700 border-indigo-200",
  nacional: "bg-yellow-50 text-yellow-700 border-yellow-200",
  outros: "bg-gray-50 text-gray-700 border-gray-200"
};

export default function NewsCard({ news, onRead, variant = "default" }) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: news.title,
        text: news.summary,
        url: news.original_url || window.location.href
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Card className="overflow-hidden border-0 bg-white hover:shadow-xl transition-all duration-500 rounded-2xl">
        {news.image_url && (
          <div className="relative overflow-hidden">
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <Badge 
              className={`absolute top-4 left-4 ${categoryColors[news.category]} border font-medium shadow-sm`}
            >
              {news.category?.charAt(0).toUpperCase() + news.category?.slice(1)}
            </Badge>
            {news.trending_score > 50 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                TRENDING
              </div>
            )}
          </div>
        )}
        
        <CardHeader className="p-6 pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                {news.title}
              </h3>
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                <span className="font-medium text-slate-600">{news.source}</span>
                {news.author && (
                  <span>por {news.author}</span>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{news.reading_time || 3} min</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 pt-0">
          <p className="text-slate-600 leading-relaxed mb-4 line-clamp-3">
            {news.summary}
          </p>
          
          {news.keywords && news.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {news.keywords.slice(0, 3).map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>
                {news.published_date 
                  ? format(new Date(news.published_date), "d 'de' MMMM", { locale: ptBR })
                  : format(new Date(news.created_date), "d 'de' MMMM", { locale: ptBR })
                }
              </span>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{news.views || 0}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="hover:bg-slate-100 transition-colors duration-200"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              {news.original_url && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hover:bg-slate-100 transition-colors duration-200"
                >
                  <a href={news.original_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
              <Button
                onClick={() => onRead(news)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Ler mais
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}