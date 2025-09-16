import React from "react";
import { useSidebar } from "./SidebarProvider";

/**
 * Botão para abrir/fechar a sidebar.
 */
export default function SidebarTrigger({ children, className = "" }) {
    const { toggleSidebar } = useSidebar();

    return (
        <button className={`sidebar-trigger ${className}`} onClick={toggleSidebar}>
            {children}
        </button>
    );
}