// URL base de la API
const API_URL = "https://6a177f361878294b597b7b36.mockapi.io/tareas"

// GET -> Obtener todas las tareas
export const getTareas = async () => {
    // fetch sin opciones extra hace GET por defecto
    const response = await fetch(API_URL)
    // Se convierte la respuesta en JSON y se retorna
    return response.json()
}

// POST -> Crear una nueva tarea
export const crearTarea = async (tarea) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        // se le dice que vamos a enviar un JSON
        headers: {
            'Content-Type': 'application/json'},
        // convertimos el objeto tarea a string JSON para enviarlo
        body: JSON.stringify(tarea)
    })
    return response.json(
    )
}

// PUT -> Actualizar una tarea existente
export const actualizarTarea = async (id, tarea) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'},
        body: JSON.stringify(tarea)
    })
    return response.json()
}

// DELETE -> Eliminar una tarea
export const eliminarTarea = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
    return response.json()
}