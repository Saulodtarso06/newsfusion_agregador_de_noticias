import React from "react";

/**
 * Renderiza o conteúdo principal da sidebar.
 */
export default function SidebarContent({ children, className = "" }) {
    return (
        <div className={`sidebar-content ${className}`}>
            {children}
        </div>
    );
}