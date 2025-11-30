import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
    // Adicione outros campos conforme necessário
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    // RaDB/Supabase: Endpoint para pegar usuário logado
                    const response = await api('/auth/v1/user');

                    if (!response.ok) throw new Error('Session expired');

                    const data = await response.json();
                    // A resposta vem como { id: ..., email: ... } ou { user: { ... } } dependendo da versão, 
                    // mas geralmente no /user retorna o objeto do usuário direto ou dentro de data.
                    // No padrão GoTrue retorna o objeto User direto.
                    setUser(data);
                } catch (error) {
                    console.error('Failed to restore session:', error);
                    localStorage.removeItem('auth_token');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            // RaDB/Supabase: Endpoint para pegar usuário logado
            const response = await api('/auth/v1/user');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user || data); // Ajuste conforme resposta da API
            } else {
                // Token inválido
                localStorage.removeItem('auth_token');
                setUser(null);
            }
        } catch (error) {
            console.error('Erro ao verificar auth:', error);
            localStorage.removeItem('auth_token');
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            // RaDB/Supabase: Endpoint de Login (Grant Type Password)
            const response = await api('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            // Mapeia a resposta do RaDB (accessToken) para o formato esperado pelo app (access_token)
            const responseData = await response.json();
            console.log('Login response data:', responseData); // Debug log

            // O backend retorna { data: { accessToken: ... }, statusCode: 201 }
            const payload = responseData.data || responseData;
            const token = payload.accessToken || payload.access_token;

            if (!response.ok) {
                throw new Error(responseData.message || 'Falha no login');
            }

            if (!token) throw new Error('Token não recebido. Resposta: ' + JSON.stringify(responseData));

            localStorage.setItem('auth_token', token);

            // Se o usuário vier na resposta, usa ele. Senão busca.
            if (payload.user) {
                setUser(payload.user);
            } else {
                await checkAuth();
            }

            toast({
                title: "Login realizado com sucesso!",
                description: "Bem-vindo de volta.",
            });
        } catch (error: any) {
            console.error('Erro no login:', error);
            toast({
                variant: "destructive",
                title: "Erro no login",
                description: error.message || "Verifique suas credenciais",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        // Opcional: Chamar /auth/v1/logout na API
        localStorage.removeItem('auth_token');
        setUser(null);
        window.location.href = '/login';
    };

    const register = async (data: any) => {
        try {
            // RaDB/Supabase: Endpoint de Signup
            const response = await api('/auth/register', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.msg || err.error_description || 'Erro ao criar conta');
            }

            toast({
                title: "Conta criada com sucesso",
                description: "Verifique seu email para confirmar o cadastro (se necessário).",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao criar conta",
                description: error.message,
            });
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
