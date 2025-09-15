import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getEvents = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      category, 
      featured,
      active = 'true'
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const where: any = {};
    
    if (active === 'true') {
      where.isActive = true;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (featured === 'true') {
      where.isFeatured = true;
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          eventImages: true,
          _count: {
            select: { registrations: true }
          }
        },
        orderBy: [
          { isFeatured: 'desc' },
          { date: 'asc' }
        ],
        skip,
        take: parseInt(limit as string)
      }),
      prisma.event.count({ where })
    ]);

    res.json({
      events,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getEventBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;

    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        eventImages: true,
        _count: {
          select: { registrations: true }
        }
      }
    });

    if (!event || !event.isActive) {
      res.status(404).json({ error: 'Evento não encontrado' });
      return;
    }

    res.json(event);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      shortDescription,
      date,
      time,
      location,
      category,
      capacity,
      price = 0,
      isFeatured = false,
      tags = []
    } = req.body;

    // Gerar slug único
    let slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    // Verificar se slug já existe
    let existingEvent = await prisma.event.findUnique({ where: { slug } });
    let counter = 1;
    
    while (existingEvent) {
      slug = `${slug}-${counter}`;
      existingEvent = await prisma.event.findUnique({ where: { slug } });
      counter++;
    }

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        shortDescription,
        date: new Date(date),
        time,
        location,
        category,
        capacity: parseInt(capacity),
        price: parseFloat(price),
        isFeatured,
        tags: JSON.stringify(tags)
      },
      include: {
        eventImages: true
      }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Se o título foi alterado, gerar novo slug
    if (updateData.title) {
      let slug = updateData.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      const existingEvent = await prisma.event.findUnique({ where: { slug } });
      if (existingEvent && existingEvent.id !== id) {
        slug = `${slug}-${Date.now()}`;
      }
      updateData.slug = slug;
    }

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    if (updateData.tags) {
      updateData.tags = JSON.stringify(updateData.tags);
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        eventImages: true
      }
    });

    res.json(event);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id }
    });

    res.json({ message: 'Evento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getEventRegistrations = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [registrations, total] = await Promise.all([
      prisma.registration.findMany({
        where: { eventId: id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string)
      }),
      prisma.registration.count({ where: { eventId: id } })
    ]);

    res.json({
      registrations,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Erro ao buscar inscrições do evento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
