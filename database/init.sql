-- Migration Inicial para o CMS Cafe da Hora (RaDB / PostgreSQL)

-- Habilita extensão para UUIDs se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela de Produtos (Cardápio)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category VARCHAR(100) DEFAULT 'coffee', -- ex: coffee, food, dessert
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela de Depoimentos
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100), -- Cargo ou título do cliente
    content TEXT NOT NULL,
    avatar_url TEXT,
    rating INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Conteúdo do Site (Para Hero, About, Footer, etc.)
-- Estrutura flexível para gerenciar textos e configurações
CREATE TABLE IF NOT EXISTS site_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_slug VARCHAR(100) NOT NULL, -- ex: 'hero', 'about', 'contact'
    field_key VARCHAR(100) NOT NULL,    -- ex: 'title', 'subtitle', 'background_image'
    field_value TEXT,                   -- O conteúdo em si
    field_type VARCHAR(50) DEFAULT 'text', -- 'text', 'image', 'rich_text'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(section_slug, field_key)
);

-- 4. Tabela de Mensagens de Contato
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new', -- new, read, replied
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Políticas de Segurança (RLS - Row Level Security)
-- Habilita RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura (Públicas)
CREATE POLICY "Produtos são públicos" ON products FOR SELECT USING (true);
CREATE POLICY "Depoimentos são públicos" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Conteúdo do site é público" ON site_contents FOR SELECT USING (true);

-- Políticas de Escrita (Apenas Authenticated/Admin)
-- Assumindo que usuários autenticados são admins neste CMS simples
CREATE POLICY "Admins podem gerenciar produtos" ON products 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem gerenciar depoimentos" ON testimonials 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem gerenciar conteúdo" ON site_contents 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins podem ver mensagens" ON contact_messages 
    FOR SELECT USING (auth.role() = 'authenticated');

-- Qualquer um pode criar uma mensagem de contato (Insert público)
CREATE POLICY "Público pode enviar mensagens" ON contact_messages 
    FOR INSERT WITH CHECK (true);


-- DADOS INICIAIS (SEED) --

-- Seed: Produtos
INSERT INTO products (name, description, price, image_url, category) VALUES
('Café Expresso Tradicional', 'Um clássico irresistível para começar seu dia.', 5.50, 'https://images.unsplash.com/photo-1459257868276-5e65389e2722?auto=format&fit=crop&w=400&q=80', 'coffee'),
('Cappuccino Cremoso', 'Café, leite vaporizado e espuma cremosa com um toque extra.', 8.00, 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80', 'coffee'),
('Latte Avelã', 'Avelã com creme leite aveludado, sofisticado.', 9.50, 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', 'coffee'),
('Mocha Chocolate', 'Para os amantes de chocolate: café intenso, leite e cacau.', 10.00, 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80', 'coffee'),
('Café Gelado Tropical', 'Refrescante e exótico, perfeito para os dias quentes.', 7.00, 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80', 'cold'),
('Macchiato Caramelo', 'Camadas de espresso com doce de caramelo e espuma.', 8.50, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80', 'coffee');

-- Seed: Conteúdo do Site (Hero Section)
INSERT INTO site_contents (section_slug, field_key, field_value) VALUES
('hero', 'title', 'O Café que Abraça seu Dia'),
('hero', 'subtitle', 'Experimente o sabor autêntico de grãos selecionados em um ambiente acolhedor.'),
('hero', 'cta_text', 'Ver Cardápio'),
('about', 'title', 'Nossa História'),
('about', 'description', 'Fundado com a paixão por café de qualidade, o Café da Hora traz grãos selecionados e um ambiente acolhedor para você.');
