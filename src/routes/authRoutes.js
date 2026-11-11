// fichier هذا فيه liste d'adresse API و لكل adresse يقلها انا fonction executer 

// نجيبوا express باش نعملوا creation de router
const express = require('express');
// n importiw 2 fonctions register w login من authController
const { register, login } = require('../controllers/authController');

// نعملوا creation de liste فارغة وين باش نكتبوا les adresses
const router = express.Router();
 //نعبو la liste register 
router.post('/register', register);

// نعبو la liste login 
router.post('/login', login);

// n exportiw router باش نستعملوه في server.js
module.exports = router;