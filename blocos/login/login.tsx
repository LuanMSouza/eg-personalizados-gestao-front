import './login.css'
import imagem from '../../src/assets/newLogo.webp'
import { useState } from 'react'
import { api } from '../../axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';


export default function LoginBlock() {
    const navigate = useNavigate();


    const [login, setLogin] = useState('')
    const [senha, setSenha] = useState('')


    const loginEnviar = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!login || !senha) {
            Swal.fire('Atenção!!', 'Insira um login e uma senha para continuar', 'error')
            return
        }

        try {
            const res = await api.post('/auth/login', { login, senha });

            const token = res.data.token || res.data;
            localStorage.setItem('@eg-personalizados:token', token);

            navigate('/dashboard');

        } catch (error: any) {
            if (error.response?.status === 401) {
                Swal.fire('Opa...', 'Usuário ou senha inválidos!!', 'warning');
            } else {
                Swal.fire('Erro', 'Ocorreu um erro inesperado no servidor.', 'error');
            }
        }
    }

    return <div className='login'>

        <form onSubmit={loginEnviar}>
            <div className='logoContainer'>
                <div className='luzLogo' />
                <img src={imagem} alt="Logo" className='logo' />
            </div>

            <label>Login
                <input
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    type="text" />
            </label>

            <label>Senha
                <input
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    type="password" />
            </label>

            <button type='submit'>Entrar!!</button>
        </form>


    </div>
}