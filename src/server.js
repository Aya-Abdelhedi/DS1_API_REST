// ce fichier يخلينا ندماريو serveur و nconnectiw مع base

//  nimportiw librairie dotenv من env.
require('dotenv').config();
// n importiw express باش نعملوا creation تاع serveur
const express = require('express');
//نجيبوا fonction connectDB تاع connexion a MongoDB depuis db.js
const connectDB = require('./config/db');
//نصنعوا application
const app = express();
//ligne هذا يخلينا نقراو json المبعوث في req.body
app.use(express.json());
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