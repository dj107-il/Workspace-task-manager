import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Swal from 'sweetalert2'

function Login() {
    // 10. Estados para el nombre y departamento. Donde el nombre empieza vacio y el departamenteo con 'Desarrollo'
    const [nombre, setNombre] = useState('')
    const [departamento, setDepartamento] = useState('Desarrollo')
    // Hook para redirigir al usuario por código.
    const navigate = useNavigate()

    // Función que se ejecuta al hacer submit en el formulario
    const handleLogin = (e) => {
        //Evita que la pagina se recargue (comportamiento default del form)
        e.preventDefault()
        //Validación: nombre del usuario no puede estar vacio, mostrando un alert.
        if (nombre.trim() === '') {
            Swal.fire({
                title: '¡Campo requerido!',
                text: 'Por favor ingresa tu nombre de usuario',
                icon: 'error',
                confirmButtonColor: '#3b82f6'
            })
            return
        }
        // Se guarda un objeto con nombre, departamento en el localstorage, convirtiendolo a string con JSON.stringify
        localStorage.setItem('usuario', JSON.stringify({ nombre, departamento }))
        Swal.fire({
            title: `¡Bienvenido, ${nombre}! 👋`,
            text: `Ingresaste como ${departamento}`,
            icon: 'success',
            timer: 1500,          // Se cierra solo en 1.5 segundos
            showConfirmButton: false
        })
        // Redirige al usuario a la página del tablero
        navigate('/tablero')
    }

    return (
        // 11. Contenedor que ocupa toda la pantalla y centra el contenido
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            {/* 12. Tarjeta blanca del formulario */}
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                {/* 13. Título */}
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Workspace 🚀
                </h1>

                {/* 14. El form llama a handleLogin al hacer submit */}
                <form onSubmit={handleLogin} className="flex flex-col gap-4">

                    {/* 15. Campo de nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre de usuario
                        </label>
                        {/* 16. value conecta el input al estado, onChange lo actualiza */}
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Juan Pérez"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* 17. Select de departamento */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Departamento
                        </label>
                        {/* 18. Igual que el input - value y onChange conectados al estado */}
                        <select
                            value={departamento}
                            onChange={(e) => setDepartamento(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Desarrollo">Desarrollo</option>
                            <option value="Diseño">Diseño</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                    </div>

                    {/* 19. Botón de submit */}
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Ingresar
                    </button>

                </form>

            </div>
        </div>
    )
}

export default Login