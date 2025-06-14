
import { MapPin, Phone, Clock, Send } from 'lucide-react';
import { useState } from 'react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Assunto é obrigatório';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Sanitize inputs
      const sanitizedData = {
        name: formData.name.trim().slice(0, 100),
        email: formData.email.trim().slice(0, 254),
        phone: formData.phone.trim().slice(0, 20),
        subject: formData.subject.trim().slice(0, 100),
        message: formData.message.trim().slice(0, 1000)
      };

      console.log('Form submitted:', sanitizedData);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Endereço',
      content: 'Rua dos Cafés, 123\nVila Madalena, São Paulo - SP\nCEP: 05433-100'
    },
    {
      icon: Phone,
      title: 'Contato',
      content: 'Telefone: (11) 99999-9999\nWhatsApp: (11) 88888-8888\nEmail: contato@cafedahora.com.br'
    },
    {
      icon: Clock,
      title: 'Horário de Funcionamento',
      content: 'Segunda a Sexta: 7h às 19h\nSábado e Domingo: 8h às 18h\nFeriados: 9h às 16h'
    }
  ];

  return (
    <section id="contact" className="py-16 lg:py-24 bg-coffee-50" aria-labelledby="contact-title">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            id="contact-title"
            className="font-playfair text-3xl lg:text-section-title font-semibold text-coffee-500 mb-6"
          >
            Entre em Contato
          </h2>
          <p className="font-inter text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Tem alguma dúvida ou quer fazer uma reserva? Estamos aqui para ajudar! 
            Entre em contato conosco através dos canais abaixo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <h3 className="font-playfair text-2xl font-semibold text-coffee-500 mb-6">
              Informações de Contato
            </h3>
            
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-coffee-500 p-3 rounded-full flex-shrink-0">
                  <info.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-inter font-semibold text-lg text-gray-900 mb-2">
                    {info.title}
                  </h4>
                  <p className="font-inter text-gray-700 whitespace-pre-line leading-relaxed">
                    {info.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="mt-8 bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <p className="font-inter text-gray-500">Mapa interativo em breve</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="font-playfair text-2xl font-semibold text-coffee-500 mb-6">
              Envie uma Mensagem
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block font-inter font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Seu nome completo"
                    maxLength={100}
                    required
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block font-inter font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="seu@email.com"
                    maxLength={254}
                    required
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block font-inter font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors"
                    placeholder="(11) 99999-9999"
                    maxLength={20}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block font-inter font-medium text-gray-700 mb-2">
                    Assunto *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors ${
                      errors.subject ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="duvida">Dúvida sobre produtos</option>
                    <option value="reserva">Fazer reserva</option>
                    <option value="evento">Evento privado</option>
                    <option value="sugestao">Sugestão</option>
                    <option value="outro">Outro</option>
                  </select>
                  {errors.subject && (
                    <p id="subject-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.subject}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block font-inter font-medium text-gray-700 mb-2">
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent transition-colors resize-vertical ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite sua mensagem aqui..."
                  maxLength={1000}
                  required
                  aria-describedby={errors.message ? 'message-error' : undefined}
                ></textarea>
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-coffee-500 hover:bg-coffee-600 text-white font-inter font-semibold px-6 py-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 focus:outline-none focus:ring-4 focus:ring-coffee-500 focus:ring-offset-2"
              >
                <Send className="h-5 w-5" aria-hidden="true" />
                <span>Enviar Mensagem</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
