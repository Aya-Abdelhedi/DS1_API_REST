// fichier فيها les adresses تاع les tâches و لكل adresse fonction a executer

// n importiw express, les fonctions من taskController, و les middlewares
const express = require('express');
const {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
} = require('../controllers/taskController');
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// نعملو creation de router
const router = express.Router();

// كل routes تاع tache protégé ب auth (token obligatoire)
router.use(auth);

// حسب طلب نعملو execution لل fonction:
// routes على projet
router.post('/projects/:projectId/tasks', createTask);
router.get('/projects/:projectId/tasks', getTasksByProject);

// routes على tâche direct 
router.get('/tasks/:id', getTaskById);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

// affectation متاع tâche لـ user (manager الى يعملها authorize يتأكد من role)
router.patch('/tasks/:id/assign', authorize('manager'), assignTask);

// n exportiw router باش نستعملوه في server.js
module.exports = router;