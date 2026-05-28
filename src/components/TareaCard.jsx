// 1. Recibe por props los datos de la tarea y las funciones de acción
function TareaCard({ tarea, onEditar, onEliminar }) {
  return (
    // 2. Tarjeta con sombra y esquinas redondeadas
    <div className="bg-white p-4 rounded-2xl shadow flex flex-col gap-2">
      {/* 3. Título de la tarea */}
      <h3 className="font-bold text-gray-800">{tarea.titulo}</h3>
      {/* 4. Descripción */}
      <p className="text-sm text-gray-600">{tarea.descripcion}</p>
      {/* 5. Fecha de vencimiento */}
      <p className="text-xs text-gray-400">Vence: {tarea.fechaVencimiento}</p>

      {/* 6. Badge de estado con color según valor */}
      <span className={`text-xs font-medium px-2 py-1 rounded-full w-fit ${
        tarea.estado === 'Completada' ? 'bg-green-100 text-green-700' :
        tarea.estado === 'En Progreso' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {tarea.estado}
      </span>

      {/* 7. Botones que llaman a las funciones recibidas por props */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onEditar(tarea)}
          className="flex-1 bg-blue-500 text-white py-1 rounded-lg text-sm hover:bg-blue-600 hover:scale-105 transition-all"
        >
          Editar
        </button>
        <button
          onClick={() => onEliminar(tarea.id)}
          className="flex-1 bg-red-500 text-white py-1 rounded-lg text-sm hover:bg-red-600 hover:scale-105 transition-all"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

// 8. Exportamos el componente
export default TareaCard