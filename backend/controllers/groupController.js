import { Group } from '../models/Group.js';

// Normalizaçaõ dos dados
const normalize = (data) => {
  if (!data) return [];
  if (typeof data === 'string') {
    try { return JSON.parse(data); } catch { return [data]; }
  }
  return Array.isArray(data) ? data : [];
};

//Método para criação de grupos
export const createGroup = async (req, res) => {
  try {
    const { name, description, events } = req.body;

    //Checagem simples se criação de grupo contém o parâmetro obrigatório de nome
    if (!name) {
      return res.status(400).json({ message: 'Campos obrigatórios ausentes: name' });
    }

    //Valida se o nome do grupo possui caracteres especiais
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

//Método para aquisição de todos os grupos
export const getAllGroups = async (req, res) => {
  try {
    
    const groups = await Group.findAll();
    console.log(groups)
    res.json(groups);

  } catch (error) {
    console.error('Erro ao buscar grupos:', error.message);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

//Método de aquisição de grupo específico por ID
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

//Método de atualização de grupo
export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, description, events } = req.body;

    //Atualiza o grupo com os dados recebidos
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

//Realiza um soft delete no grupo para evitar perda completa dos dados.
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