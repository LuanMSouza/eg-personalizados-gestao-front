import { Navigate } from 'react-router-dom';

interface Props {
    children: React.ReactNode; // ReactNode é mais abrangente que JSX.Element
}

export function PrivateRoute({ children }: Props) {
    // Verifica se o token existe (o mesmo que você usa no axios)
    const token = localStorage.getItem('@eg-personalizados:token');

    // Se não tiver token, redireciona para o login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Se tiver, renderiza o componente filho (o dashboard)
    return children;
}