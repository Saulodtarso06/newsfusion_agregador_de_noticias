import React from "react";

/**
 * Renderiza o conteúdo de um grupo na sidebar.
 */
export default function SidebarGroupContent({ children, className = "" }) {
    return (
        <div className={`sidebar-group-content ${className}`}>
            {children}
        </div>
    );
}