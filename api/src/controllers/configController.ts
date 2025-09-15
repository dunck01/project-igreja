import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getConfigs = async (req: AuthRequest, res: Response) => {
  try {
    const { category, isPublic } = req.query;

    const where: any = {};
    
    if (category) {
      where.category = category;
    }
    
    // Se não for admin, só mostrar configs públicas
    if (!req.user || req.user.role !== 'ADMIN') {
      where.isPublic = true;
    } else if (isPublic !== undefined) {
      where.isPublic = isPublic === 'true';
    }

    const configs = await prisma.siteConfig.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { key: 'asc' }
      ]
    });

    // Converter para formato key-value para facilitar uso no frontend
    const configsMap = configs.reduce((acc: any, config) => {
      acc[config.key] = {
        value: config.value,
        type: config.type,
        category: config.category,
        description: config.description
      };
      return acc;
    }, {});

    res.json({
      configs: configsMap,
      list: configs
    });
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const updateConfig = async (req: AuthRequest, res: Response) => {
  try {
    const { key } = req.params;
    const { value, description } = req.body;

    if (!key) {
      res.status(400).json({ error: 'Chave é obrigatória' });
      return;
    }

    const config = await prisma.siteConfig.upsert({
      where: { key },
      update: { 
        value, 
        description: description || undefined,
        updatedAt: new Date()
      },
      create: {
        key,
        value,
        type: 'TEXT', // tipo padrão
        category: 'general',
        description
      }
    });

    res.json(config);
  } catch (error) {
    console.error('Erro ao atualizar configuração:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const updateMultipleConfigs = async (req: AuthRequest, res: Response) => {
  try {
    const { configs } = req.body;

    const updates = Object.entries(configs).map(([key, value]) => 
      prisma.siteConfig.upsert({
        where: { key },
        update: { 
          value: value as string,
          updatedAt: new Date()
        },
        create: {
          key,
          value: value as string,
          type: 'TEXT',
          category: 'general'
        }
      })
    );

    await Promise.all(updates);

    res.json({ message: 'Configurações atualizadas com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar múltiplas configurações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getConfigsByCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.params;

    const configs = await prisma.siteConfig.findMany({
      where: { category },
      orderBy: { key: 'asc' }
    });

    res.json(configs);
  } catch (error) {
    console.error('Erro ao buscar configurações por categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const createConfig = async (req: AuthRequest, res: Response) => {
  try {
    const {
      key,
      value,
      type = 'TEXT',
      category = 'general',
      description,
      isPublic = true
    } = req.body;

    const config = await prisma.siteConfig.create({
      data: {
        key,
        value,
        type,
        category,
        description,
        isPublic
      }
    });

    res.status(201).json(config);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      res.status(400).json({ error: 'Chave de configuração já existe' });
      return;
    }
    console.error('Erro ao criar configuração:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deleteConfig = async (req: AuthRequest, res: Response) => {
  try {
    const { key } = req.params;

    await prisma.siteConfig.delete({
      where: { key }
    });

    res.json({ message: 'Configuração excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir configuração:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
