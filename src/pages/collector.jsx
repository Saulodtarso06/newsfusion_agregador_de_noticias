import React, { useState } from "react";
import { News } from "@/entities/News";
import { InvokeLLM } from "@/integrations/Core";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Globe, 
  Search, 
  Plus, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Newspaper,
  Brain,
  Zap
} from "lucide-react";

const categories = [
  "tecnologia", "politica", "economia", "esportes", 
  "saude", "entretenimento", "ciencia", "mundial", "nacional", "outros"
];

export default function CollectorPage() {
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectionResults, setCollectionResults] = useState([]);
  const [searchTopic, setSearchTopic] = useState("");
  const [manualNews, setManualNews] = useState({
    title: "",
    summary: "",
    content: "",
    source: "",
    author: "",
    category: "",
    keywords: [],
    image_url: "",
    original_url: ""
  });
  const [newKeyword, setNewKeyword] = useState("");

  const handleAutomaticCollection = async () => {
    if (!searchTopic.trim()) return;
    
    setIsCollecting(true);
    setCollectionResults([]);
    
    try {
      const prompt = `
        Colete 5 notícias recentes e relevantes sobre: "${searchTopic}"
        
        Para cada notícia, forneça:
        - Título atrativo e informativo
        - Resumo de 2-3 frases
        - Conteúdo completo (pelo menos 3 parágrafos)
        - Fonte confiável
        - Autor (se disponível)
        - Categoria mais apropriada
        - 3-5 palavras-chave relevantes
        - URL de imagem relacionada (use URLs do Unsplash)
        - Tempo estimado de leitura
        
        Certifique-se de que as notícias sejam atuais, relevantes e de fontes confiáveis.
        Varie as fontes e ângulos de cobertura.
      `;

      const result = await InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            articles: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  summary: { type: "string" },
                  content: { type: "string" },
                  source: { type: "string" },
                  author: { type: "string" },
                  category: { 
                    type: "string",
                    enum: categories
                  },
                  keywords: {
                    type: "array",
                    items: { type: "string" }
                  },
                  image_url: { type: "string" },
                  reading_time: { type: "number" },
                  published_date: { type: "string" }
                }
              }
            }
          }
        }
      });

      if (result.articles && result.articles.length > 0) {
        // Salvar todas as notícias coletadas
        const savedArticles = [];
        for (const article of result.articles) {
          try {
            const savedArticle = await News.create({
              ...article,
              original_url: `https://example.com/news/${article.title.replace(/\s+/g, '-').toLowerCase()}`,
              trending_score: Math.floor(Math.random() * 100),
              views: Math.floor(Math.random() * 50)
            });
            savedArticles.push(savedArticle);
          } catch (error) {
            console.error("Erro ao salvar artigo:", error);
          }
        }
        setCollectionResults(savedArticles);
      }
    } catch (error) {
      console.error("Erro na coleta automática:", error);
    }
    
    setIsCollecting(false);
  };

  const handleManualSubmit = async () => {
    if (!manualNews.title || !manualNews.summary || !manualNews.source) return;
    
    try {
      const savedNews = await News.create({
        ...manualNews,
        published_date: new Date().toISOString(),
        reading_time: Math.ceil(manualNews.content.split(' ').length / 200) || 3,
        trending_score: Math.floor(Math.random() * 50),
        views: 0
      });
      
      // Reset form
      setManualNews({
        title: "",
        summary: "",
        content: "",
        source: "",
        author: "",
        category: "",
        keywords: [],
        image_url: "",
        original_url: ""
      });
      
      setCollectionResults([savedNews]);
    } catch (error) {
      console.error("Erro ao salvar notícia manual:", error);
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !manualNews.keywords.includes(newKeyword.trim())) {
      setManualNews({
        ...manualNews,
        keywords: [...manualNews.keywords, newKeyword.trim()]
      });
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword) => {
    setManualNews({
      ...manualNews,
      keywords: manualNews.keywords.filter(k => k !== keyword)
    });
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
    
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Coletor de Notícias
          </h1>
          <p className="text-slate-600 text-lg">
            Adicione notícias automaticamente ou manualmente ao seu agregador
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Coleta Automática */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600">
                <CardTitle className="flex items-center gap-3 text-white">
                  <Brain className="w-6 h-6" />
                  Coleta Automática com IA
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Input
                    placeholder="Digite o tópico para coletar notícias..."
                    value={searchTopic}
                    onChange={e => setSearchTopic(e.target.value)}
                    disabled={isCollecting}
                    icon={<Search className="w-4 h-4 text-slate-400" />}
                  />
                  <Button
                    onClick={handleAutomaticCollection}
                    disabled={isCollecting || !searchTopic.trim()}
                    className="w-full flex items-center gap-2"
                  >
                    {isCollecting ? <Loader2 className="animate-spin w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    {isCollecting ? "Coletando..." : "Coletar Notícias"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
            </div>
          </div>
        </div>
      );
    }