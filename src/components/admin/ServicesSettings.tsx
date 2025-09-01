import { useState } from 'react';
import { Save, Plus, Trash2, Upload } from 'lucide-react';
import { SiteConfig, ServiceItem } from '../../types';

interface ServicesSettingsProps {
  config: SiteConfig['services'];
  onSave: (config: Partial<SiteConfig>) => void;
  onChange: () => void;
}

const ServicesSettings = ({ config, onSave, onChange }: ServicesSettingsProps) => {
  const [formData, setFormData] = useState(config);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onChange();
  };

  const handleServiceChange = (index: number, field: string, value: string) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData(prev => ({ ...prev, items: updatedItems }));
    onChange();
  };

  const handleServiceImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleServiceChange(index, 'image', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addService = () => {
    const newService: ServiceItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      icon: 'Star'
    };
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newService]
    }));
    onChange();
  };

  const removeService = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, items: updatedItems }));
    onChange();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ services: formData });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Configurações dos Serviços</h2>
        <button
          onClick={handleSubmit}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título da Seção
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nossos Serviços"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Serviços</h3>
            <button
              type="button"
              onClick={addService}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Serviço
            </button>
          </div>

          {formData.items.map((service, index) => (
            <div key={service.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-md font-medium text-gray-900">Serviço {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Título do serviço"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ícone
                  </label>
                  <input
                    type="text"
                    value={service.icon}
                    onChange={(e) => handleServiceChange(index, 'icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do ícone (ex: Church, Users)"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={service.description}
                    onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descrição do serviço"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem (opcional)
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleServiceImageUpload(index, e)}
                        className="hidden"
                        id={`service-image-upload-${index}`}
                      />
                      <label
                        htmlFor={`service-image-upload-${index}`}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Escolher Imagem
                      </label>
                      <span className="text-sm text-gray-500">ou</span>
                      <input
                        type="text"
                        value={service.image || ''}
                        onChange={(e) => handleServiceChange(index, 'image', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="URL da imagem"
                      />
                    </div>

                    {service.image && (
                      <div className="mt-3">
                        <img
                          src={service.image}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-md border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default ServicesSettings;
