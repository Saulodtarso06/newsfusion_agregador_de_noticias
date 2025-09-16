import React from "react";

/**
 * Exibe o rótulo de um grupo na sidebar.
 */
export default function SidebarGroupLabel({ children, className = "" }) {
    return (
        <div className={`sidebar-group-label ${className}`}>
            {children}
        </div>
    );
}