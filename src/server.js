// ce fichier يخلينا ندماريو serveur و nconnectiw مع base

//  nimportiw librairie dotenv من env.
require('dotenv').config();
// n importiw express باش نعملوا creation تاع serveur
const express = require('express');
//نجيبوا fonction connectDB تاع connexion a MongoDB depuis db.js
const connectDB = require('./config/db');
// نجيبو routes تاع auth من fichier authRoutes.js
const authRoutes = require('./routes/authRoutes');
// نجيبو routes تاع projects من fichier projectRoutes.js
const projectRoutes = require('./routes/projectRoutes');
//نصنعوا application
const app = express();
//ligne هذا يخلينا نقراو json المبعوث في req.body
app.use(express.json());
// كل routes تاع auth تبدا بـ /api/auth
app.use('/api/auth', authRoutes);

// كل routes تاع projects تبدا بـ /api/projects
app.use('/api/projects', projectRoutes);

// nconnectiw base 
connectDB();
//لهنا نعملوا creation ل une route de test باش نتاكدوا انو serveur يخدم
app.get('/', (req, res) => {
  res.json({ message: 'API DS1 ' });
});
//ناخذوا port du env. و 3000نستعملوها كان اذا port موش موجود||
const PORT = process.env.PORT || 3000;
//هوني ndemariw serveur 
app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});