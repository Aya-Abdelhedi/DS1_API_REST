// fichier فيها les fonctions الي يخلونا نعملوا les opérartions CRUD على projet و نثبتو من droit d'acces 

// n importiw bib mongoose, modele projet ,modele task
const mongoose = require('mongoose');
const Project = require('../models/Project');
const Task = require('../models/Task');

// ل fonction canAccess تتاكد من user عندو الحق y acceder lel projet
const canAccess = (project, user) => {
//كان user هو manager ولا هو صاحب projet، نعطيوه accès
  return user.role === 'manager' || project.owner.toString() === user.id;
};

// CREATE: créer un projet 
exports.createProject = async (req, res) => {
  try {
    //نحطوا les informations الي بعثهم user في body requete
    const { nom, description, statut } = req.body;
    // نزيدوا document جديد في collection projets و owner ناخذوه من token (req.user.id) موش من body
    const project = await Project.create({
      nom,
      description,
      statut,
      owner: req.user.id,
    });
    // le projet est créé en format json 
    res.status(201).json(project);
  } catch (error) {
    // 400 يعني requete incorrecte
    res.status(400).json({ message: error.message });
  }
};


// READ : afficher tous les projects : يعني user يشوف les projets متاعو  ,manager يشوف الكل 
exports.getProjects = async (req, res) => {
  try {
    //  لل manager نعملوا filtre فارغ يعني فماش condition يعطينا les projets الكل و owner نعملوا filtre avec user 
    const filter = req.user.role === 'manager' ? {} : { owner: req.user.id };
    const projects = await Project.find(filter);
    // يرجع liste ب format json 
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ : afficher un projet par son ID
exports.getProjectById = async (req, res) => {
  try {
    //نتأكدو أنو id صحيح 
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }
    // نلوجوا على projet في mongodb بال id 
    const project = await Project.findById(req.params.id);
    // كان projet موش موجود serveur يرجع 404
    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }
     // اذا user موش owner و موش manager مينجحش يدخل لل projet 
    if (!canAccess(project, req.user)) {
      return res.status(403).json({ message: 'Accès interdit à ce projet' });
    }
    // sinon يرجعلوا infos de projet 
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE : modifier un projet
// نعملوا creation تاع fonction الي ت modifier projet
exports.updateProject = async (req, res) => {
  try {
    // نثبتو كان id صحيح
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }
    // نثبتوا كان projet موجود
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }
    // نثبتو كان user عندو الحق يعمل modification
    if (!canAccess(project, req.user)) {
      return res.status(403).json({ message: 'Accès interdit à ce projet' });
    }
    //نعملو modification كان للحاجات لبعثهم user 
    const { nom, description, statut } = req.body;
    if (nom !== undefined) project.nom = nom;
    if (description !== undefined) project.description = description;
    if (statut !== undefined) project.statut = statut;
    //  نعملو save لل modification
    await project.save();
    //نرجعوا projet modifié
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE : supprimer un projet: نفسخوا projet و les tâches متاعو
exports.deleteProject = async (req, res) => {
  // نفس verification الي في modification 
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'ID invalide' });
    }
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }
    if (!canAccess(project, req.user)) {
      return res.status(403).json({ message: 'Accès interdit à ce projet' });
    }
    // نفسخو les taches الكل تاع projet 
    await Task.deleteMany({ project: project._id });
    // نفسخو projet من base
    await project.deleteOne();
    res.json({ message: 'Projet et tâches supprimés' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};