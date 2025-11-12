function BrandPrendaCard({
  prenda,
  onSelect,
}) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(prenda);
    }
  };

  return (
    <div
      className="relative w-40 h-48 rounded-md overflow-hidden cursor-pointer group transition-all duration-300 bg-gray hover:bg-gray/80 hover:scale-105"
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={prenda.imagenUrl || "/isotipo.svg"}
          alt={prenda.nombre}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/isotipo.svg";
          }}
        />
      </div>

      {/* Título siempre visible en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-2 py-2">
        <h5 className="text-white font-medium text-sm text-center">
          {prenda.nombre}
        </h5>
      </div>

      {/* Overlay al hover */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-sm font-medium">
            Click para editar
          </p>
        </div>
      </div>
    </div>
  );
}

export default BrandPrendaCard;