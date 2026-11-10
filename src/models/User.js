// في fichier هذا باش نلقاو forme تاع les utilisateurs في mongodb

// n importiw mongoose باش نعملوا creation le schéma w le modele
const mongoose = require('mongoose');
// n importiw bcryptjs باش ncrypty mot de passe 
const bcrypt = require('bcryptjs');

// schéma هاذي تعطينا structure تاع document
const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
  },
  // لازم ما يتعاودش login
  login: {
    type: String,
    required: [true, 'Veuillez saisir un login'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: 6,
  },
  //  role يكون اما user ou manager
  role: {
    type: String,
    enum: ['user', 'manager'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// قبل ما نسجلوا user لازم nhashi le mot de passe 
userSchema.pre('save', async function () {
    // اذا mot de passe ماتبدلش مانعودوش ncryptiwh
  if (!this.isModified('password')) return;
   //نبدلوا mot de passe ب version crypté بتاعو
  this.password = await bcrypt.hash(this.password, 10);
});

// نقارنوا mot de passe تاع user w mot de passe haché stoké
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};
// on cree model و nexportiwh و mongodb il crée la collection de users
module.exports = mongoose.model('User', userSchema);