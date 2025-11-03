import { Event } from '../models/Event.js';
import path from 'path';
import fs from 'fs';

// Normalizaçaõ dos dados
const normalize = (data) => {
  if (!data) return [];
  if (typeof data === 'string') {
    try { return JSON.parse(data); } catch { return [data]; }
  }
  return Array.isArray(data) ? data : [];
};

// Deleção de arquivos para sincronização a com remoção da base de dados
const deleteFiles = (filePaths) => {
  filePaths.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlink(fullPath, (err) => {
        if (err) console.error(`Erro ao deletar arquivo: ${fullPath}`, err);
      });
    }
  });
};


export const createEvent = async (req, res) => {
  try {
    const { name, description, principal_photo, date_event, group_id } = req.body;
    const files = req.files;

    // --- Validação de Entrada ---
    if (!name || !files['images'] || files['images'].length === 0 || principal_photo === undefined || !date_event) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes: name, images, principal_photo, date_event.' });
    }
    const regex = /^[\p{L}\p{N} ]+$/u;
    if (!regex.test(name)) {
      return res.status(400).json({ message: 'Nome inválido. Evite caracteres especiais.' });
    }
    const dateEventObj = new Date(date_event);
    if (isNaN(dateEventObj)) {
      return res.status(400).json({ message: 'Data do evento inválida.' });
    }

    // --- Processamento de Arquivos ---
    const imagePaths = files['images'].map(f => `./assets/images/${f.filename}`);
    const documentPaths = (files['documents'] || []).map(d => `./assets/documents/${d.filename}`);
    
    const principalPhotoIndex = parseInt(principal_photo);
    if (isNaN(principalPhotoIndex) || principalPhotoIndex < 0 || principalPhotoIndex >= imagePaths.length) {
      return res.status(400).json({ message: 'Índice da foto principal inválido.' });
    }

    // --- Chamada ao Model ---
    // O Model agora cuida da transação (criar evento E atualizar grupo)
    const newEvent = await Event.create({
      name, description, principal_photo: principalPhotoIndex,
      date_event, group_id, imagePaths, documentPaths
    });

    res.status(201).json(newEvent);

  } catch (error) {
    console.error('Erro ao criar evento:', error.message);
    // TODO: Deletar arquivos salvos se o banco de dados falhar
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const events = await Event.findAll(page, limit);
    res.json(events);
    
  } catch (error) {
    console.error('Erro ao buscar eventos:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    res.json(event);

  } catch (error) {
    console.error('Erro ao buscar evento:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, principal_photo, date_event, group_id } = req.body;
    
    // --- Lógica de arquivos (permanece no controller) ---
    const removedImages = normalize(req.body.removedImages);
    const removedDocuments = normalize(req.body.removedDocuments);

    const oldEvent = await Event.findById(id);
    if (!oldEvent) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    // Deleta os arquivos removidos
    deleteFiles(removedImages);
    deleteFiles(removedDocuments);
    
    // Filtra os arquivos antigos
    const keptImages = (oldEvent.images || []).filter(i => !removedImages.includes(i));
    const keptDocuments = (oldEvent.documents || []).filter(d => !removedDocuments.includes(d));

    // Adiciona os novos
    const newImages = (req.files?.['images'] || []).map(f => `./assets/images/${f.filename}`);
    const newDocuments = (req.files?.['documents'] || []).map(f => `./assets/documents/${f.filename}`);

    const finalImages = [...keptImages, ...newImages];
    const finalDocuments = [...keptDocuments, ...newDocuments];

    // Validação da foto principal
    const updatedPrincipalPhoto = principal_photo !== undefined ? parseInt(principal_photo) : oldEvent.principal_photo;
    if (finalImages.length > 0 && (updatedPrincipalPhoto < 0 || updatedPrincipalPhoto >= finalImages.length)) {
      return res.status(400).json({ message: 'Índice da foto principal inválido' });
    }
    
    // --- Chamada ao Model ---
    const updatedEvent = await Event.update(id, {
      name, description, 
      principal_photo: updatedPrincipalPhoto,
      date_event, 
      group_id,
      finalImages, 
      finalDocuments
    });

    res.json(updatedEvent);

  } catch (error) {
    console.error('Erro ao atualizar evento:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Event.softDelete(id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }
    res.json({ message: 'Evento deletado com sucesso', id });

  } catch (error) {
    console.error('Erro ao deletar evento:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};