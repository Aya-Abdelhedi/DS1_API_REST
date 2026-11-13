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


// n importw  les middlewares باش proteger les routes
const auth = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

//  route protégée par auth
router.get('/me', auth, (req, res) => {
    //هوني يرجع id ,role , stocké في req.user par auth
  res.json({ user: req.user });
});

// protégée par auth puis authorize
router.get('/manager-only', auth, authorize('manager'), (req, res) => {
    // reponse هاذي تظهر كان اذا token valide et role est manager 
  res.json({ message: 'Bienvenue manager' });
});

// n exportiw router باش نستعملوه في server.js
module.exports = router;