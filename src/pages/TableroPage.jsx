import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTareas, crearTarea, actualizarTarea, eliminarTarea } from '../services/TareasSevices.js'
import Swal from 'sweetalert2'

function Tablero() {
    const [tareas, setTareas] = useState([])
    const [cargando, setCargando] = useState(true)
    const [filtro, setFiltro] = useState('Todas')
    const [mostrarForm, setMostrarForm] = useState(false)
    const [tareaEditando, setTareaEditando ] = useState(null)
    const [form, setForm] = useState({
        titulo: '',
        descripcion: '',
        fechaVencimiento: '',
        estado: 'Pendiente'
    })

    const navigate = useNavigate()

    const usuario = JSON.parse(localStorage.getItem('usuario'))

    const cargarTareas = async () => {
        setCargando(true)
        const data = await getTareas()
        setTareas(data)
        setCargando(false)
    }

    useEffect(() => {
        cargarTareas()
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('usuario')
        navigate('/login')
    }

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if(form.titulo.trim() === '') {
            Swal.fire('Error', 'El título no puede estar vacío', 'error')
            return
        }

        if (tareaEditando) {
            await actualizarTarea(tareaEditando.id, form)
            Swal.fire('¡Listo!', 'Tarea actualizada exitosamente.', 'success')
            setTareaEditando(null)
        } else {
            await crearTarea(form)
            Swal.fire('¡Listo!', 'Tarea creada exitosamente', 'success')
        }

        setForm({ titulo: '', descripcion: '', fechaVencimiento: '', estado: 'Pendiente' })
        setMostrarForm(false)
        cargarTareas()
    }

    const handleEditar = (tarea) => {
        setTareaEditando(tarea)
        setForm({
            titulo: tarea.titulo,
            descripcion: tarea.descripcion,
            fechaVencimiento: tarea.fechaVencimiento,
            estado: tarea.estado
        })
        setMostrarForm(true)
    }

    const handleEliminar = async (id) => {
        const resultado = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta tarea se eiminarar permanentemente',
            icon: 'warning',
            iconColor: 'red',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        })

        if (resultado.isConfirmed) {
            await eliminarTarea(id)
            Swal.fire('¡Eliminada!', 'La tarea ha sido eliminada exitosamente', 'success')
            cargarTareas()
        }
    }

    const tareasFiltradas = filtro === 'Todas' ? tareas 
    : tareas.filter(t => t.estado === filtro)

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* 25. Header con info del usuario y botón de logout */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow">
        <div>
          <h1 className="text-xl font-bold text-gray-800">👋 Hola, {usuario?.nombre}</h1>
          <p className="text-sm text-gray-500">Departamento: {usuario?.departamento}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

      {/* 26. Botones de filtro */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['Todas', 'Pendiente', 'En Progreso', 'Completada'].map(estado => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
              filtro === estado
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-200'
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      {/* 27. Botón para mostrar/ocultar formulario */}
      <button
        onClick={() => { setMostrarForm(!mostrarForm); setTareaEditando(null) }}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
      >
        {mostrarForm ? 'Cancelar' : '+ Nueva Tarea'}
      </button>

      {/* 28. Formulario de crear/editar tarea */}
      {mostrarForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl shadow mb-6 flex flex-col gap-3">
          <h2 className="font-bold text-gray-700">{tareaEditando ? 'Editar Tarea' : 'Nueva Tarea'}</h2>

          {/* 29. Cada input usa name para que handleFormChange sepa qué campo actualizar */}
          <input
            name="titulo"
            value={form.titulo}
            onChange={handleFormChange}
            placeholder="Título"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="descripcion"
            value={form.descripcion}
            onChange={handleFormChange}
            placeholder="Descripción"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="fechaVencimiento"
            type="date"
            value={form.fechaVencimiento}
            onChange={handleFormChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="estado"
            value={form.estado}
            onChange={handleFormChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Completada">Completada</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {tareaEditando ? 'Guardar cambios' : 'Crear tarea'}
          </button>
        </form>
      )}

      {/* 30. Spinner mientras carga */}
      {cargando ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        // 31. Lista de tareas filtradas
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tareasFiltradas.length === 0 ? (
            <p className="text-gray-500">No hay tareas para mostrar</p>
          ) : (
            tareasFiltradas.map(tarea => (
              // 32. Tarjeta de cada tarea
              <div key={tarea.id} className="bg-white p-4 rounded-2xl shadow flex flex-col gap-2">
                <h3 className="font-bold text-gray-800">{tarea.titulo}</h3>
                <p className="text-sm text-gray-600">{tarea.descripcion}</p>
                <p className="text-xs text-gray-400">Vence: {tarea.fechaVencimiento}</p>

                {/* 33. Badge de estado con color según el estado */}
                <span className={`text-xs font-medium px-2 py-1 rounded-full w-fit ${
                  tarea.estado === 'Completada' ? 'bg-green-100 text-green-700' :
                  tarea.estado === 'En Progreso' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {tarea.estado}
                </span>

                {/* 34. Botones de acción */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditar(tarea)}
                    className="flex-1 bg-blue-500 text-white py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(tarea.id)}
                    className="flex-1 bg-red-500 text-white py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Tablero