// fichier هذا يبنلنا forme du projet في mongodb

//nchargiw mongoose 
const mongoose = require('mongoose');

// schema هاذي تعطينا stucuture تاع  document de projet 
const projectSchema = new mongoose.Schema({

  nom: {
    type: String,
    required: [true, 'Le nom du projet est requis'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId, //هوني ما n stockiwch les utilisateurs كل juste id 
    ref: 'User',
    required: true,
  },

  statut: {
    type: String,
    enum: ['en cours', 'terminé', 'en pause'],
    default: 'en cours',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// نصنعو model اسمو Project  وn exportiwh  و mongodb y stocker les projets في collection projects 
module.exports = mongoose.model('Project', projectSchema);