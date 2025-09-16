/**
 * Gera uma URL de página baseada no nome da rota.
 * Exemplo: "Home" => "/", "Trending" => "/trending"
 * @param {string} pageName
 * @returns {string}
 */
export function createPageUrl(pageName) {
    if (!pageName || typeof pageName !== "string") return "/";
    const normalized = pageName.trim().toLowerCase();
    return normalized === "home" ? "/" : `/${normalized.replace(/\s+/g, "-")}`;
}