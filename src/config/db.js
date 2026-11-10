//n importiw librairie mongoose الي هي تمثل الوسيط بين Node.js et MongoDB
const mongoose = require('mongoose');

//نعملوا لfonction نسموها connectDB تكون async على خاطر connexion تاخو برشاوقت وين كود لازم يستنى reponse من عند MongoDB
const connectDB = async () => {
  try {
   // ici تقراو adresse تاع base الموجودة في fichier .env, ici await تستنى حتى connexion تتعدى 
    await mongoose.connect(process.env.MONGO_URI);
    // واذا connexion تعدات نلقاو ميساج "MongoDB connecté avec succès"
    console.log('MongoDB connecté avec succès');
  } catch (error) {
    //واذا connexion غالطة  un erreur s'affiche "Erreur de connexion MongoDB :"
    console.error('Erreur de connexion MongoDB :', error.message);
    // هوني serveur ياقف علي خاطر منجموا نعملوا من غير base de données
    process.exit(1);
  }
};

//هوني n exportiw fonction باش نجموا نستعملوها في des fichiers اخرين
module.exports = connectDB;