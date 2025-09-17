import React from 'react';
import { Clock, Calendar, Users, Music } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Music,
      title: 'Culto de Celebração',
      day: 'Domingo',
      time: '09:00 às 11:00',
      description: 'Nosso principal culto com louvor, palavra e comunhão',
      color: 'bg-blue-800'
    },
    {
      icon: Users,
      title: 'Culto de Oração',
      day: 'Terça-feira',
      time: '19:30 às 21:00',
      description: 'Momento especial de oração e intercessão pela igreja e cidade',
      color: 'bg-yellow-600'
    },
    {
      icon: Calendar,
      title: 'Culto de Ensino',
      day: 'Quinta-feira',
      time: '19:30 às 21:00',
      description: 'Aprofundamento bíblico e estudo da Palavra de Deus',
      color: 'bg-green-600'
    },
    {
      icon: Clock,
      title: 'Culto Jovem',
      day: 'Sábado',
      time: '19:00 às 21:00',
      description: 'Culto especial voltado para jovens com linguagem contemporânea',
      color: 'bg-purple-600'
    }
  ];

  return (
    <section id="cultos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Horários de Cultos
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Venha participar dos nossos encontros e experimente a presença de Deus em sua vida
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
              <div className={`${service.color} p-6 text-white text-center`}>
                <service.icon className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-lg font-semibold">{service.day}</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-2">{service.time}</div>
                </div>
                <p className="text-gray-600 text-center leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-blue-800 text-white p-8 rounded-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Primeira Vez na Igreja?</h3>
            <p className="text-lg mb-6">
              Ficaremos felizes em recebê-lo! Nossa equipe de recepção estará pronta para ajudá-lo.
            </p>
            <a
              href="#contato"
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Entre em Contato
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;