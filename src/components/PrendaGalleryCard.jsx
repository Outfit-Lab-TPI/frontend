function PrendaGalleryCard({ prenda }) {
  return (
    <div className="relative w-48 h-64 bg-gray rounded-md overflow-hidden cursor-pointer group">
      <div className="w-full h-full flex items-center justify-center p-5">
        
        <img
          src={prenda.imagenUrl || '/isotipo.svg'}
          alt={prenda.nombre}
          className="max-w-full max-h-full object-contain transition-all duration-300"
          onError={(e) => {
            e.target.src = '/isotipo.svg';
          }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent py-4 flex items-end transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h5 className="text-white font-semibold text-base text-center w-full">{prenda.nombre}</h5>
      </div>
    </div>
  );
}

export default PrendaGalleryCard;