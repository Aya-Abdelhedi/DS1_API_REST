//هوني نعملوا verification اذا request عندها token JWT valide قبل ما تتعدى الى route

// n importiw jsonwebtoken الي باش t verifier token 
const jwt = require('jsonwebtoken');

// middleware يتأكد انو user عندو token صحيح
const auth = (req, res, next) => {
  // نجيبو header اسمو Authorization الي بعثو client
  const header = req.headers.authorization;

  // كان ما فماش token on refuse
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  // نفصلو token من كلمة Bearer و نخلو كان token 2eme element [1]
  const token = header.split(' ')[1];

  try {
    // نتأكدو أنو token صحيح و non expiré
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // n stockiw  id و role في req.user باش نستعملوهم بعد
    req.user = { id: decoded.id, role: decoded.role };
    // نكملو etape لمبعدها
    next();
    //اذا token غالط و الا expiré ال reponse هي 401
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};
//n exportiw middleware باش نستعملو في fichiers routes
module.exports = auth;