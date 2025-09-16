import React, { createContext, useContext, useState } from "react";

/**
 * Contexto para controlar o estado da sidebar (aberta/fechada).
 */
const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [isOpen, setIsOpen] = useState(true);
    const toggleSidebar = () => setIsOpen((open) => !open);

    return (
        <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}