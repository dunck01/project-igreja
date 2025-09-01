import React from 'react';
import { Heart, Users, BookOpen, Globe } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Amor',
      description: 'Praticamos o amor incondicional de Cristo em todas as nossas ações'
    },
    {
      icon: Users,
      title: 'Comunidade',
      description: 'Somos uma família unida que se apoia mutuamente na fé'
    },
    {
      icon: BookOpen,
      title: 'Palavra',
      description: 'Fundamentamos nossa vida na Palavra de Deus e seus ensinamentos'
    },
    {
      icon: Globe,
      title: 'Missão',
      description: 'Levamos o evangelho a todos os cantos, transformando vidas'
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Quem Somos
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A Igreja O Brasil Para Cristo - OBPC Família Brasil é uma comunidade de fé 
            comprometida em levar esperança, amor e transformação através do evangelho de Jesus Cristo.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Nossa História</h3>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Fundada com o propósito de ser uma família espiritual que acolhe, 
                ama e transforma vidas, nossa igreja tem sido um farol de esperança 
                na comunidade há anos.
              </p>
              <p>
                Iniciamos nossa jornada com a visão de criar um ambiente onde 
                pessoas de todas as idades e backgrounds possam encontrar seu lugar 
                na família de Deus e crescer espiritualmente.
              </p>
              <p>
                Hoje, continuamos firmes em nossa missão de pregar o evangelho, 
                formar discípulos e impactar nossa cidade com o amor de Cristo.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/8468703/pexels-photo-8468703.jpeg?auto=compress&cs=tinysrgb&w=600&h=800"
              alt="Igreja em oração"
              className="w-full h-96 object-cover rounded-lg shadow-xl"
            />
            <div className="absolute inset-0 bg-blue-800 bg-opacity-20 rounded-lg"></div>
          </div>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white p-6 rounded-full w-20 h-20 mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300 flex items-center justify-center">
                <value.icon className="h-10 w-10 text-blue-800" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;