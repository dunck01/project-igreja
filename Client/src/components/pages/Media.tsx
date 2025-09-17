import { useState } from 'react';
import { Play, Calendar, Eye, ExternalLink } from 'lucide-react';

const Media = () => {
  const [activeTab, setActiveTab] = useState('videos');

  // Simulando vídeos do YouTube (em produção, estes viriam da API do YouTube)
  const videos = [
    {
      id: 'dQw4w9WgXcQ',
      title: 'Culto de Domingo - "O Amor que Transforma"',
      description: 'Mensagem especial sobre o amor transformador de Cristo em nossas vidas',
      thumbnail: 'https://images.pexels.com/photos/8468703/pexels-photo-8468703.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      duration: '1:45:30',
      views: '2.3k',
      date: '15/12/2024'
    },
    {
      id: 'dQw4w9WgXcQ',
      title: 'Conferência de Avivamento - Dia 1',
      description: 'Primeira noite da conferência com pregação poderosa sobre avivamento',
      thumbnail: 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      duration: '2:15:45',
      views: '5.1k',
      date: '10/12/2024'
    },
    {
      id: 'dQw4w9WgXcQ',
      title: 'Louvor e Adoração - Especial de Natal',
      description: 'Momentos especiais de louvor celebrando o nascimento de Jesus',
      thumbnail: 'https://images.pexels.com/photos/3563625/pexels-photo-3563625.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      duration: '45:20',
      views: '1.8k',
      date: '08/12/2024'
    },
    {
      id: 'dQw4w9WgXcQ',
      title: 'Testemunho - Família Silva',
      description: 'Testemunho emocionante da família Silva sobre transformação de vida',
      thumbnail: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      duration: '12:30',
      views: '890',
      date: '05/12/2024'
    },
    {
      id: 'dQw4w9WgXcQ',
      title: 'Culto Jovem - "Propósito da Juventude"',
      description: 'Mensagem especial para jovens sobre descobrir o propósito de Deus',
      thumbnail: 'https://images.pexels.com/photos/1157255/pexels-photo-1157255.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      duration: '1:20:15',
      views: '3.2k',
      date: '02/12/2024'
    },
    {
      id: 'dQw4w9WgXcQ',
      title: 'Batismo - Dezembro 2024',
      description: 'Cerimônia de batismo com 15 novos membros da família OBPC',
      thumbnail: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
      duration: '35:45',
      views: '1.5k',
      date: '01/12/2024'
    }
  ];

  // Informações da live (em produção, isso seria verificado via API do YouTube)
  const liveInfo = {
    isLive: true,
    title: 'Culto de Domingo ao Vivo - "Esperança que Não Falha"',
    viewers: '127',
    startTime: '09:00',
    videoId: 'dQw4w9WgXcQ' // ID do vídeo da live no YouTube
  };

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const openVideo = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <section id="midia" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mídia
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Assista aos nossos cultos, conferências e momentos especiais. Acompanhe também nossas transmissões ao vivo
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'live'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              🔴 Ao Vivo
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'videos'
                  ? 'bg-blue-800 text-white'
                  : 'text-gray-600 hover:text-blue-800'
              }`}
            >
              📹 Vídeos
            </button>
          </div>
        </div>

        {/* Live Section */}
        {activeTab === 'live' && (
          <div className="mb-12">
            {liveInfo.isLive ? (
              <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
                <div className="bg-red-600 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></div>
                    <span className="font-semibold">AO VIVO</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{liveInfo.viewers} assistindo</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Iniciado às {liveInfo.startTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${liveInfo.videoId}?autoplay=1&mute=1`}
                    title="Live da Igreja"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{liveInfo.title}</h3>
                  <p className="text-gray-600 mb-4">
                    Participe conosco desta transmissão ao vivo e seja abençoado com a Palavra de Deus
                  </p>
                  <a
                    href={`https://youtube.com/watch?v=${liveInfo.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-300"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Assistir no YouTube
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Nenhuma transmissão ao vivo no momento</h3>
                <p className="text-gray-600 mb-6">
                  Fique atento aos nossos horários de culto para não perder nossas próximas transmissões ao vivo
                </p>
                <a
                  href="#cultos"
                  className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  Ver Horários de Cultos
                </a>
              </div>
            )}
          </div>
        )}

        {/* Videos Section */}
        {activeTab === 'videos' && (
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <div className="relative" onClick={() => openVideo(video.id)}>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-red-600 rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                        <Play className="h-8 w-8 text-white fill-current" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{video.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{video.views} visualizações</span>
                      </div>
                      <span>{video.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Carregar Mais Vídeos
              </button>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-6xl w-full">
              <button
                onClick={closeVideo}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                  title="Vídeo da Igreja"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {/* YouTube Channel CTA */}
        <div className="mt-16 bg-red-600 text-white p-8 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Inscreva-se no nosso canal!</h3>
          <p className="text-lg mb-6">
            Não perca nenhum culto ou evento especial. Ative as notificações e seja sempre o primeiro a assistir
          </p>
          <a
            href="https://youtube.com/@obpcfamiliabrasil"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center"
          >
            <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Inscrever-se no YouTube
          </a>
        </div>
      </div>
    </section>
  );
};

export default Media;