import React from "react";

/**
 * Rodapé da sidebar, pode conter informações do usuário ou links.
 */
export default function SidebarFooter({ children, className = "" }) {
    return (
        <div className={`sidebar-footer ${className}`}>
            {children}
        </div>
    );
}