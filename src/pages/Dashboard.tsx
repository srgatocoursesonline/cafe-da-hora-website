import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Plus, LogOut } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
}

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estado do formulário
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category: 'coffee'
    });

    // Buscar produtos
    const fetchProducts = async () => {
        try {
            const url = `${import.meta.env.VITE_API_BASE_URL}/rest/v1/products?order=created_at.desc`;
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_API_PUBLIC_KEY}`
                }
            });

            if (response.ok) {
                const text = await response.text();
                const data = JSON.parse(text);
                // Suporte a { data: [...] } ou [...]
                const list = Array.isArray(data) ? data : (data.data || []);
                setProducts(list);
            }
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Criar produto
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('auth_token');
            if (!token) throw new Error('Usuário não autenticado');

            const url = `${import.meta.env.VITE_API_BASE_URL}/rest/v1/products`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Usa o token do usuário logado
                    'apikey': import.meta.env.VITE_API_PUBLIC_KEY // Alguns backends exigem, outros não. O seu parece não gostar, mas para escrita autenticada geralmente precisa do Bearer Token JWT.
                },
                body: JSON.stringify({
                    ...newProduct,
                    price: parseFloat(newProduct.price)
                })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Erro ao criar: ${err}`);
            }

            toast({ title: "Produto criado com sucesso!" });
            setNewProduct({ name: '', description: '', price: '', image_url: '', category: 'coffee' });
            fetchProducts(); // Recarrega a lista
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao criar produto",
                description: error.message
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Deletar produto
    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este produto?')) return;

        try {
            const token = localStorage.getItem('auth_token');
            const url = `${import.meta.env.VITE_API_BASE_URL}/rest/v1/products?id=eq.${id}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Falha ao deletar');

            toast({ title: "Produto excluído" });
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            toast({ variant: "destructive", title: "Erro ao excluir" });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-coffee-800 dark:text-coffee-100">CMS - Café da Hora</h1>
                        <p className="text-gray-500">Bem-vindo, {user?.email}</p>
                    </div>
                    <Button variant="outline" onClick={logout} className="gap-2">
                        <LogOut size={16} /> Sair
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Formulário de Criação */}
                    <Card className="lg:col-span-1 h-fit">
                        <CardHeader>
                            <CardTitle>Novo Produto</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nome</Label>
                                    <Input
                                        value={newProduct.name}
                                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Descrição</Label>
                                    <Textarea
                                        value={newProduct.description}
                                        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Preço (R$)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>URL da Imagem</Label>
                                    <Input
                                        value={newProduct.image_url}
                                        onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                                    <Plus size={16} /> {isSubmitting ? 'Salvando...' : 'Adicionar Produto'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Lista de Produtos */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Cardápio Atual ({products.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <p>Carregando...</p>
                            ) : (
                                <div className="space-y-4">
                                    {products.map(product => (
                                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={product.image_url || 'https://placehold.co/50'}
                                                    alt={product.name}
                                                    className="w-12 h-12 rounded object-cover"
                                                />
                                                <div>
                                                    <h3 className="font-bold">{product.name}</h3>
                                                    <p className="text-sm text-gray-500">R$ {Number(product.price).toFixed(2)}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
