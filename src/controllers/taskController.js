// fichier فيها les fonctions الي يخلونا نعملوا les opérations CRUD على tâche , recherche و tri, و نعملوا affectation متاع tâche لـ user (كان الي عندو role manager ينجم يعمل affectation)

// n importiw bib mongoose, modele task, modele projet, modele user
const mongoose = require('mongoose');
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// ل fonction canAccess تتاكد من user عندو الحق y acceder lel projet و الا لا
const canAccess = (project, user) => {
  // كان user هو manager ولا هو صاحب projet، نعطيوه accès
  return user.role === 'manager' || project.owner.toString() === user.id;
};

// fonction تبدل (. * + ...) و تحسبهم كحروف عادية في recherche
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// CREATE : créer une tâche وسط projet
exports.createTask = async (req, res) => {
  try {
    // نجيبو id تاع projet من l'adresse
    const { projectId } = req.params;
    // نثبتو كان id صحيح
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'ID projet invalide' });
    }
    // نثبتو كان projet موجود
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }
    // نثبتو كان user عندو الحق يحل projet
    if (!canAccess(project, req.user)) {
      return res.status(403).json({ message: 'Accès interdit à ce projet' });
    }
    // نحطو في body كان 4 champs هاذم من infos الي بعثهم user و assignedTo  مانحطوهاش خاطر كان manager ينجم يعمل affectation
    const { titre, description, statut, deadline } = req.body;
    // نزيدو task جديد في collection tâches مربوط بـ projet ( project: project._id)
    const task = await Task.create({
      titre,
      description,
      statut,
      deadline,
      project: project._id,
    });
    // نرجعو tâche الي تعملت ب format json
    res.status(201).json(task);
  } catch (error) {
    // 400 يعني requete incorrecte (مثلا titre ناقص ولا statut غالط)
    res.status(400).json({ message: error.message });
  }
};

// READ : afficher toutes les tâches تاع projet
exports.getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    // نفس les vérifications الي في création
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'ID projet invalide' });
    }
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Projet introuvable' });
    }
    if (!canAccess(project, req.user)) {
      return res.status(403).json({ message: 'Accès interdit à ce projet' });
    }
    // نقراو les paramètres من l'URL
    const { search, statut, sort, order } = req.query;

    // نخليو كان tâches تاع projet هذا
    const filter = { project: project._id };
    // اذا user يلوج على كلمة نخلوا كان les taches الي titre متاعو فيه الكلمة هذه
    if (search) {
    filter.titre = { $regex: escapeRegex(search), $options: 'i' };
    }
        // كان user اختار statut نخلو كان tache الي عند statut هذا
    if (statut) {
    filter.statut = statut;
    }

    // هذه liste الحاجات المسموحين لل trie meme principe que projet 
    const allowedSort = ['createdAt', 'titre', 'deadline', 'statut'];
    const sortField = allowedSort.includes(sort) ? sort : 'createdAt';
    const sortOrder = order === 'desc' ? -1 : 1;

    const tasks = await Task.find(filter).sort({ [sortField]: sortOrder });
    
    // يرجع liste  لل client au format json
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// fonction هذه تلوج على tache وتثبت كان user عندو الحق على projet متاعها , sinon ترجع erreur و null

const findTaskWithAccess = async (req, res) => {
  // نثبتو كان id صحيح
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'ID tâche invalide' });
    return null;
  }
  // نلوجو على tâche في mongodb بال id
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404).json({ message: 'Tâche introuvable' });
    return null;
  }
  // نجيبو projet متاع tâche و نثبتو كان user عندو الحق y acceder 
  const project = await Project.findById(task.project);
  if (!project || !canAccess(project, req.user)) {
    res.status(403).json({ message: 'Accès interdit à cette tâche' });
    return null;
  }
  // كان كل شي صحيح ,fonction ترجع tache 
  return task;
};

// READ : afficher une tâche par son ID
exports.getTaskById = async (req, res) => {
  try {
    // نستعملو fonction findTaskWithAccess باش نثبتوا من id و existence و droit
    const task = await findTaskWithAccess(req, res);
    // كان فما erreur تاقف fonction 
    if (!task) return;
    // sinon يرجعلو infos de tâche
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE : modifier une tâche
exports.updateTask = async (req, res) => {
  try {
    const task = await findTaskWithAccess(req, res);
    if (!task) return;
    // نعملو modification كان للحاجات الي بعثهم user, و project و assignedTo ما نبدلوهمش
    const { titre, description, statut, deadline } = req.body;
    if (titre !== undefined) task.titre = titre;
    if (description !== undefined) task.description = description;
    if (statut !== undefined) task.statut = statut;
    if (deadline !== undefined) task.deadline = deadline;
    await task.save();
    // نرجعو tâche modifiée
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE : supprimer une tâche
exports.deleteTask = async (req, res) => {
  try {
    const task = await findTaskWithAccess(req, res);
    if (!task) return;
    // نفسخو tâche من base
    await task.deleteOne();
    res.json({ message: 'Tâche supprimée' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH : affecter une tâche لـ user ,كان manager ينجم يعمل ل affectation هذه و verificatioin تصير route (authorize)
exports.assignTask = async (req, res) => {
  try {
    const task = await findTaskWithAccess(req, res);
    if (!task) return;
    // نجيبو id تاع user الي باش نعملولو affectation تاع tache
    const { userId } = req.body;
    // نثبتو كان id صحيح
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'userId invalide' });
    }
    // نثبتو كان user موجود في base
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    // نعيّنو tâche لـ user و نعملو save
    task.assignedTo = user._id;
    await task.save();
    // نرجعو tâche مع assignedTo
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};