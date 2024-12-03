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
    const result = await request.query(`SELECT * FROM tasks`);

    return result.recordsets;
  }

  async createTasks(data) {
    const request = this.poolconnection.request();
  
    // Menambahkan input parameter ke query
    request.input('name', sql.NVarChar(255), data.name);
    request.input('priority_id', sql.Int, data.priority_id);
    request.input('category_id', sql.Int, data.category_id);
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
      

    request.input('name', sql.NVarChar(255), data.name);
    request.input('priority_id', sql.Int, data.priority_id);
    request.input('category_id', sql.Int, data.category_id);
    request.input('due_date', sql.Date, data.due_date);

    const result = await request
    .input('id', sql.Int, idAsNumber)
    .query(`UPDATE tasks SET name=@name, priority_id = @priority_id,category_id=@category_id,due_date=@due_date WHERE id = @id`
    );

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