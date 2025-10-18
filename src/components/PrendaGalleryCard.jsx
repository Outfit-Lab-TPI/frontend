import { Check } from "lucide-react";

function PrendaGalleryCard({ prenda, isSelected, onSelect }) {
  return (
    <div
      className={`relative w-40 h-48 rounded-md overflow-hidden cursor-pointer group transition-all duration-300 ${
        isSelected
          ? 'bg-primary ring-2 ring-primary shadow-lg scale-105'
          : 'bg-gray hover:bg-gray/80'
      }`}
      onClick={() => onSelect(prenda)}
    >
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={prenda.imagenUrl || '/isotipo.svg'}
          alt={prenda.nombre}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/isotipo.svg';
          }}
        />
      </div>
      {isSelected ? (
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-between px-2 py-4">
          <div className="flex justify-end">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <Check className="text-black w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <h5 className="text-white font-semibold text-base text-center">{prenda.nombre}</h5>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-2 py-4 flex items-end transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h5 className="text-white font-semibold text-base text-center w-full">{prenda.nombre}</h5>
        </div>
      )}
    </div>
  );
}

export default PrendaGalleryCard;