import { useNavigate } from 'react-router-dom';

function MarcaCard({ marca }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/marcas/${marca.codigoMarca}`);
  };

  return (
    <div
      className="relative w-80 h-80 bg-gray rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-black/30 group"
      onClick={handleClick}
    >
      <div className="w-full h-full flex items-center justify-center p-5">
        <img
          src={marca.logoUrl || '/isotipo.svg'}
          alt={marca.nombre}
          className="max-w-full max-h-full object-contain transition-all duration-300"
          onError={(e) => {
            e.target.src = '/isotipo.svg';
          }}
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent py-4 flex items-end transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h5 className="text-white font-semibold text-base text-center w-full">{marca.nombre}</h5>
      </div>
    </div>
  );
}

export default MarcaCard;