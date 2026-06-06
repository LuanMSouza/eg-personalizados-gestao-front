import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Produtos from './pages/produtos';
import { PrivateRoute } from './components/PrivateRoute';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />, // Página inicial
    },
    {
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        ),
    },
    {
        path: "/produtos",
        element: (
            <PrivateRoute>
                <Produtos />
            </PrivateRoute>
        ),
    }
]);