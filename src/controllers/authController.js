// fichier هذا فيه logique تاع inscription وconnexion 

// n importiw modele User باش نقراو و نعملوا creation des utilisateurs
const User = require('../models/User');
//n importiw librairie الي باش نصنعوا بها token JWT
const jwt = require('jsonwebtoken');

// نصنعوا fonction generatetoken 
const generateToken = (user) => {
  return jwt.sign( //token يتكون من 3حاجات
    { id: user._id, role: user.role }, // من contenu 
    process.env.JWT_SECRET,// و cle secret الي تحمي token من التزوير
    { expiresIn: '1d' } //token يبقى كان نهار
  );
};

// n exportiw fonction باش نستعملوها في les routes
exports.register = async (req, res) => {
    //  نجيبوا nom,login ,password من json تاع client
  try {
    const { nom, login, password } = req.body;

    // نشوفو كان login موجود déja 
    const exist = await User.findOne({ login });
    if (exist) {
      return res.status(400).json({ message: 'Ce login existe déjà' });
    }

    // role ديما user و client مينجمش يختار manager 
    const user = await User.create({ nom, login, password, role: 'user' });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: { id: user._id, nom: user.nom, login: user.login, role: user.role },
    });
  } catch (error) {
    // اذا فما erreur تجينا reponse 400 مع message 
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
    // n recuprer login و password الي دخلناهم client 
  try {
    const { login, password } = req.body;

    // نلوجوا user اذا موش موجود message 401 declenche
    const user = await User.findOne({ login });
    if (!user) {
      return res.status(401).json({ message: 'Login ou mot de passe incorrect' });
    }

    // نقارنوا 2 password
    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ message: 'Login ou mot de passe incorrect' });
    }

    // نرجعو token client يشوفو في header 
    res.json({ message: 'Connexion réussie', token: generateToken(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};