
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Maria Silva',
      location: 'São Paulo, SP',
      rating: 5,
      comment: 'O melhor café que já tomei na vida! O ambiente é acolhedor e o atendimento é excepcional. Recomendo a todos!',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&auto=format&q=80'
    },
    {
      id: 2,
      name: 'João Santos',
      location: 'Rio de Janeiro, RJ',
      rating: 5,
      comment: 'Café da Hora realmente faz jus ao nome! A qualidade dos grãos é impressionante e você sente a diferença em cada gole.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format&q=80'
    },
    {
      id: 3,
      name: 'Ana Costa',
      location: 'Belo Horizonte, MG',
      rating: 5,
      comment: 'Lugar perfeito para trabalhar ou encontrar amigos. O cappuccino artesanal é uma obra de arte e o sabor é divino!',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format&q=80'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        aria-hidden="true"
      />
    ));
  };

  return (
    <section id="testimonials" className="py-16 lg:py-24 bg-white" aria-labelledby="testimonials-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            id="testimonials-title"
            className="font-playfair text-3xl lg:text-section-title font-semibold text-coffee-500 mb-6"
          >
            O que nossos clientes dizem
          </h2>
          <p className="font-inter text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            A satisfação dos nossos clientes é nossa maior recompensa. Veja o que eles têm a dizer 
            sobre a experiência no Café da Hora.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <article 
              key={testimonial.id}
              className="bg-coffee-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Rating */}
              <div className="flex items-center mb-4" aria-label={`Avaliação: ${testimonial.rating} de 5 estrelas`}>
                {renderStars(testimonial.rating)}
              </div>

              {/* Comment */}
              <blockquote className="font-inter text-gray-700 mb-6 leading-relaxed">
                "{testimonial.comment}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={`Foto de ${testimonial.name}`}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                  loading="lazy"
                  width="48"
                  height="48"
                />
                <div>
                  <cite className="font-inter font-semibold text-gray-900 not-italic">
                    {testimonial.name}
                  </cite>
                  <p className="font-inter text-sm text-gray-600">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-playfair text-4xl lg:text-5xl font-bold text-coffee-500 mb-2">
              15+
            </div>
            <div className="font-inter text-gray-700">
              Anos de tradição
            </div>
          </div>
          <div>
            <div className="font-playfair text-4xl lg:text-5xl font-bold text-coffee-500 mb-2">
              50k+
            </div>
            <div className="font-inter text-gray-700">
              Clientes satisfeitos
            </div>
          </div>
          <div>
            <div className="font-playfair text-4xl lg:text-5xl font-bold text-coffee-500 mb-2">
              200+
            </div>
            <div className="font-inter text-gray-700">
              Tipos de café
            </div>
          </div>
          <div>
            <div className="font-playfair text-4xl lg:text-5xl font-bold text-coffee-500 mb-2">
              4.9★
            </div>
            <div className="font-inter text-gray-700">
              Avaliação média
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
