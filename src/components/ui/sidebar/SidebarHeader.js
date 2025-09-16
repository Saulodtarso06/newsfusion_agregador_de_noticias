import React from "react";

/**
 * Cabeçalho da sidebar, pode conter logo ou título.
 */
export default function SidebarHeader({ children, className = "" }) {
    return (
        <div className={`sidebar-header ${className}`}>
            {children}
        </div>
    );
}