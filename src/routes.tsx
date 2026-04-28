import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />, // Página inicial
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    }
]);