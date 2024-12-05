import express from "express";
import { passwordConfig as SQLAuthentication } from "../config.js";
import { createDatabaseConnection } from "../config/database.js";

const router = express.Router();
router.use(express.json());

const database = await createDatabaseConnection(SQLAuthentication);

router.get("/priorities", async (req, res) => {
  try {
    // Return a list of priorities
    const priorities = await database.readAllPriorities();
    if (priorities != null) {
      console.log(`priorities: ${JSON.stringify(priorities)}`);
    } else {
      console.log("priorities is null");
    }

    res.status(200).json(priorities);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.get("/priorities/:id", async (req, res) => {
  try {
    // Get the priorities with the specified ID
    const prioritiesId = req.params.id;
    console.log(`prioritiesId: ${prioritiesId}`);
    if (prioritiesId) {
      const result = await database.readPriorities(prioritiesId);
      console.log(`priorities: ${JSON.stringify(result)}`);
      res.status(200).json(result);
    } else {
      res.status(404);
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.get("/categories", async (req, res) => {
  try {
    // Return a list of categories
    const categories = await database.readAllCategories();
    console.log(`categories: ${JSON.stringify(categories)}`);
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.get("/categories/:id", async (req, res) => {
  try {
    // Get the categories with the specified ID
    const categoriesId = req.params.id;
    console.log(`categoriesId: ${categoriesId}`);
    if (categoriesId) {
    const result = await database.readCategories(categoriesId);
      console.log(`categories: ${JSON.stringify(result)}`);
      res.status(200).json(result);
    } else {
      res.status(404);
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.post('/categories', async (req, res) => {
  try {
    // add a tasks
    const categories = req.body;
    console.log(`categories: ${JSON.stringify(categories)}`);
    const rowsAffected = await database.createCategories(categories);
    res.status(201).json({ rowsAffected });
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.put('/categories/:id', async (req, res) => {
  try {
    // Update the tasks with the specified ID
    const categoriesId = req.params.id;
    console.log(`categoriesId: ${categoriesId}`);
    const categories = req.body;

    if (categoriesId && categories) {
      delete categories.id;
      console.log(`categories: ${JSON.stringify(categories)}`);
      const rowsAffected = await database.updateCategories(categoriesId, categories);
      res.status(200).json({ rowsAffected });
    } else {
      res.status(404);
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});
router.delete('/categories/:id', async (req, res) => {
  try {
    // Delete the person with the specified ID
    const categoriesId = req.params.id;
    console.log(`categoriesId: ${categoriesId}`);

    if (!categoriesId) {
      res.status(404);
    } else {
      const rowsAffected = await database.deleteCategories(categoriesId);
      res.status(204).json({ rowsAffected });
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});





router.get('/tasks', async (req, res) => {
  try {
    // Return a list of tasks
    const tasks = await database.readAllTasks();
    console.log(`tasks: ${JSON.stringify(tasks)}`);
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.get('/tasks/:id', async (req, res) => {
  try {
    // Get the tasks with the specified ID
    const tasksId = req.params.id;
    console.log(`tasksId: ${tasksId}`);
    if (tasksId) {
    const result = await database.readTasks(tasksId);
      console.log(`tasks: ${JSON.stringify(result)}`);
      res.status(200).json(result);
    } else {
      res.status(404);
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});

router.post('/tasks', async (req, res) => {
  try {
    // Ambil data dari body request
    const tasks = req.body;

    // Validasi apakah data lengkap
    if (!tasks.name || !tasks.priority_name || !tasks.category_name || !tasks.due_date) {
      return res.status(400).json({ error: 'Field name, priority_name, category_name, and due_date are required.' });
    }

    // Panggil fungsi createTasksWithNames untuk memproses input
    const rowsAffected = await database.createTasksWithNames(tasks);

    // Kirimkan respons sukses
    res.status(201).json({ message: 'Task created successfully', rowsAffected });
  } catch (err) {
    // Tangani error
    res.status(500).json({ error: err.message });
  }
});


router.put('/tasks/:id', async (req, res) => {
  try {
    // Update the tasks with the specified ID
    const tasksId = req.params.id;
    console.log(`tasksId: ${tasksId}`);
    const tasks = req.body;

    if (tasksId && tasks) {
      delete tasks.id;
      console.log(`tasks: ${JSON.stringify(tasks)}`);
      const rowsAffected = await database.updateTasks(tasksId, tasks);
      res.status(200).json({ rowsAffected });
    } else {
      res.status(404);
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});


router.delete('/tasks/:id', async (req, res) => {
  try {
    // Delete the person with the specified ID
    const tasksId = req.params.id;
    console.log(`tasksId: ${tasksId}`);

    if (!tasksId) {
      res.status(404);
    } else {
      const rowsAffected = await database.deleteTasks(tasksId);
      res.status(204).json({ rowsAffected });
    }
  } catch (err) {
    res.status(500).json({ error: err?.message });
  }
});



export default router;
