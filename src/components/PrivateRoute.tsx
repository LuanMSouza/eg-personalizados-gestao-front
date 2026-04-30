import { Navigate } from 'react-router-dom';

interface Props {
    children: React.ReactNode; // ReactNode é mais abrangente que JSX.Element
}

export function PrivateRoute({ children }: Props) {
    const token = localStorage.getItem('@eg-personalizados:token');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}