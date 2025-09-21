import ImageUpload from './components/ImageUpload';

function App() {
  const handleUploadSuccess = (files: any[]) => {
    console.log('Arquivos enviados com sucesso:', files);
    // Aqui você pode atualizar o estado da aplicação, mostrar notificação, etc.
  };

  const handleUploadError = (error: string) => {
    console.error('Erro no upload:', error);
    // Aqui você pode mostrar uma notificação de erro
    alert(`Erro no upload: ${error}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Sistema de Upload - Igreja
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upload de Imagens</h2>
          
          <ImageUpload
            category="gallery"
            multiple={true}
            maxSize={10}
            maxFiles={5}
            onUpload={handleUploadSuccess}
            onError={handleUploadError}
            className="mb-6"
          />
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Exemplo de Upload para Configurações</h3>
            <ImageUpload
              category="config"
              configType="hero"
              multiple={false}
              maxSize={5}
              onUpload={handleUploadSuccess}
              onError={handleUploadError}
              accept="image/*"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;