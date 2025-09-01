import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

const Families = () => {
  const [selectedFamily, setSelectedFamily] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const families = [
    {
      id: 1,
      name: 'Família Silva',
      joinDate: '15/03/2020',
      members: 'João, Maria e seus filhos Pedro e Ana',
      description: 'Uma família amorosa que encontrou na OBPC um lar espiritual. Sempre participativos nos cultos e eventos, são exemplo de união e fé para toda a comunidade.',
      coverImage: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      gallery: [
        'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/3771055/pexels-photo-3771055.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
      ]
    },
    {
      id: 2,
      name: 'Família Santos',
      joinDate: '22/07/2021',
      members: 'Carlos, Fernanda e filha Júlia',
      description: 'Família alegre e acolhedora que chegou durante a pandemia e rapidamente se integrou à nossa comunidade. Sempre dispostos a ajudar e participar das atividades.',
      coverImage: 'https://images.pexels.com/photos/3771818/pexels-photo-3771818.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      gallery: [
        'https://images.pexels.com/photos/3771818/pexels-photo-3771818.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
      ]
    },
    {
      id: 3,
      name: 'Família Oliveira',
      joinDate: '10/11/2022',
      members: 'Ricardo, Ana Carolina e bebê Miguel',
      description: 'Casal jovem que se casou na igreja e recentemente foi abençoado com o pequeno Miguel. São exemplo de família cristã para os demais jovens da congregação.',
      coverImage: 'https://images.pexels.com/photos/1157255/pexels-photo-1157255.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      gallery: [
        'https://images.pexels.com/photos/1157255/pexels-photo-1157255.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
      ]
    },
    {
      id: 4,
      name: 'Família Costa',
      joinDate: '05/01/2023',
      members: 'Paulo, Márcia, Lucas e Beatriz',
      description: 'Família que chegou no início do ano e rapidamente se tornou parte ativa da nossa comunidade. Os filhos participam das atividades infantis e juvenis.',
      coverImage: 'https://images.pexels.com/photos/8468703/pexels-photo-8468703.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      gallery: [
        'https://images.pexels.com/photos/8468703/pexels-photo-8468703.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/3563625/pexels-photo-3563625.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
      ]
    },
    {
      id: 5,
      name: 'Família Almeida',
      joinDate: '18/09/2023',
      members: 'Roberto, Cláudia e filhos Thiago e Larissa',
      description: 'Família conhecida pela hospitalidade e carinho com todos. Sempre recebem bem os visitantes e são queridos por toda a congregação.',
      coverImage: 'https://images.pexels.com/photos/3771055/pexels-photo-3771055.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      gallery: [
        'https://images.pexels.com/photos/3771055/pexels-photo-3771055.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
      ]
    },
    {
      id: 6,
      name: 'Família Pereira',
      joinDate: '25/08/2025',
      members: 'Daniel, Priscila e filhos Gabriel e Sofia',
      description: 'Nossa família mais recente! Chegaram há poucos meses e já se sentem em casa. As crianças adoram participar das atividades e os pais são muito participativos.',
      coverImage: 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=600&h=400',
      gallery: [
        'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800&h=600',
        'https://images.pexels.com/photos/1157255/pexels-photo-1157255.jpeg?auto=compress&cs=tinysrgb&w=800&h=600'
      ]
    }
  ];

  const openFamilyModal = (familyIndex: number) => {
    setSelectedFamily(familyIndex);
    setSelectedImage(null);
  };

  const closeFamilyModal = () => {
    setSelectedFamily(null);
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedFamily !== null && selectedImage !== null) {
      const family = families[selectedFamily];
      setSelectedImage((selectedImage + 1) % family.gallery.length);
    }
  };

  const prevImage = () => {
    if (selectedFamily !== null && selectedImage !== null) {
      const family = families[selectedFamily];
      setSelectedImage((selectedImage - 1 + family.gallery.length) % family.gallery.length);
    }
  };

  return (
    <section id="familias" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Nossas Famílias
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Conheça as famílias que fazem parte da nossa comunidade e descobra como cada uma contribui 
            para o crescimento e fortalecimento da nossa igreja
          </p>
        </div>

        {/* Families Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {families.map((family, index) => (
            <div 
              key={family.id} 
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              onClick={() => openFamilyModal(index)}
            >
              <div className="relative">
                <img
                  src={family.coverImage}
                  alt={family.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{family.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{family.members}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-blue-800" />
                    <span className="text-sm">Conosco desde {family.joinDate}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {family.description}
                </p>
                
                <div className="mt-4">
                  <button className="text-blue-800 hover:text-blue-900 font-semibold text-sm transition-colors duration-300">
                    Ver Galeria →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Family Modal */}
        {selectedFamily !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-y-auto">
              <div className="relative">
                <button
                  onClick={closeFamilyModal}
                  className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
                
                <div className="p-8">
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">
                      {families[selectedFamily].name}
                    </h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                        Desde {families[selectedFamily].joinDate}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{families[selectedFamily].members}</p>
                    <p className="text-gray-700 leading-relaxed">
                      {families[selectedFamily].description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-6">Galeria da Família</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {families[selectedFamily].gallery.map((image, imageIndex) => (
                        <div 
                          key={imageIndex}
                          className="relative group cursor-pointer overflow-hidden rounded-lg"
                          onClick={() => setSelectedImage(imageIndex)}
                        >
                          <img
                            src={image}
                            alt={`${families[selectedFamily].name} - Foto ${imageIndex + 1}`}
                            className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal */}
        {selectedFamily !== null && selectedImage !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-60 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="h-8 w-8" />
              </button>
              
              <img
                src={families[selectedFamily].gallery[selectedImage]}
                alt={`${families[selectedFamily].name} - Foto ${selectedImage + 1}`}
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
                <p className="font-semibold text-lg">{families[selectedFamily].name}</p>
                <p className="text-sm">Foto {selectedImage + 1} de {families[selectedFamily].gallery.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Families;