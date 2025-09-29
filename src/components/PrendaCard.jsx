function PrendaCard({ prenda, isSelected, onSelect }) {
  return (
    <div
      className={`prenda-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(prenda.id)}
    >
      <div className="prenda-image">
        <img
          src={prenda.imagen || '/isotipo.svg'}
          alt={prenda.nombre}
          style={{ width: '80%', height: '80%', objectFit: 'cover' }}
        />
      </div>
      <div className="prenda-info">
        <h3>{prenda.nombre}</h3>
        <p>{prenda.tipo}</p>
      </div>
    </div>
  );
}

export default PrendaCard;