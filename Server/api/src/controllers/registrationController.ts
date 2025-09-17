import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createRegistration = async (req: AuthRequest, res: Response) => {
  try {
    const {
      eventId,
      name,
      email,
      phone,
      organization,
      dietaryRestrictions,
      accessibilityNeeds,
      customData
    } = req.body;

    // Verificar se o evento existe e está ativo
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    });

    if (!event || !event.isActive) {
      res.status(404).json({ error: 'Evento não encontrado ou inativo' });
      return;
    }

    // Verificar capacidade
    if (event._count.registrations >= event.capacity) {
      res.status(400).json({ error: 'Evento lotado' });
      return;
    }

    // Verificar se já existe inscrição com o mesmo email para este evento
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        eventId,
        email
      }
    });

    if (existingRegistration) {
      res.status(400).json({ error: 'Já existe uma inscrição com este e-mail para este evento' });
      return;
    }

    const registration = await prisma.registration.create({
      data: {
        eventId,
        name,
        email,
        phone,
        organization,
        dietaryRestrictions,
        accessibilityNeeds,
        customData: customData ? JSON.stringify(customData) : null,
        status: 'CONFIRMED'
      },
      include: {
        event: {
          select: {
            title: true,
            date: true,
            time: true,
            location: true
          }
        }
      }
    });

    // Atualizar contador de inscrições
    await prisma.event.update({
      where: { id: eventId },
      data: {
        currentRegistrations: {
          increment: 1
        }
      }
    });

    res.status(201).json({
      message: 'Inscrição realizada com sucesso',
      registration
    });
  } catch (error) {
    console.error('Erro ao criar inscrição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getRegistrations = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      page = '1', 
      limit = '10', 
      eventId, 
      status,
      search 
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const where: any = {};
    
    if (eventId) {
      where.eventId = eventId;
    }
    
    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [registrations, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        include: {
          event: {
            select: {
              title: true,
              date: true,
              time: true,
              location: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit as string)
      }),
      prisma.registration.count({ where })
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
    console.error('Erro ao buscar inscrições:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const updateRegistrationStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: { event: true }
    });

    if (!registration) {
      res.status(404).json({ error: 'Inscrição não encontrada' });
      return;
    }

    const updatedRegistration = await prisma.registration.update({
      where: { id },
      data: { status },
      include: {
        event: {
          select: {
            title: true,
            date: true,
            time: true,
            location: true
          }
        }
      }
    });

    res.json(updatedRegistration);
  } catch (error) {
    console.error('Erro ao atualizar status da inscrição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deleteRegistration = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const registration = await prisma.registration.findUnique({
      where: { id }
    });

    if (!registration) {
      res.status(404).json({ error: 'Inscrição não encontrada' });
      return;
    }

    await prisma.registration.delete({
      where: { id }
    });

    // Decrementar contador de inscrições
    await prisma.event.update({
      where: { id: registration.eventId },
      data: {
        currentRegistrations: {
          decrement: 1
        }
      }
    });

    res.json({ message: 'Inscrição excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir inscrição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getRegistrationById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            title: true,
            date: true,
            time: true,
            location: true
          }
        }
      }
    });

    if (!registration) {
      res.status(404).json({ error: 'Inscrição não encontrada' });
      return;
    }

    res.json(registration);
  } catch (error) {
    console.error('Erro ao buscar inscrição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const exportRegistrations = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.query;

    const where: any = {};
    if (eventId) {
      where.eventId = eventId;
    }

    const registrations = await prisma.registration.findMany({
      where,
      include: {
        event: {
          select: {
            title: true,
            date: true,
            time: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Converter para CSV
    const headers = [
      'Nome',
      'Email',
      'Telefone',
      'Organização',
      'Restrições Alimentares',
      'Necessidades de Acessibilidade',
      'Status',
      'Evento',
      'Data do Evento',
      'Data da Inscrição'
    ];

    const csvData = registrations.map((reg: any) => [
      reg.name,
      reg.email,
      reg.phone,
      reg.organization || '',
      reg.dietaryRestrictions || '',
      reg.accessibilityNeeds || '',
      reg.status,
      reg.event.title,
      new Date(reg.event.date).toLocaleDateString('pt-BR'),
      new Date(reg.createdAt).toLocaleDateString('pt-BR')
    ]);

    const csv = [headers, ...csvData]
      .map(row => row.map((field: any) => `"${field}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inscricoes.csv');
    res.send(csv);
  } catch (error) {
    console.error('Erro ao exportar inscrições:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
