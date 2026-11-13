// fichier فيها 2 middlewares وحد لل adresses موش موجودة ولاخر لل erreurs موش متوقعين

//middleware n executiwha وقت حتى route ماتجوب على requete
const notFound = (req, res, next) => {
//نرجعو erreur 404 مع ميساج فيه methode وadresse
  res.status(404).json({ message: `Route introuvable : ${req.method} ${req.originalUrl}` });
};

// middleware لل erreurs  (لازم عندو 4 paramètres)
const errorHandler = (err, req, res, next) => {
// نثبتو كان erreur جاي من json في body
    if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON invalide dans le body' });
  }
  // كان erreur عندها status نستعملوه, sinon 500
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Erreur serveur' });
};

// n exportiw les 2 باش نستعملوهم في server.js
module.exports = { notFound, errorHandler };