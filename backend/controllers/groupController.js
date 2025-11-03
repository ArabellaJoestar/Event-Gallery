// controllers/groupController.js
import { Group } from '../models/Group.js';

// Função auxiliar (movida do seu index)
const normalize = (data) => {
  if (!data) return [];
  if (typeof data === 'string') {
    try { return JSON.parse(data); } catch { return [data]; }
  }
  return Array.isArray(data) ? data : [];
};

export const createGroup = async (req, res) => {
  try {
    const { name, description, events } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes: name' });
    }

    // Sua validação regex
    const regex = /^[\p{L}\p{N} ]+$/u;
    if (!regex.test(name)) {
      return res.status(400).json({ message: 'Nome inválido. Evite caracteres especiais.' });
    }

    const newGroup = await Group.create({ name, description, events: normalize(events) });
    res.status(201).json(newGroup);

  } catch (error) {
    console.error('Erro ao criar grupo:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // A lógica complexa de join/parse agora está no Model
    const groups = await Group.findAll(page, limit);
    res.json(groups);

  } catch (error) {
    console.error('Erro ao buscar grupos:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);
    
    if (!group) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }
    res.json(group);

  } catch (error) {
    console.error('Erro ao buscar grupo:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, description, events } = req.body;

    // O Model agora cuida da transação complexa
    const updatedGroup = await Group.update(id, { 
      name, 
      description, 
      events: normalize(events) 
    });

    res.json(updatedGroup);

  } catch (error)
    {
    console.error('Erro ao atualizar grupo:', error.message);
    if (error.message === 'Grupo não encontrado') {
        return res.status(404).json({ message: 'Grupo não encontrado.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Group.softDelete(id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }
    res.json({ message: 'Grupo deletado com sucesso', id });

  } catch (error) {
    console.error('Erro ao deletar grupo:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};