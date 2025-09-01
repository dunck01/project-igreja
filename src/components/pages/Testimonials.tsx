import React from 'react';
import { Quote, Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Membro há 8 anos',
      image: 'https://images.pexels.com/photos/3771055/pexels-photo-3771055.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
      text: 'Minha vida foi completamente transformada desde que cheguei na OBPC. Encontrei uma família que me acolheu com amor e me ajudou a crescer espiritualmente. Aqui aprendi o verdadeiro significado do amor de Cristo.',
      rating: 5
    },
    {
      name: 'João Santos',
      role: 'Líder de Jovens',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
      text: 'A OBPC é mais que uma igreja, é uma família. Os ensinamentos mudaram minha perspectiva de vida e hoje tenho o privilégio de servir no ministério jovem, ajudando outros a conhecerem Jesus.',
      rating: 5
    },
    {
      name: 'Ana Carolina',
      role: 'Ministério de Louvor',
      image: 'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
      text: 'Através do ministério de louvor, descobri meus dons e talentos. A igreja me deu oportunidade de servir a Deus com música e hoje vejo como isso impacta vidas. Sou muito grata por fazer parte desta família.',
      rating: 5
    },
    {
      name: 'Carlos Oliveira',
      role: 'Ministério Social',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
      text: 'Na OBPC aprendi que servir ao próximo é servir a Cristo. Através do ministério social, temos levado esperança às famílias necessitadas. É gratificante fazer parte dessa obra transformadora.',
      rating: 5
    },
    {
      name: 'Fernanda Costa',
      role: 'Ministério Infantil',
      image: 'https://images.pexels.com/photos/3771818/pexels-photo-3771818.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
      text: 'Trabalhar com as crianças na igreja tem sido uma bênção. Ver o crescimento espiritual dos pequenos e participar da formação do caráter cristão deles é um privilégio que Deus me deu nesta casa.',
      rating: 5
    },
    {
      name: 'Ricardo Almeida',
      role: 'Diácono',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=200&h=200',
      text: 'Ser parte da liderança da OBPC é uma responsabilidade e um privilégio. Vejo diariamente como Deus usa esta igreja para transformar vidas e famílias. É emocionante participar desta obra.',
      rating: 5
    }
  ];

  return (
    <section id="depoimentos" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Depoimentos
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Ouça o que nossos irmãos têm a dizer sobre como Deus tem transformado suas vidas através da nossa comunidade
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 relative">
              {/* Quote Icon */}
              <div className="absolute -top-4 left-6">
                <div className="bg-blue-800 rounded-full p-3">
                  <Quote className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="pt-8">
                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-blue-800 text-white p-8 rounded-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Você Também Pode Fazer Parte!</h3>
            <p className="text-lg mb-6">
              Venha conhecer nossa família e descubra como Deus pode transformar sua vida
            </p>
            <a
              href="#contato"
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Visite-nos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;