import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/3563625/pexels-photo-3563625.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280)',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          O Brasil Para Cristo
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-yellow-400">
          OBPC - Família Brasil
        </h2>
        <p className="text-xl md:text-2xl mb-12 leading-relaxed">
          Uma família unida pela fé, transformando vidas através do amor de Cristo
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#sobre"
            className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Conheça Nossa História
          </a>
          <a
            href="#cultos"
            className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Horários de Cultos
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <ChevronDown className="h-8 w-8 text-white animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;