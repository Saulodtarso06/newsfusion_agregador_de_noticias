import React from "react";

/**
 * Agrupa elementos relacionados na sidebar.
 */
export default function SidebarGroup({ label, children, className = "" }) {
    return (
        <div className={`sidebar-group ${className}`}>
            {label && <div className="sidebar-group-label">{label}</div>}
            {children}
        </div>
    );
}