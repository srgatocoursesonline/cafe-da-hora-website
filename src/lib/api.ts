const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type FetchOptions = RequestInit & {
    headers?: Record<string, string>;
};

export class ApiError extends Error {
    status: number;
    data: any;

    constructor(status: number, message: string, data?: any) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

export const api = async (endpoint: string, options: FetchOptions = {}) => {
    const token = localStorage.getItem('auth_token');

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        if (response.status === 401) {
            // Interceptor de Response: 401 Unauthorized
            localStorage.removeItem('auth_token');
            // Redirecionar apenas se não estivermos já na página de login para evitar loops
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
            throw new ApiError(401, 'Unauthorized');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new ApiError(response.status, response.statusText, errorData);
        }

        // Retorna o response original para flexibilidade, ou podemos retornar response.json()
        // O usuário pediu "Cliente HTTP", geralmente espera-se algo que retorne os dados ou o response.
        // Vou retornar o response para permitir .json(), .blob(), etc.
        return response;
    } catch (error) {
        throw error;
    }
};
