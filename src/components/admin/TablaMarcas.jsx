import { Check, X } from 'lucide-react';

function TablaMarcas({
  marcas,
  loading,
  error,
  operacionEnCurso,
  onToggleEstado
}) {
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="text-lg text-gray">Cargando marcas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-lg text-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-gray/10 rounded-lg overflow-hidden">
        <thead className="bg-gray/50">
          <tr>
            <th className="text-left font-medium p-3 text-sm">Nombre</th>
            <th className="text-left font-medium p-3 text-sm">Email</th>
            <th className="text-center font-medium p-3 text-sm">Verificado</th>
            <th className="text-center font-medium p-3 text-sm">Estado</th>
          </tr>
        </thead>
        <tbody>
          {marcas.map((marca) => (
            <tr key={marca.id} className="border-b border-gray/20 hover:bg-gray/5">
              <td className="px-4 py-3 text-sm text-white">{marca.nombre}</td>
              <td className="px-4 py-3 text-sm text-gray">{marca.email}</td>
              <td className="px-4 py-3 text-center">
                {marca.verificado ? (
                  <Check className="w-5 h-5 text-success mx-auto" />
                ) : (
                  <X className="w-5 h-5 text-error mx-auto" />
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {/* Toggle switch para estado activo de marca */}
                <button
                  onClick={() => onToggleEstado(marca.id, marca.activa)}
                  disabled={operacionEnCurso === `marca-${marca.id}`}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                    marca.activa ? 'bg-success' : 'bg-error'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      marca.activa ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                  <span className="sr-only">
                    {marca.activa ? 'Desactivar marca' : 'Activar marca'}
                  </span>
                </button>
                <div className="mt-1 text-xs text-gray">
                  {marca.activa ? 'Activa' : 'Inactiva'}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaMarcas;
