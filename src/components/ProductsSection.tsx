
import React from 'react';
import { ShoppingCart } from "lucide-react";

// Fotos reais de cafés do Unsplash (diferentes visuais)
const productsData = [
  {
    id: 1,
    name: 'Café Expresso Tradicional',
    description: 'Um clássico irresistível para começar seu dia.',
    price: 5.5,
    image: 'https://images.unsplash.com/photo-1459257868276-5e65389e2722?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 2,
    name: 'Cappuccino Cremoso',
    description: 'Café, leite vaporizado e espuma cremosa com um toque extra.',
    price: 8.0,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 3,
    name: 'Latte Avelã',
    description: 'Avelã com creme leite aveludado, sofisticado.',
    price: 9.5,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 4,
    name: 'Mocha Chocolate',
    description: 'Para os amantes de chocolate: café intenso, leite e cacau.',
    price: 10.0,
    image: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 5,
    name: 'Café Gelado Tropical',
    description: 'Refrescante e exótico, perfeito para os dias quentes.',
    price: 7.0,
    image: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 6,
    name: 'Macchiato Caramelo',
    description: 'Camadas de espresso com doce de caramelo e espuma.',
    price: 8.5,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  },
];

const ProductsSection = () => {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Backend corrigido. Usando endpoint limpo.
        const url = `${import.meta.env.VITE_API_BASE_URL}/rest/v1/products`;
        console.log('Fetching products from:', url);

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_API_PUBLIC_KEY}`
          }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const text = await response.text();
          console.error('API Error Body:', text);
          throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        try {
          const result = JSON.parse(text);

          // Verifica se é um array direto ou um objeto com propriedade data
          let productsList = [];
          if (Array.isArray(result)) {
            productsList = result;
          } else if (result && Array.isArray(result.data)) {
            productsList = result.data;
          } else {
            console.error('Formato de dados inválido:', result);
            setError('Dados recebidos não são uma lista.');
            return;
          }

          setProducts(productsList);
        } catch (e) {
          console.error('Erro ao fazer parse do JSON:', e);
          console.error('Conteúdo recebido:', text);
          setError('A API retornou um formato inválido (provavelmente HTML em vez de JSON). Veja o console.');
        }
      } catch (error: any) {
        console.error('Erro ao buscar produtos:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section id="products" className="py-16 bg-coffee-50 dark:bg-coffee-900 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <p>Carregando cardápio...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="products" className="py-16 bg-coffee-50 dark:bg-coffee-900 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center text-red-500">
          <p>Não foi possível carregar o cardápio.</p>
          <p className="text-sm mt-2 text-gray-500">{error}</p>
          <p className="text-xs mt-1 text-gray-400">Verifique a URL da API no .env</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="products"
      className="py-16 bg-coffee-50 dark:bg-coffee-900 transition-colors duration-300"
      aria-labelledby="products-title"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="products-title"
          className="font-playfair text-3xl lg:text-section-title font-bold text-coffee-600 dark:text-coffee-300 mb-10 text-center animate-fade-slide-in text-gradient"
        >
          Produtos
        </h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {products.map((prod, idx) => (
            <div
              key={prod.id}
              className="card-hover bg-white dark:bg-coffee-800 rounded-lg shadow-md group relative animate-fade-in overflow-hidden"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="card-image-zoom">
                <img
                  src={prod.image_url || 'https://images.unsplash.com/photo-1459257868276-5e65389e2722?auto=format&fit=crop&w=400&q=80'}
                  alt={`Foto de ${prod.name}`}
                  className="w-full h-48 object-cover rounded-t-lg"
                  loading="lazy"
                  width={400}
                  height={192}
                  onError={e => (e.currentTarget.src = 'https://images.unsplash.com/photo-1459257868276-5e65389e2722?auto=format&fit=crop&w=400&q=80')}
                />
              </div>
              <div className="p-6 flex flex-col gap-2">
                <h3 className="font-playfair text-xl text-coffee-700 dark:text-coffee-200 mb-2 group-hover:text-coffee-500 dark:group-hover:text-coffee-300 transition-colors">{prod.name}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-base">{prod.description}</p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xl font-bold text-gradient group-hover:scale-110 transition-transform inline-block">R$ {Number(prod.price).toFixed(2).replace('.', ',')}</span>
                  <button
                    className="group/btn flex items-center gap-2 bg-coffee-500 hover:bg-coffee-600 text-white px-5 py-2 rounded-full transition-all duration-300 shadow-md hover:shadow-lg outline-none focus:ring-2 focus:ring-coffee-400 focus:ring-offset-2 font-inter font-semibold text-base hover:scale-110 ripple overflow-hidden relative"
                    aria-label={`Adicionar ${prod.name} ao carrinho`}
                  >
                    <ShoppingCart className="w-5 h-5 transform group-hover/btn:rotate-12 transition-transform" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>
              <span className="block absolute top-2 right-2 text-xs bg-coffee-100 dark:bg-coffee-700 text-coffee-700 dark:text-coffee-200 rounded-full px-3 py-1 group-hover:bg-coffee-500 dark:group-hover:bg-coffee-600 group-hover:text-white transition-all transform group-hover:scale-110 group-hover:rotate-12 font-semibold shadow-md">Novidade</span>
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-500/0 via-coffee-500/0 to-coffee-500/0 group-hover:from-coffee-500/10 group-hover:via-coffee-500/5 group-hover:to-coffee-500/0 transition-all duration-500 pointer-events-none rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
