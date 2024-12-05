import sql from 'mssql';

let database = null;

export default class Database {
  config = {};
  poolconnection = null;
  connected = false;

  constructor(config) {
    this.config = config;
  }

  async connect() {
    try {
      this.poolconnection = await sql.connect(this.config);
      this.connected = true;
      console.log('Database connected successfully.');
      return this.poolconnection;
    } catch (error) {
      console.error('Error connecting to the database:', error);
      this.connected = false;
    }
  }

  async disconnect() {
    try {
      if (this.connected) {
        await this.poolconnection.close();
        this.connected = false;
        console.log('Database disconnected successfully.');
      }
    } catch (error) {
      console.error('Error disconnecting from the database:', error);
    }
  }

  async executeQuery(query) {
    const request = this.poolconnection.request();
    const result = await request.query(query);

    return result.rowsAffected[0];
  }
  //Priorities
  // Return all list priorities
  async readAllPriorities() {
    const request = this.poolconnection.request();
    const result = await request.query(`SELECT * FROM priorities`);

    return result.recordsets;
  }
  // Return list priorities with specific ID
  async readPriorities(id) {
    const request = this.poolconnection.request();
    const result = await request
      .input('id', sql.Int, +id)
      .query(`SELECT * FROM priorities WHERE id = @id`);

    return result.recordset[0];
  }
  // Categories
  async readAllCategories() {
    const request = this.poolconnection.request();
    const result = await request.query(`SELECT * FROM categories`);

    return result.recordsets;
  }
  async readCategories(id) {
    const request = this.poolconnection.request();
    const result = await request
      .input('id', sql.Int, +id)
      .query(`SELECT * FROM categories WHERE id = @id`);

    return result.recordset[0];
  }
  async createCategories(data) {
    const request = this.poolconnection.request();
  
    // Menambahkan input parameter ke query
    request.input('name', sql.NVarChar(255), data.name);
  
    // Query untuk menyisipkan data ke tabel 'tasks'
    const result = await request.query(
      `INSERT INTO categories (name) 
       VALUES (@name)`
    );
  
    // Mengembalikan jumlah baris yang terpengaruh
    return result.rowsAffected[0];
  }
  async updateCategories(id, data) {
    const idAsNumber = Number(id);
    const request = this.poolconnection.request();
      

    request.input('name', sql.NVarChar(255), data.name);

    const result = await request
    .input('id', sql.Int, idAsNumber)
    .query(`UPDATE categories SET name=@name WHERE id=@id`);

    return result.rowsAffected[0];
  }
  async deleteCategories(id) {
    const idAsNumber = Number(id);

    const request = this.poolconnection.request();
    const result = await request
      .input('id', sql.Int, idAsNumber)
      .query(`DELETE FROM categories WHERE id = @id`);

    return result.rowsAffected[0];
  }

  // Tasks
  // Return all Tasks
  async readAllTasks() {
    const request = this.poolconnection.request();
    const result = await request.query(`SELECT tasks.id,tasks.name as title,priorities.name as priority,categories.name as category,tasks.due_date,tasks.isDone as isDone
      FROM tasks inner join priorities on tasks.priority_id = priorities.id inner join categories on tasks.category_id = categories.id`);

    return result.recordsets;
  }

  async readTasks(id) {
    const request = this.poolconnection.request();
    const result = await request
      .input('id', sql.Int, +id)
      .query(`SELECT tasks.id,tasks.name as title,priorities.name as priority,categories.name as category,tasks.due_date,tasks.isDone as isDone
      FROM tasks inner join priorities on tasks.priority_id = priorities.id inner join categories on tasks.category_id = categories.id WHERE tasks.id = @id`);

    return result.recordset[0];
  }

  async getPriorityIdByName(priorityName) {
    const request = this.poolconnection.request();

    // Menambahkan input parameter untuk mencari ID priority berdasarkan nama
    request.input('priority_name', sql.NVarChar(255), priorityName);

    // Query untuk mencari ID priority
    const result = await request.query(
        `SELECT id 
         FROM priorities 
         WHERE name = @priority_name`
    );

    // Jika hasil ditemukan, kembalikan ID
    return result.recordset.length > 0 ? result.recordset[0].id : null;
}

async getCategoryIdByName(categoryName) {
  const request = this.poolconnection.request();

  // Menambahkan input parameter untuk mencari ID category berdasarkan nama
  request.input('category_name', sql.NVarChar(255), categoryName);

  // Query untuk mencari ID category
  const result = await request.query(
      `SELECT id 
       FROM categories 
       WHERE name = @category_name`
  );

  // Jika hasil ditemukan, kembalikan ID
  return result.recordset.length > 0 ? result.recordset[0].id : null;
}

  async createTasksWithNames(data) {
    const request = this.poolconnection.request();

    // Cari ID priority berdasarkan nama
    const priorityId = await this.getPriorityIdByName(data.priority_name);
    if (!priorityId) {
        throw new Error(`Priority dengan nama "${data.priority_name}" tidak ditemukan.`);
    }

    // Cari ID category berdasarkan nama
    const categoryId = await this.getCategoryIdByName(data.category_name);
    if (!categoryId) {
        throw new Error(`Category dengan nama "${data.category_name}" tidak ditemukan.`);
    }

    // Menambahkan input parameter untuk insert data
    request.input('name', sql.NVarChar(255), data.name);
    request.input('priority_id', sql.Int, priorityId);
    request.input('category_id', sql.Int, categoryId);
    request.input('due_date', sql.Date, data.due_date);

    // Query untuk menyisipkan data ke tabel 'tasks'
    const result = await request.query(
        `INSERT INTO tasks (name, priority_id, category_id, due_date) 
         VALUES (@name, @priority_id, @category_id, @due_date)`
    );

    // Mengembalikan jumlah baris yang terpengaruh
    return result.rowsAffected[0];
}

async updateTasks(id, data) {
  const idAsNumber = Number(id);
  const request = this.poolconnection.request();

  // Cari ID priority berdasarkan nama
  const priorityId = await this.getPriorityIdByName(data.priority_name);
  if (!priorityId) {
      throw new Error(`Priority dengan nama "${data.priority_name}" tidak ditemukan.`);
  }

  // Cari ID category berdasarkan nama
  const categoryId = await this.getCategoryIdByName(data.category_name);
  if (!categoryId) {
      throw new Error(`Category dengan nama "${data.category_name}" tidak ditemukan.`);
  }

  // Menambahkan input parameter untuk query UPDATE
  request.input('name', sql.NVarChar(255), data.name);
  request.input('priority_id', sql.Int, priorityId);
  request.input('category_id', sql.Int, categoryId);
  request.input('due_date', sql.Date, data.due_date);

  const result = await request
      .input('id', sql.Int, idAsNumber)
      .query(`
          UPDATE tasks 
          SET name = @name, 
              priority_id = @priority_id, 
              category_id = @category_id, 
              due_date = @due_date 
          WHERE id = @id
      `);

  return result.rowsAffected[0];
}

  
  async deleteTasks(id) {
    const idAsNumber = Number(id);

    const request = this.poolconnection.request();
    const result = await request
      .input('id', sql.Int, idAsNumber)
      .query(`DELETE FROM tasks WHERE id = @id`);

    return result.rowsAffected[0];
  }
}

export const createDatabaseConnection = async (passwordConfig) => {
  const database = new Database(passwordConfig);
  await database.connect();
  return database;
};