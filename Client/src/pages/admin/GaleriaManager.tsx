import { useState, useEffect, useRef } from 'react';
import { 
  Camera, Plus, Upload, Search, Filter, Grid3X3, List, 
  Edit, Trash2, Eye, Download, Share2, FolderPlus, 
  X, Save, AlertCircle, ImageIcon, Video, Music, FileText,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw
} from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  type: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
  category?: string;
  duration?: string;
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Album {
  id: string;
  name: string;
  description: string;
  cover?: string;
  itemCount: number;
}

const GaleriaManager = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMediaItems();
    loadAlbums();
  }, []);

  useEffect(() => {
    filterItems();
  }, [mediaItems, searchTerm, filterType, filterCategory]);

  const loadMediaItems = async () => {
    try {
      const response = await fetch('/api/v1/media');
      if (response.ok) {
        const data = await response.json();
        setMediaItems(data);
      }
    } catch (error) {
      console.error('Erro ao carregar itens de mídia:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar galeria' });
    } finally {
      setLoading(false);
    }
  };

  const loadAlbums = async () => {
    // Simulação - implementar quando tiver rota de álbuns
    setAlbums([
      { id: '1', name: 'Eventos 2024', description: 'Fotos dos eventos do ano', cover: '', itemCount: 25 },
      { id: '2', name: 'Cultos Especiais', description: 'Momentos especiais dos cultos', cover: '', itemCount: 12 },
      { id: '3', name: 'Batismos', description: 'Cerimônias de batismo', cover: '', itemCount: 8 }
    ]);
  };

  const filterItems = () => {
    let filtered = mediaItems;

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    setFilteredItems(filtered);
  };

  const handleFileUpload = async (files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/v1/uploads/multiple', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `${files.length} arquivo(s) enviado(s) com sucesso!` });
        loadMediaItems();
        setShowUploadModal(false);
      } else {
        setMessage({ type: 'error', text: 'Erro ao fazer upload dos arquivos' });
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      setMessage({ type: 'error', text: 'Erro ao fazer upload dos arquivos' });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handlePreview = (item: MediaItem, index: number) => {
    setPreviewItem(item);
    setCurrentIndex(index);
    setShowPreviewModal(true);
  };

  const navigatePreview = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + filteredItems.length) % filteredItems.length
      : (currentIndex + 1) % filteredItems.length;
    
    setCurrentIndex(newIndex);
    setPreviewItem(filteredItems[newIndex]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este item?')) return;

    try {
      const response = await fetch(`/api/v1/media/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Item deletado com sucesso!' });
        loadMediaItems();
      } else {
        setMessage({ type: 'error', text: 'Erro ao deletar item' });
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      setMessage({ type: 'error', text: 'Erro ao deletar item' });
    }
  };

  const handleEdit = (id: string) => {
    const item = mediaItems.find(item => item.id === id);
    if (item) {
      const newTitle = prompt('Novo título:', item.title);
      const newDescription = prompt('Nova descrição:', item.description || '');
      
      if (newTitle !== null) {
        // Simular atualização - implementar chamada da API
        setMediaItems(prev => 
          prev.map(prevItem => 
            prevItem.id === id 
              ? { ...prevItem, title: newTitle, description: newDescription || '' }
              : prevItem
          )
        );
        setMessage({ type: 'success', text: 'Item atualizado com sucesso!' });
      }
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE': return <ImageIcon className="w-4 h-4" />;
      case 'VIDEO': return <Video className="w-4 h-4" />;
      case 'AUDIO': return <Music className="w-4 h-4" />;
      case 'DOCUMENT': return <FileText className="w-4 h-4" />;
      default: return <ImageIcon className="w-4 h-4" />;
    }
  };

  const categories = ['all', 'eventos', 'cultos', 'batismos', 'casamentos', 'ministerios'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Camera className="w-8 h-8" />
            Galeria de Mídia
          </h1>
          <p className="text-gray-600">
            {filteredItems.length} de {mediaItems.length} itens
            {selectedItems.length > 0 && ` • ${selectedItems.length} selecionados`}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowAlbumModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            Novo Álbum
          </button>
          
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adicionar Mídia
          </button>
        </div>
      </div>

      {/* Mensagem de feedback */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <AlertCircle className="w-5 h-5" />
          {message.text}
          <button
            onClick={() => setMessage(null)}
            className="ml-auto p-1 hover:bg-white hover:bg-opacity-20 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Controles de filtro e busca */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por título ou descrição..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-3">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="all">Todos os tipos</option>
              <option value="IMAGE">Imagens</option>
              <option value="VIDEO">Vídeos</option>
              <option value="AUDIO">Áudios</option>
              <option value="DOCUMENT">Documentos</option>
            </select>

            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Todas as categorias</option>
              {categories.slice(1).map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            {/* Toggle de visualização */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'} hover:bg-gray-100 rounded-l-lg`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'} hover:bg-gray-100 rounded-r-lg`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Álbuns em destaque */}
      {albums.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Álbuns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {albums.map(album => (
              <div key={album.id} className="group cursor-pointer">
                <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden relative">
                  {album.cover ? (
                    <img 
                      src={album.cover} 
                      alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
                </div>
                <h3 className="font-medium text-gray-900 truncate">{album.name}</h3>
                <p className="text-sm text-gray-600">{album.itemCount} itens</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grade/Lista de mídia */}
      <div className="bg-white rounded-lg shadow">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {mediaItems.length === 0 ? 'Nenhuma mídia encontrada' : 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-gray-600 mb-4">
              {mediaItems.length === 0 
                ? 'Comece fazendo upload das primeiras imagens'
                : 'Tente ajustar os filtros de busca'
              }
            </p>
            {mediaItems.length === 0 && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar Primeira Mídia
              </button>
            )}
          </div>
        ) : (
          <div className="p-6">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {filteredItems.map((item, index) => (
                  <div key={item.id} className="group relative">
                    <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative cursor-pointer">
                      {item.type === 'IMAGE' ? (
                        <img
                          src={item.thumbnail || item.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onClick={() => handlePreview(item, index)}
                        />
                      ) : (
                        <div 
                          className="w-full h-full flex flex-col items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-colors"
                          onClick={() => handlePreview(item, index)}
                        >
                          {getTypeIcon(item.type)}
                          <span className="text-xs text-gray-600 mt-1 text-center px-1 truncate w-full">
                            {item.title}
                          </span>
                        </div>
                      )}
                      
                      {/* Overlay com ações */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handlePreview(item, index); }}
                            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleEdit(item.id); }}
                            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                            className="p-2 bg-red-500 bg-opacity-70 hover:bg-opacity-90 rounded-lg text-white transition-colors"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Checkbox de seleção */}
                      <div className="absolute top-2 left-2">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleSelection(item.id)}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>

                      {/* Badge do tipo */}
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded flex items-center gap-1">
                          {getTypeIcon(item.type)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <h3 className="font-medium text-gray-900 text-sm truncate" title={item.title}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Visualização em lista */
              <div className="space-y-2">
                {filteredItems.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg group">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelection(item.id)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                    
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.type === 'IMAGE' ? (
                        <img
                          src={item.thumbnail || item.url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getTypeIcon(item.type)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{item.type.toLowerCase()}</span>
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        <span>{item.viewCount} visualizações</span>
                        {item.category && <span className="px-2 py-1 bg-gray-100 rounded text-xs">{item.category}</span>}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handlePreview(item, index)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Adicionar Mídia</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Zona de drop */}
              <div
                ref={dropZoneRef}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Arraste arquivos aqui ou clique para selecionar
                </h3>
                <p className="text-gray-600">
                  Suporta imagens, vídeos, áudios e documentos
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Múltiplos arquivos • Máximo 10MB por arquivo
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Preview */}
      {showPreviewModal && previewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
          <div className="max-w-5xl w-full h-full flex flex-col">
            {/* Header do preview */}
            <div className="flex justify-between items-center p-4 text-white">
              <div>
                <h2 className="text-xl font-bold">{previewItem.title}</h2>
                <p className="text-gray-300">
                  {currentIndex + 1} de {filteredItems.length}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conteúdo do preview */}
            <div className="flex-1 flex items-center justify-center relative">
              {previewItem.type === 'IMAGE' ? (
                <img
                  src={previewItem.url}
                  alt={previewItem.title}
                  className="max-w-full max-h-full object-contain"
                />
              ) : previewItem.type === 'VIDEO' ? (
                <video
                  src={previewItem.url}
                  controls
                  className="max-w-full max-h-full"
                >
                  Seu navegador não suporta vídeo.
                </video>
              ) : (
                <div className="text-white text-center">
                  <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-white bg-opacity-20 rounded-lg">
                    {getTypeIcon(previewItem.type)}
                  </div>
                  <h3 className="text-lg font-medium mb-2">{previewItem.title}</h3>
                  <p className="text-gray-300">{previewItem.description}</p>
                </div>
              )}

              {/* Navegação */}
              {filteredItems.length > 1 && (
                <>
                  <button
                    onClick={() => navigatePreview('prev')}
                    className="absolute left-4 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => navigatePreview('next')}
                    className="absolute right-4 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Informações do item */}
            <div className="p-4 text-white">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Tipo:</span>
                  <span className="ml-2">{previewItem.type}</span>
                </div>
                <div>
                  <span className="text-gray-400">Categoria:</span>
                  <span className="ml-2">{previewItem.category || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Visualizações:</span>
                  <span className="ml-2">{previewItem.viewCount}</span>
                </div>
                <div>
                  <span className="text-gray-400">Data:</span>
                  <span className="ml-2">{new Date(previewItem.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {previewItem.description && (
                <p className="mt-2 text-gray-300">{previewItem.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriaManager;