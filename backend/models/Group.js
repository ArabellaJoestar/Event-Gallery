import pool from '../config/database.js';

// Function para pegar a data atual no padrão requerido.
const getISODate = () => new Date().toISOString().split('T')[0];

export class Group {
  
  static async create({ name, description, events }) {
    const date_creation = getISODate();
    const sql = `
      INSERT INTO event_groups (name, description, events, date_creation)
      VALUES (?, ?, ?, ?)
    `;
    const params = [name, description, JSON.stringify(events || []), date_creation];
    
    const [result] = await pool.query(sql, params);
    
    //Entrega do novo ID do grupo
    return { id: result.insertId, name, description, events, date_creation };
  }

  static async findAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT 
        g.id, g.name, g.description, g.date_creation, g.events AS event_ids,
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', e.id,
              'name', e.name,
              'description', e.description,
              'images', e.images,
              'documents', e.documents,
              'date_event', e.date_event,
              'date_creation', e.date_creation,
              'principal_photo', e.principal_photo
            )
          )
          FROM events e
          WHERE JSON_CONTAINS(g.events, CAST(e.id AS JSON), '$')
          AND e.date_deletion IS NULL
        ) AS events
      FROM event_groups g
      WHERE g.date_deletion IS NULL
      ORDER BY g.date_creation DESC
      LIMIT ? OFFSET ?
    `;
    
    const [groups] = await pool.query(sql, [limit, offset]);

    //Garantindo que o 'events' é um array de objetos não null(Não mexer!!!)
    return groups.map(g =>({
      ...g,
      events: g.events || []
    }));
  }

  static async findById(id) {
    const sql = `SELECT * FROM event_groups WHERE id = ? AND date_deletion IS NULL`;
    const [rows] = await pool.query(sql, [id]);
    const group = rows[0];

    //Garantindo que os eventos recbidos em group não são null(Não mexer!!!)
    if (group){
      group.events = group.events || [];
    }
    return group;
  }

  static async update(id, { name, description, events }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Pega os dados antigos
      const [rows] = await connection.query("SELECT * FROM event_groups WHERE id = ?", [id]);
      if (rows.length === 0) throw new Error('Grupo não encontrado');
      const oldGroup = rows[0];

      // Prepara os novos dados
      const updatedName = name || oldGroup.name;
      const updatedDescription = description || oldGroup.description;
      const updatedEventsJSON = events ? JSON.stringify(events) : oldGroup.events;

      // Atualiza o grupo
      const updateGroupSQL = `
        UPDATE event_groups SET name = ?, description = ?, events = ? WHERE id = ?
      `;
      await connection.query(updateGroupSQL, [updatedName, updatedDescription, updatedEventsJSON, id]);
      
      // Determina quais eventos mudaram
      const oldEventIds = oldGroup.events || [];
      const newEventIds = events || oldEventIds;

      const addedIds = newEventIds.filter(eId => !oldEventIds.includes(eId));
      const removedIds = oldEventIds.filter(eId => !newEventIds.includes(eId));

      // Associa novos eventos
      if (addedIds.length > 0) {
        const sqlAdd = `UPDATE events SET group_id = ? WHERE id IN (?)`;
        await connection.query(sqlAdd, [id, addedIds]);
      }

      // Remove associação de eventos antigos
      if (removedIds.length > 0) {
        const sqlRemove = `UPDATE events SET group_id = NULL WHERE id IN (?)`;
        await connection.query(sqlRemove, [removedIds]);
      }
      
      // Se tudo deu certo, commita a transação
      await connection.commit();
      return { id, name: updatedName, description: updatedDescription, events: newEventIds };

    } catch (error) {
      // Se algo deu errado, desfaz tudo
      await connection.rollback();
      throw error; // Propaga o erro para o controller
    } finally {
      connection.release(); // Libera a conexão de volta pro pool
    }
  }

  static async softDelete(id) {
    const date_deletion = getISODate();
    const sql = `UPDATE event_groups SET date_deletion = ? WHERE id = ?`;
    const [result] = await pool.query(sql, [date_deletion, id]);
    // Retorna o número de linhas afetadas (0 ou 1)
    return result.affectedRows;
  }
}