// 1. Importamos useState de React
import { useState } from 'react'
import Swal from 'sweetalert2'
import { crearTarea, actualizarTarea } from '../services/TareasSevices.js'

// 2. Recibe por props si hay una tarea editando, y función para recargar tareas
function TaskForm({ tareaEditando, onTerminar }) {
  // 3. Estado del formulario - si hay tarea editando carga sus datos, si no vacío
  const [form, setForm] = useState({
    titulo: tareaEditando?.titulo || '',
    descripcion: tareaEditando?.descripcion || '',
    fechaVencimiento: tareaEditando?.fechaVencimiento || '',
    estado: tareaEditando?.estado || 'Pendiente'
  })

  // 4. Actualiza el campo correspondiente del form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 5. Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    // 6. Validación de título vacío
    if (form.titulo.trim() === '') {
      Swal.fire('Error', 'El título no puede estar vacío', 'error')
      return
    }

    if (tareaEditando) {
      // 7. Si hay tarea editando → actualiza
      await actualizarTarea(tareaEditando.id, form)
      Swal.fire('¡Listo!', 'Tarea actualizada correctamente', 'success')
    } else {
      // 8. Si no → crea nueva
      await crearTarea(form)
      Swal.fire('¡Listo!', 'Tarea creada correctamente', 'success')
    }

    // 9. Avisa al padre que terminó para que recargue tareas y cierre el form
    onTerminar()
  }

  return (
    // 10. Formulario con estilos
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl shadow mb-6 flex flex-col gap-3">
      <h2 className="font-bold text-gray-700">
        {tareaEditando ? 'Editar Tarea' : 'Nueva Tarea'}
      </h2>

      {/* 11. Cada input usa name para que handleChange sepa qué actualizar */}
      <input
        name="titulo"
        value={form.titulo}
        onChange={handleChange}
        placeholder="Título"
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50"
      />
      <input
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        placeholder="Descripción"
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50"
      />
      <input
        name="fechaVencimiento"
        type="date"
        value={form.fechaVencimiento}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50"
      />
      <select
        name="estado"
        value={form.estado}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50"
      >
        <option value="Pendiente">Pendiente</option>
        <option value="En Progreso">En Progreso</option>
        <option value="Completada">Completada</option>
      </select>

      {/* 12. Botones de submit y cancelar */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 hover:scale-101 transition-all"
        >
          {tareaEditando ? 'Guardar cambios' : 'Crear tarea'}
        </button>
        <button
          type="button"
          onClick={onTerminar}
          className="flex-1 bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 hover:bg-red-600 hover:scale-101 transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default TaskForm