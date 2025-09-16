import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Newspaper, Search, TrendingUp, Plus, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Início",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Trending Topics",
    url: createPageUrl("Trending"),
    icon: TrendingUp,
  },
  {
    title: "Coletar Notícias",
    url: createPageUrl("Collector"),
    icon: Plus,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --primary: 37 99 235;
            --primary-foreground: 248 250 252;
            --background: 255 255 255;
            --foreground: 15 23 42;
            --muted: 248 250 252;
            --muted-foreground: 100 116 139;
            --accent: 241 245 249;
            --accent-foreground: 15 23 42;
          }
          
          .news-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          .trending-pulse {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: .7; }
          }
          
          .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .hover-lift:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 news-gradient rounded-xl flex items-center justify-center shadow-lg">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-slate-900">NewsAggregator</h2>
                <p className="text-xs text-slate-500 font-medium">Notícias em Tempo Real</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Navegação
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover-lift hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-xl mb-1 ${location.pathname === item.url ? 'bg-blue-50 text-blue-700 shadow-sm' : ''
                          }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 py-3">
                Categorias Populares
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  {['Tecnologia', 'Política', 'Esportes', 'Economia'].map((category) => (
                    <div key={category} className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">{category}</span>
                      <span className="trending-pulse text-blue-600 font-bold">●</span>
                    </div>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <span className="text-slate-600 font-semibold text-sm">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">Usuário</p>
                <p className="text-xs text-slate-500 truncate">Leitor de notícias</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-100 px-6 py-4 md:hidden shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-xl transition-colors duration-200" />
              <h1 className="text-xl font-bold text-slate-900">NewsAggregator</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto bg-gray-50">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}