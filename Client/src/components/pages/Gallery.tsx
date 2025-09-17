import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  const images = [
    {
      src: 'https://images.pexels.com/photos/8468703/pexels-photo-8468703.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      alt: 'Culto de Domingo',
      category: 'Cultos'
    },
    {
      src: 'https://images.pexels.com/photos/3563625/pexels-photo-3563625.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      alt: 'Momento de Oração',
      category: 'Oração'
    },
    {
      src: 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      alt: 'Louvor e Adoração',
      category: 'Louvor'
    },
    {
      src: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      alt: 'Casais em Oração',
      category: 'Eventos'
    },
    {
      src: 'https://images.pexels.com/photos/1157255/pexels-photo-1157255.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      alt: 'Jovens Adorando',
      category: 'Jovens'
    },
    {
      src: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      alt: 'Família na Igreja',
      category: 'Família'
    },
    {
      src: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      alt: 'Estudo Bíblico',
      category: 'Ensino'
    },
    {
      src: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
      alt: 'Comunhão',
      category: 'Comunhão'
    }
  ];

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  const categories = ['Todos', ...Array.from(new Set(images.map(img => img.category)))];
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredImages = activeCategory === 'Todos' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <section id="galeria" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Galeria de Fotos
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Veja alguns momentos especiais da nossa igreja e sinta o amor que compartilhamos
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-blue-800 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div 
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <p className="font-semibold text-lg">{image.alt}</p>
                  <p className="text-sm">{image.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
              
              <img
                src={images[selectedImage].src}
                alt={images[selectedImage].alt}
                className="max-w-full max-h-screen object-contain"
              />
              
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronLeft className="h-12 w-12" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
              >
                <ChevronRight className="h-12 w-12" />
              </button>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
                <p className="font-semibold text-lg">{images[selectedImage].alt}</p>
                <p className="text-sm">{images[selectedImage].category}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;