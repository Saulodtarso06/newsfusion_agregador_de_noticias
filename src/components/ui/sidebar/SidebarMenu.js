import React from "react";

/**
 * Renderiza um menu de navegação na sidebar.
 */
export default function SidebarMenu({ children, className = "" }) {
    return (
        <nav className={`sidebar-menu ${className}`}>
            {children}
        </nav>
    );
}