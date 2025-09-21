import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, FileText, Video } from 'lucide-react';

interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  cloudinaryUrl?: string;
  mimetype: string;
  size: number;
  category: string;
  responsiveUrls?: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
}

interface ImageUploadProps {
  onUpload?: (files: UploadedFile[]) => void;
  onError?: (error: string) => void;
  category?: string;
  configType?: string;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // em MB
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onUpload,
  onError,
  category = 'general',
  configType,
  multiple = false,
  accept = 'image/*',
  maxSize = 10, // 10MB padrão
  maxFiles = 10,
  className = '',
  disabled = false
}: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    
    // Validar número de arquivos
    if (!multiple && fileArray.length > 1) {
      onError?.('Apenas um arquivo é permitido');
      return;
    }
    
    if (fileArray.length > maxFiles) {
      onError?.(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    // Validar tamanho dos arquivos
    const oversizedFiles = fileArray.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      onError?.(`Arquivos muito grandes. Tamanho máximo: ${maxSize}MB`);
      return;
    }

    setSelectedFiles(fileArray);
    
    // Gerar previews para imagens
    const previews: string[] = [];
    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        previews.push(url);
      }
    });
    setPreviewUrls(previews);
  }, [multiple, maxFiles, maxSize, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [disabled, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const removeFile = useCallback((index: number) => {
    const newFiles = selectedFiles.filter((_, i: number) => i !== index);
    const newPreviews = previewUrls.filter((_, i: number) => i !== index);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
    
    // Limpar URLs de objeto para evitar vazamentos de memória
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
  }, [selectedFiles, previewUrls]);

  const uploadFiles = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const uploadedFiles: UploadedFile[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        
        if (configType) {
          formData.append('configType', configType);
        }

        const response = await fetch('/api/uploads', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro no upload');
        }

        const result = await response.json();
        uploadedFiles.push(result.upload);
        
        // Atualizar progresso
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }
      
      // Limpar previews
      previewUrls.forEach((url: string) => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setPreviewUrls([]);
      
      onUpload?.(uploadedFiles);
      
    } catch (error) {
      console.error('Erro no upload:', error);
      onError?.(error instanceof Error ? error.message : 'Erro no upload');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [selectedFiles, category, configType, previewUrls, onUpload, onError]);

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (mimetype.startsWith('video/')) return <Video className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de Drop */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInput}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
        />
        
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium mb-2">
          {isDragOver ? 'Solte os arquivos aqui' : 'Clique ou arraste arquivos aqui'}
        </p>
        <p className="text-sm text-gray-600">
          {accept === 'image/*' ? 'Imagens' : 'Arquivos'} até {maxSize}MB
          {multiple && ` (máximo ${maxFiles} arquivos)`}
        </p>
      </div>

      {/* Lista de Arquivos Selecionados */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Arquivos Selecionados:</h3>
          {selectedFiles.map((file: File, index: number) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              {previewUrls[index] ? (
                <img 
                  src={previewUrls[index]} 
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded">
                  {getFileIcon(file.type)}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-600">{formatFileSize(file.size)}</p>
              </div>
              
              <button
                onClick={() => removeFile(index)}
                className="p-1 text-red-500 hover:text-red-700"
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          {/* Botão de Upload */}
          <button
            onClick={uploadFiles}
            disabled={uploading || selectedFiles.length === 0}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? `Enviando... ${Math.round(uploadProgress)}%` : 'Enviar Arquivos'}
          </button>
          
          {/* Barra de Progresso */}
          {uploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;