import React from "react";

/**
 * Botão para navegação ou ação no menu da sidebar.
 */
export default function SidebarMenuButton({ children, onClick, className = "" }) {
    return (
        <button className={`sidebar-menu-button ${className}`} onClick={onClick}>
            {children}
        </button>
    );
}