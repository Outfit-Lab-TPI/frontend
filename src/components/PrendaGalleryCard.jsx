function PrendaGalleryCard({ prenda }) {
  return (
    <div className="relative w-48 h-64 bg-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 group">
      <div className="w-full h-48 flex items-center justify-center p-4">
        <img
          src={prenda.imagenUrl || '/isotipo.svg'}
          alt={prenda.nombre}
          className="max-w-full max-h-full object-contain transition-all duration-300"
          onError={(e) => {
            e.target.src = '/isotipo.svg';
          }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
        <h3 className="text-white font-semibold text-sm mb-1">{prenda.nombre}</h3>
        <p className="text-gray-300 text-xs">{prenda.tipo}</p>
      </div>
    </div>
  );
}

export default PrendaGalleryCard;