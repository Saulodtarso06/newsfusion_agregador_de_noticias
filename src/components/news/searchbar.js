import React, { useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar({ onSearch, onCategoryFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { value: "all", label: "Todas Categorias" },
    { value: "tecnologia", label: "Tecnologia" },
    { value: "politica", label: "Política" },
    { value: "economia", label: "Economia" },
    { value: "esportes", label: "Esportes" },
    { value: "saude", label: "Saúde" },
    { value: "entretenimento", label: "Entretenimento" },
    { value: "ciencia", label: "Ciência" },
    { value: "mundial", label: "Mundial" },
    { value: "nacional", label: "Nacional" }
  ];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, onSearch]);

  useEffect(() => {
    onCategoryFilter(selectedCategory);
  }, [selectedCategory, onCategoryFilter]);

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Busque por títulos, conteúdo ou palavras-chave..."
              className="pl-12 pr-12 h-14 text-lg border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-xl transition-all duration-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex gap-3 items-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 h-14 border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded-xl">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-14 px-4 border-0 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300"
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {(searchTerm || selectedCategory !== "all") && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100"
          >
            <span className="text-sm text-gray-500 font-medium">Filtros ativos:</span>
            {searchTerm && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                "{searchTerm}"
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                {categories.find(c => c.value === selectedCategory)?.label}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="text-gray-500 hover:text-gray-700 ml-2"
            >
              Limpar filtros
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}