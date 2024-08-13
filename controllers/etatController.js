const Etat = require('../models/Etat');

// Obtenir la liste de tous les etat
exports.getAllEtat = async (req, res) => {
  try {
    const etat = await Etat.findAll();
    res.status(200).json({code: '201',content: etat});
  } catch (error) {
    res.status(500).json({ code: '500',message: 'Erreur serveur', error });
  }
};

// Obtenir un etat par ID
exports.getEtatById = async (req, res) => {
  try {
    const etat = await Etat.findByPk(req.params.id);
    if (!etat) {
      return res.status(404).json({ code: '404',message: 'etat non trouvé' });
    }
    res.status(200).json({code: '201',content: etat});
  } catch (error) {
    res.status(500).json({code: '500', message: 'Erreur serveur', error });
  }
};

// Obtenir un etat par statut
exports.getEtatByStatut = async (req, res) => {
  try {
    const eta_statut = req.params.statut; // Récupère le statut depuis les paramètres de la requête
    const etat = await Etat.findAll({
      where: {
        eta_statut: eta_statut
      }
    });
    if (!etat) {
      return res.status(404).json({ code: '404',message: 'Aucun etat trouvée avec ce statut' });
    }
    res.status(200).json({code: '201',content: etat});
  } catch (error) {
    res.status(500).json({ code: '500',message: 'Erreur serveur', error });
  }
};



// Ajouter un nouveau etat
exports.createEtat = async (req, res) => {
  try {
    const { eta_reference, eta_libelle,eta_statut} = req.body;
    if (!eta_reference ||  !eta_libelle || !eta_statut ) {
      return res.status(400).json({ code: '500',message: 'Les champs obligatoires sont requis' });
    }
    const newEtat = await Etat.create({
      eta_reference, 
      eta_libelle,
      eta_statut,
      date_creation: new Date(),
      date_modification: new Date(),
    });
    res.status(201).json({code: '201',content: newEtat});
  } catch (error) {
    res.status(500).json({ code: '500',message: 'Erreur serveur', error });
  }
};

// Mettre à jour un etat
exports.updateEtat = async (req, res) => {
  try {
    const etat = await Etat.findByPk(req.params.id);
    if (!etat) {
      return res.status(404).json({ code: '500',message: 'Etat non trouvé' });
    }
    await etat.update(req.body);
    res.status(200).json({code: '201', conrent:etat});
  } catch (error) {
    res.status(400).json({code: '500', message: 'Erreur de validation', error });
  }
};

// Supprimer une localite par ID
exports.deleteEtat = async (req, res) => {
  try {
    const etat = await Etat.findByPk(req.params.id);
    if (!etat) {
      return res.status(404).json({code: '404', message: 'etat non trouvé' });
    }
    await etat.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};



