import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // Pode substituir por um componente de Loading mais elaborado
        return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
    }

    if (!isAuthenticated) {
        // Redireciona para login, salvando a localização original para retornar depois
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
