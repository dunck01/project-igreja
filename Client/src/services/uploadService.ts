import { httpClient, PaginatedResponse } from './httpClient';

export interface Upload {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  category?: string;
  isUsed: boolean;
  createdAt: string;
  // Campos adicionais do Cloudinary
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
  width?: number;
  height?: number;
  format?: string;
  responsiveUrls?: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
}

export interface UploadsQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

class UploadService {
  async uploadFile(file: File, category = 'general', configType?: string): Promise<{
    message: string;
    upload: Upload;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    
    if (configType) {
      formData.append('configType', configType);
    }

    try {
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

      return response.json();
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  }

  async getUploads(query: UploadsQuery = {}): Promise<PaginatedResponse<Upload>> {
    const params: Record<string, string> = {};
    
    if (query.page) params.page = query.page.toString();
    if (query.limit) params.limit = query.limit.toString();
    if (query.category) params.category = query.category;
    if (query.search) params.search = query.search;

    return httpClient.get<PaginatedResponse<Upload>>('/uploads', params);
  }

  async deleteUpload(id: string): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>(`/uploads/${id}`);
  }

  async markAsUsed(id: string, isUsed: boolean): Promise<Upload> {
    return httpClient.patch<Upload>(`/uploads/${id}/used`, { isUsed });
  }

  /**
   * Gerar URL otimizada do Cloudinary
   */
  generateOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: 'fill' | 'fit' | 'scale' | 'limit';
      quality?: 'auto' | number;
      format?: 'auto' | 'webp' | 'jpg' | 'png';
    } = {}
  ): string {
    if (!publicId) return '';
    
    const { width, height, crop = 'limit', quality = 'auto', format = 'auto' } = options;
    
    let transformations = [];
    
    if (width || height) {
      let resize = '';
      if (width) resize += `w_${width}`;
      if (height) resize += `,h_${height}`;
      if (crop) resize += `,c_${crop}`;
      transformations.push(resize);
    }
    
    if (quality) {
      transformations.push(`q_${quality}`);
    }
    
    if (format) {
      transformations.push(`f_${format}`);
    }
    
    const transformationString = transformations.length > 0 
      ? `/${transformations.join(',')}` 
      : '';
    
    return `https://res.cloudinary.com/dsu1s516j/image/upload${transformationString}/${publicId}`;
  }

  /**
   * Gerar URLs responsivas
   */
  generateResponsiveUrls(publicId: string): {
    thumbnail: string;
    small: string;
    medium: string;
    large: string;
    original: string;
  } {
    return {
      thumbnail: this.generateOptimizedUrl(publicId, { width: 150, height: 150, crop: 'fill' }),
      small: this.generateOptimizedUrl(publicId, { width: 400, height: 300, crop: 'limit' }),
      medium: this.generateOptimizedUrl(publicId, { width: 800, height: 600, crop: 'limit' }),
      large: this.generateOptimizedUrl(publicId, { width: 1920, height: 1080, crop: 'limit' }),
      original: this.generateOptimizedUrl(publicId),
    };
  }

  // Helper methods
  async getImagesByCategory(category: string): Promise<Upload[]> {
    const response = await this.getUploads({ 
      category, 
      limit: 100 
    });
    
    return response.data.filter(upload => 
      upload.mimetype.startsWith('image/')
    );
  }

  getImageUrl(upload: Upload): string {
    if (upload.url.startsWith('http')) {
      return upload.url;
    }
    return `${httpClient['baseURL'].replace('/api/v1', '')}${upload.url}`;
  }

  async getUnusedFiles(): Promise<Upload[]> {
    const response = await this.getUploads({ limit: 1000 });
    return response.data.filter(upload => !upload.isUsed);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export const uploadService = new UploadService();
export default uploadService;
