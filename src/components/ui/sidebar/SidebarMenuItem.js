import React from "react";

/**
 * Item individual do menu da sidebar.
 */
export default function SidebarMenuItem({ children, active, onClick, className = "" }) {
    return (
        <div
            className={`sidebar-menu-item${active ? " active" : ""} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}