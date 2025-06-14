
import { Coffee, Star, Clock } from 'lucide-react';

const AboutSection = () => {
  const features = [
    {
      icon: Coffee,
      title: 'Grãos Selecionados',
      description: 'Trabalhamos apenas com os melhores grãos, cuidadosamente selecionados de fazendas brasileiras.'
    },
    {
      icon: Star,
      title: 'Qualidade Premium',
      description: 'Nosso compromisso é oferecer sempre a mais alta qualidade em cada xícara servida.'
    },
    {
      icon: Clock,
      title: 'Tradição e Inovação',
      description: 'Combinamos métodos tradicionais com técnicas modernas para criar sabores únicos.'
    }
  ];

  return (
    <section id="about" className="py-16 lg:py-24 bg-white" aria-labelledby="about-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 
                id="about-title"
                className="font-playfair text-3xl lg:text-section-title font-semibold text-coffee-500 mb-6"
              >
                Sobre o Café da Hora
              </h2>
              <p className="font-inter text-lg text-gray-700 leading-relaxed mb-6">
                Há mais de 15 anos, o Café da Hora tem sido o ponto de encontro dos amantes de café. 
                Nossa paixão pela bebida nos levou a criar um espaço único, onde cada detalhe é 
                pensado para proporcionar a melhor experiência possível.
              </p>
              <p className="font-inter text-lg text-gray-700 leading-relaxed">
                Desde a seleção criteriosa dos grãos até o momento em que o café chega à sua mesa, 
                cada etapa é cuidadosamente executada por nossa equipe de especialistas. Nosso objetivo 
                é simples: servir o melhor café que você já experimentou.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-coffee-100 p-3 rounded-full flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-coffee-500" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-inter font-semibold text-lg text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="font-inter text-gray-700 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=600&h=800&fit=crop&auto=format&q=80"
              alt="Interior acolhedor do Café da Hora com mesas de madeira e decoração rústica"
              className="rounded-lg shadow-2xl w-full h-auto"
              loading="lazy"
              width="600"
              height="800"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/20 to-transparent rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
