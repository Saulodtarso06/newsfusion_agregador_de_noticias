import React from "react";

/**
 * Componente principal da Sidebar.
 * Recebe children para renderizar menus, grupos e outros conteúdos.
 */
export default function Sidebar({ children, className = "" }) {
    return (
        <aside className={`sidebar ${className}`}>
            {children}
        </aside>
    );
}