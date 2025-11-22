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

//Método de criação de evento
export const createEvent = async (req, res) => {
  try {
    const { name, description, principal_photo, date_event, group_id } = req.body;
    const files = req.files;

    // Validação da entrada para impedir criação de eventos, os quais não sigam os padrões da normalidade do evento.
    if (!name || !files['images'] || files['images'].length === 0 || principal_photo === undefined || !date_event) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes: name, images, principal_photo, date_event.' });
    }
    const regex = /^[\p{L}\p{N} ]+$/u;
    if (!regex.test(name)) {
      return res.status(400).json({ message: 'Nome inválido. Evite caracteres especiais.' });
    }
    // Se a conversão da data não for realizada corretamente invalida a criação do evento por data inválida
    const dateEventObj = new Date(date_event);
    if (isNaN(dateEventObj)) {
      return res.status(400).json({ message: 'Data do evento inválida.' });
    }

    // Processa o envio dos arquivos, como images, documents e videos. Os Paths de cada documento são armazenados no SQL, enquanto os arquivos são guardados em pastas(ou volumes se caso for utilizada a conteinerização)
    const imagePaths = files['images'].map(f => `./assets/images/${f.filename}`);
    const documentPaths = (files['documents'] || []).map(d => `./assets/documents/${d.filename}`);
    const videoPaths = (files['videos'] || []).map(v => `./assets/videos/${v.filename}`);
    
    const principalPhotoIndex = parseInt(principal_photo);
    if (isNaN(principalPhotoIndex) || principalPhotoIndex < 0 || principalPhotoIndex >= imagePaths.length) {
      return res.status(400).json({ message: 'Índice da foto principal inválido.' });
    }

    // Chamando model para criação do evento após validar todos os dados da criação
    const newEvent = await Event.create({
      name, description, principal_photo: principalPhotoIndex,
      date_event, group_id, imagePaths, documentPaths, videoPaths
    });

    res.status(201).json(newEvent);

  } catch (error) {
    console.error('Erro ao criar evento:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

//Método para aquisição de todos os eventos
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll()
    res.json(events);
    
  } catch (error) {
    console.error('Erro ao buscar eventos:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

//Método para aquisição de evento por ID
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

//Método para atualização do evento
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, principal_photo, date_event, group_id } = req.body;
    
    // Adquirindo dados de deleção de documentos
    const removedImages = normalize(req.body.removedImages);
    const removedDocuments = normalize(req.body.removedDocuments);
    const removedVideos = normalize(req.body.removedVideos);

    //Confirmando se evento antes da alteração ainda existe, ou se foi removido durante a requisição de atualização.
    const oldEvent = await Event.findById(id);
    if (!oldEvent) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    //Deletando os arquivos passados na deleção determinada
    deleteFiles(removedImages);
    deleteFiles(removedDocuments);
    deleteFiles(removedVideos);
    
    //Filtrando documentos deletados para os documentos que vão permanecer
    const keptImages = (oldEvent.images || []).filter(i => !removedImages.includes(i));
    const keptDocuments = (oldEvent.documents || []).filter(d => !removedDocuments.includes(d));
    const keptVideos = (oldEvent.videos || []).filter(v => !removedVideos.includes(v));

    //Incluindo novos documentos a serem adicionados
    const newImages = (req.files?.['images'] || []).map(f => `./assets/images/${f.filename}`);
    const newDocuments = (req.files?.['documents'] || []).map(f => `./assets/documents/${f.filename}`);
    const newVideos = (req.files?.['videos'] || []).map(f => `./assets/videos/${f.filename}`);

    //Realizando o spread das imagens, as quais permaneceram no evento e quais foram adicionadas
    const finalImages = [...keptImages, ...newImages];
    const finalDocuments = [...keptDocuments, ...newDocuments];
    const finalVideos = [...keptVideos, ...newVideos];

    //Caso o novo índice para a foto principal seja inválido não permite atualização.
    const updatedPrincipalPhoto = principal_photo !== undefined ? parseInt(principal_photo) : oldEvent.principal_photo;
    if (finalImages.length > 0 && (updatedPrincipalPhoto < 0 || updatedPrincipalPhoto >= finalImages.length)) {
      return res.status(400).json({ message: 'Índice da foto principal inválido' });
    }
    
    const updatedEvent = await Event.update(id, {
      name,
      description,
      principal_photo: updatedPrincipalPhoto,
      date_event,
      group_id,
      finalImages,
      finalDocuments,
      finalVideos
    });

    res.json(updatedEvent);

  } catch (error) {
    console.error('Erro ao atualizar evento:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

//Método para deleção de eventos
//Método não deleta por completo os eventos, o mesmo somente realiza um "soft delete" alterando alterando campo de date_deletion do evento 
//Soft delete é realizado para evitar que exclusões acidentais de eventos levem a perda dos dados.
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
