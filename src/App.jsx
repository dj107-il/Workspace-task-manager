import { BrowserRouter, Routes, Route, Navigate }from 'react-router-dom'
import Login from './pages/LoginPage.jsx'
import Tablero from './pages/TableroPage.jsx'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tablero" element={ localStorage.getItem('usuario') !== null ? <Tablero /> : <Navigate to="/login" /> } />
      </Routes>
    </BrowserRouter>
  )
}

export default App