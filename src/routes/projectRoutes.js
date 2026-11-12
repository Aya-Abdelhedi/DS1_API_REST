//// fichier هذا يربط les URLs بالfonctions متاع projectController ,يعني وقت واحد يطلب اي url مع اي methode http لازم نعرفو ان هي fonction الي باش n executiwha 

// نجيبو express و les fonctions من controller و middleware auth
const express = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const auth = require('../middlewares/auth');

const router = express.Router();

// كل routes تاع projects محمية بـ auth (token obligatoire)
router.use(auth);

// حسب طلب نعملو execution لل fonction:

 // création متاع projet
router.post('/', createProject);

// liste متاع les projets (manager يشوف الكل، user يشوف متاعو برك)
router.get('/', getProjects);

// afficher projet واحد بال id
router.get('/:id', getProjectById);

// modification متاع projet (owner ولا manager برك)
router.put('/:id', updateProject);

// نفسخو projet مع les taches متاعو
router.delete('/:id', deleteProject);

// n exportiw router باش نستعملوه في server.js
module.exports = router;