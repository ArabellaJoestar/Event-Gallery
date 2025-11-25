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

    return { id: result.insertId, name, description, events, date_creation };
  }

  static async findAll() {

  const sql = `
    SELECT *
    FROM event_groups
    WHERE date_deletion IS NULL
    ORDER BY date_creation DESC
  `;

  const [groups] = await pool.query(sql);

  // parse events JSON
  for (const g of groups) {
    const ids = g.events;
    if (ids.length === 0) {
      g.events = [];
      continue;
    }

    const [events] = await pool.query(
      `SELECT * FROM events WHERE id IN (?) AND date_deletion IS NULL`,
      [ids]
    );

    g.events = events.map(ev =>({
      ...ev
    }));
  }

  return groups;
}


  static async findById(id) {
    const sql = `SELECT * FROM event_groups WHERE id = ? AND date_deletion IS NULL`;
    const [rows] = await pool.query(sql, [id]);
    const group = rows[0];

    //Garantindo que os eventos recbidos em group não são null(Não mexer!!!)
    if (group) {
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