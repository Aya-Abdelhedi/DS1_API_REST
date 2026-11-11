// fichier باش تتاكد من role ,شكون autorisé ,و شكون لا

// fonction يتأكد من role تاع user autorisé و الا لا
const authorize = (...roles) => { // lite des roles autorisés
  return (req, res, next) => {
    // كان role تاع user ماهوش موجود في roles ,return يوقف كل شى و exécution annullé  
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Accès interdit pour votre rôle' });
    }
    //  هوني role autorisé و requete تتعدى لل route 
    next();
  };
};

module.exports = authorize;