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
            <th className="text-left font-medium p-3 text-sm">Logo</th>
            <th className="text-left font-medium p-3 text-sm">Nombre</th>
            <th className="text-left font-medium p-3 text-sm">Sitio</th>
            <th className="text-left font-medium p-3 text-sm">Usuario</th>
            <th className="text-left font-medium p-3 text-sm">Email</th>
            <th className="text-center font-medium p-3 text-sm">¿Aprobada?</th>
            <th className="text-center font-medium p-3 text-sm">Verificada</th>
            <th className="text-center font-medium p-3 text-sm">Estado</th>
          </tr>
        </thead>
        <tbody>
          {marcas.map((marca) => ( // se llama marca pero en realidad son users con un campo "brand" relacionado de donde obtenemos los datos de la marca
            <tr key={marca.brand.codigoMarca} className="border-b border-gray/20 hover:bg-gray/5">
              <td className="px-4 py-3 text-sm text-white">
                <div className="h-15 w-15 flex items-center justify-center bg-white/50  rounded overflow-hidden p-1.5">
                  <img 
                    src={marca.brand.logoUrl}
                    className="h-full w-full object-contain"
                    alt={marca.brand.name}
                  />
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-white">{marca.brand.nombre}</td>
              <td className="px-4 py-3 text-sm text-gray">{marca.brand.urlSite}</td>
              <td className="px-4 py-3 text-sm text-gray">{marca.name} {marca.lastname}</td>
              <td className="px-4 py-3 text-sm text-gray">{marca.email}</td>
              <td className="px-4 py-3 text-center">
                {marca.brandApproved ? (
                  <Check className="w-5 h-5 text-success mx-auto" />
                ) : (
                  <X className="w-5 h-5 text-error mx-auto" />
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {marca.verified ? (
                  <Check className="w-5 h-5 text-success mx-auto" />
                ) : (
                  <X className="w-5 h-5 text-error mx-auto" />
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {/* Toggle switch para estado activo de marca */}
               {/* --- Toggle invertido (solo estilos) --- */}
              <button
                onClick={() => onToggleEstado(marca.brand.codigoMarca, marca.status)} // envía el estado actual (la lógica del hook lo flippea)
                disabled={operacionEnCurso === `marca-${marca.brand.codigoMarca}`}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 cursor-pointer ${
                  marca.status ? 'bg-success' : 'bg-error'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    marca.status ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
                <span className="sr-only">
                  {marca.status ? 'Desactivar marca' : 'Activar marca'}
                </span>
              </button>
                
              <div className="mt-1 text-xs text-gray">
                {marca.status ? 'Activa' : 'Inactiva'}
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
