import './navbar.css'
import imagem from '../../src/assets/newLogo.webp'
import { useNavigate } from 'react-router-dom'

export default function NavBar() {

    const nav = useNavigate()

    const sair = () => {
        localStorage.clear()
        nav('/')
    }


    return (
        <nav>

            <img src={imagem} alt="Logo" />

            <button
                onClick={sair}
            >
                Sair
            </button>

        </nav>
    )
}