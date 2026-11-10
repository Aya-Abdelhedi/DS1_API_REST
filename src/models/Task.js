// fichier يعطينا forme d'une tache في mongodb

// اول حاجة n chargiw mongoose
const mongoose = require('mongoose');

// schema هاذي تعطينا structure تاع tache في MongoDB
const taskSchema = new mongoose.Schema({

  titre: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },
// statut juste to do , doing, done 
  statut: {
    type: String,
    enum: ['todo', 'doing', 'done'],
    default: 'todo',
  },

  deadline: {
    type: Date,
  },
   // projet الي تنتميلوا tache , n stocker just ID 
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
    // user المسؤول على tache  , auusi n stoker juste ID
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// نصنعو model اسمو Task و n exportiwh و MongoDB y stocker les taches في collection tasks
module.exports = mongoose.model('Task', taskSchema);