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
}

export interface UploadsQuery {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

class UploadService {
  async uploadFile(file: File, category = 'general'): Promise<{
    message: string;
    upload: Upload;
  }> {
    return httpClient.upload('/uploads', file, category);
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

  async getUnusedFiles(): Promise<Upload[]> {
    const response = await this.getUploads({ limit: 1000 });
    return response.data.filter(upload => !upload.isUsed);
  }

  getImageUrl(upload: Upload): string {
    if (upload.url.startsWith('http')) {
      return upload.url;
    }
    return `${httpClient['baseURL'].replace('/api/v1', '')}${upload.url}`;
  }
}

export const uploadService = new UploadService();
