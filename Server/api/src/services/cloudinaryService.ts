import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadOptions {
  folder?: string;
  public_id?: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  transformation?: any[];
  tags?: string[];
}

interface UploadResult {
  public_id: string;
  url: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  bytes: number;
  created_at: string;
}

class CloudinaryService {
  /**
   * Upload de arquivo usando buffer
   */
  async uploadFromBuffer(
    buffer: Buffer, 
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: 'auto' as const,
        folder: 'igreja-uploads',
        use_filename: true,
        unique_filename: true,
        ...options,
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result as UploadResult);
          }
        }
      );

      const stream = Readable.from(buffer);
      stream.pipe(uploadStream);
    });
  }

  /**
   * Upload de imagem com otimizações específicas
   */
  async uploadImage(
    buffer: Buffer,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const imageOptions = {
      resource_type: 'image' as const,
      folder: 'igreja-uploads/images',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' },
        { width: 1920, height: 1080, crop: 'limit' }
      ],
      ...options,
    };

    return this.uploadFromBuffer(buffer, imageOptions);
  }

  /**
   * Upload de arquivo para galeria
   */
  async uploadGalleryImage(
    buffer: Buffer,
    category: string = 'general'
  ): Promise<UploadResult> {
    return this.uploadImage(buffer, {
      folder: `igreja-uploads/gallery/${category}`,
      tags: ['gallery', category],
    });
  }

  /**
   * Upload de imagem de configuração (hero, about, etc.)
   */
  async uploadConfigImage(
    buffer: Buffer,
    configType: string
  ): Promise<UploadResult> {
    return this.uploadImage(buffer, {
      folder: `igreja-uploads/config/${configType}`,
      tags: ['config', configType],
    });
  }

  /**
   * Deletar arquivo do Cloudinary
   */
  async deleteFile(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      throw new Error(`Erro ao deletar arquivo: ${error}`);
    }
  }

  /**
   * Listar arquivos de uma pasta
   */
  async listFiles(folder: string, maxResults: number = 100): Promise<any> {
    try {
      const result = await cloudinary.search
        .expression(`folder:${folder}`)
        .max_results(maxResults)
        .sort_by('created_at', 'desc')
        .execute();
      
      return result;
    } catch (error) {
      throw new Error(`Erro ao listar arquivos: ${error}`);
    }
  }

  /**
   * Gerar URL otimizada para uma imagem
   */
  generateOptimizedUrl(
    publicId: string,
    options: {
      width?: number;
      height?: number;
      crop?: string;
      quality?: string;
      format?: string;
    } = {}
  ): string {
    return cloudinary.url(publicId, {
      quality: 'auto',
      fetch_format: 'auto',
      ...options,
    });
  }

  /**
   * Gerar múltiplas versões de uma imagem (responsivo)
   */
  generateResponsiveUrls(publicId: string): {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  } {
    return {
      thumbnail: this.generateOptimizedUrl(publicId, { width: 300, height: 200, crop: 'fill' }),
      medium: this.generateOptimizedUrl(publicId, { width: 800, height: 600, crop: 'limit' }),
      large: this.generateOptimizedUrl(publicId, { width: 1920, height: 1080, crop: 'limit' }),
      original: this.generateOptimizedUrl(publicId),
    };
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;