import { httpClient } from './httpClient';

export interface SiteConfig {
  value: string;
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'COLOR' | 'IMAGE' | 'URL';
  category: string;
  description?: string;
}

export interface ConfigsResponse {
  configs: Record<string, SiteConfig>;
  list: Array<{
    id: string;
    key: string;
    value: string;
    type: string;
    category: string;
    description?: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface CreateConfigData {
  key: string;
  value: string;
  type?: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'JSON' | 'COLOR' | 'IMAGE' | 'URL';
  category?: string;
  description?: string;
  isPublic?: boolean;
}

class ConfigService {
  async getConfigs(category?: string, isPublic?: boolean): Promise<ConfigsResponse> {
    const params: Record<string, string> = {};
    
    if (category) params.category = category;
    if (isPublic !== undefined) params.isPublic = isPublic.toString();

    return httpClient.get<ConfigsResponse>('/config', params);
  }

  async getPublicConfigs(): Promise<ConfigsResponse> {
    return httpClient.get<ConfigsResponse>('/config/public');
  }

  async getConfigsByCategory(category: string): Promise<SiteConfig[]> {
    return httpClient.get<SiteConfig[]>(`/config/category/${category}`);
  }

  async updateConfig(key: string, value: string, description?: string): Promise<SiteConfig> {
    return httpClient.put<SiteConfig>(`/config/${key}`, { value, description });
  }

  async updateMultipleConfigs(configs: Record<string, string>): Promise<{ message: string }> {
    return httpClient.put<{ message: string }>('/config/bulk', { configs });
  }

  async createConfig(configData: CreateConfigData): Promise<SiteConfig> {
    return httpClient.post<SiteConfig>('/config', configData);
  }

  async deleteConfig(key: string): Promise<{ message: string }> {
    return httpClient.delete<{ message: string }>(`/config/${key}`);
  }

  // Helper methods for specific config types
  async getThemeColors(): Promise<Record<string, string>> {
    const response = await this.getConfigs('theme');
    const colors: Record<string, string> = {};
    
    Object.entries(response.configs).forEach(([key, config]) => {
      if (config.type === 'COLOR') {
        colors[key] = config.value;
      }
    });
    
    return colors;
  }

  async updateThemeColors(colors: Record<string, string>): Promise<void> {
    await this.updateMultipleConfigs(colors);
  }

  async getChurchInfo(): Promise<Record<string, string>> {
    const response = await this.getConfigs('general');
    const info: Record<string, string> = {};
    
    Object.entries(response.configs).forEach(([key, config]) => {
      info[key] = config.value;
    });
    
    return info;
  }

  async getSocialLinks(): Promise<Record<string, string>> {
    const response = await this.getConfigs('social');
    const links: Record<string, string> = {};
    
    Object.entries(response.configs).forEach(([key, config]) => {
      if (config.type === 'URL') {
        links[key] = config.value;
      }
    });
    
    return links;
  }

  async getHeroSettings(): Promise<Record<string, string>> {
    const response = await this.getConfigs('hero');
    const settings: Record<string, string> = {};
    
    Object.entries(response.configs).forEach(([key, config]) => {
      settings[key] = config.value;
    });
    
    return settings;
  }
}

export const configService = new ConfigService();
