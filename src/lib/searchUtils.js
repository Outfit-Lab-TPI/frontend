function normalizeForSearch(str) {
  return str
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function garmentIncludesText(p, text) {
  return (
    normalizeForSearch(p.nombre).includes(text) ||
    normalizeForSearch(p.marcaNombre).includes(text) ||
    normalizeForSearch(p.garmentCode).includes(text)
  );
}

export function searchGarments(garments, searchString) {
  const text = normalizeForSearch(searchString);
  if (!text) return garments;

  return garments.filter((p) => garmentIncludesText(p, text));
}
