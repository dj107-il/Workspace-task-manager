import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTareas, eliminarTarea } from '../services/TareasSevices.js'
import TareaCard from '../components/TareaCard.jsx'
import TaskForm from '../components/TaskForm.jsx'
import Swal from 'sweetalert2'

function Tablero() {
    const [tareas, setTareas] = useState([])
    const [cargando, setCargando] = useState(true)
    const [filtro, setFiltro] = useState('Todas')
    const [mostrarForm, setMostrarForm] = useState(false)
    const [tareaEditando, setTareaEditando] = useState(null)

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

    const handleLogout = async () => {
        const resultado = await Swal.fire({
            title: '¿Cerrar sesión?',
            text: '¿Estás seguro que deseas salir?',
            icon: 'question',
            iconColor: 'yellow',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#ef4444'
        })

        if (resultado.isConfirmed) {
            await Swal.fire({
                title: `¡Hasta luego, ${usuario?.nombre}! 👋`,
                text: 'Tu sesión ha sido cerrada correctamente',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            })
            localStorage.removeItem('usuario')
            navigate('/login')
        }
    }

    const handleEditar = (tarea) => {
        setTareaEditando(tarea)
        setMostrarForm(true)
    }
    const handleEliminar = async (id) => {
        const resultado = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta tarea se eiminará permanentemente',
            icon: 'warning',
            iconColor: 'red',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            confirmButtonColor: 'red',
            cancelButtonText: 'Cancelar'
        })

        if (resultado.isConfirmed) {
            await eliminarTarea(id)
            Swal.fire('¡Eliminada!', 'La tarea ha sido eliminada exitosamente', 'success')
            cargarTareas()
        }
    }

    // 16. Cuando TaskForm termina: cierra form, limpia edición y recarga tareas
    const handleTerminarForm = () => {
        setMostrarForm(false)
        setTareaEditando(null)
        cargarTareas()
    }

    const tareasFiltradas = filtro === 'Todas' ? tareas
        : tareas.filter(t => t.estado === filtro)

    return (
<div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-6">

      {/* 18. Header con gradiente */}
      <div className="flex justify-between items-center mb-6 p-4 rounded-2xl shadow bg-gradient-to-r from-blue-600 to-indigo-600">
        <div>
          <h1 className="text-xl font-bold text-white">👋 Hola, {usuario?.nombre}</h1>
          <p className="text-sm text-white">Departamento: {usuario?.departamento}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:scale-105 transition-all"
        >
          Cerrar sesión
        </button>
      </div>

      {/* 19. Botones de filtro */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['Todas', 'Pendiente', 'En Progreso', 'Completada'].map(estado => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-all hover:scale-105 ${
              filtro === estado
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-200'
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      {/* 20. Botón nueva tarea */}
      <button
        onClick={() => { setMostrarForm(!mostrarForm); setTareaEditando(null) }}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:scale-105 transition-all"
      >
        {mostrarForm ? 'Cancelar' : '+ Nueva Tarea'}
      </button>

      {/* 21. TaskForm recibe la tarea editando y la función para terminar */}
      {mostrarForm && (
        <TaskForm
          tareaEditando={tareaEditando}
          onTerminar={handleTerminarForm}
        />
      )}

      {/* 22. Spinner mientras carga */}
      {cargando ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        // 23. Grid de tarjetas usando TareaCard
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tareasFiltradas.length === 0 ? (
            <p className="text-gray-500">No hay tareas para mostrar</p>
          ) : (
            tareasFiltradas.map(tarea => (
              // 24. TareaCard recibe la tarea y las funciones como props
              <TareaCard
                key={tarea.id}
                tarea={tarea}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
              />
            ))
          )}
        </div>
      )}
    </div>
    )
}

export default Tablero