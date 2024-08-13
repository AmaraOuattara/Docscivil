const Zone = require('../models/Zone');

// Obtenir la liste de tous les Zone
exports.getAllZone = async (req, res) => {
  try {
    const zone = await Zone.findAll();
    res.status(200).json({code: '201',content: zone});
  } catch (error) {
    res.status(500).json({ code: '500',content: 'Erreur serveur', error });
  }
};

// Obtenir un Zone par ID
exports.getZoneById = async (req, res) => {
  try {
    const zone = await Zone.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({ code: '404',content: 'Zone non trouvé' });
    }
    res.status(200).json({code: '201',content: zone});
  } catch (error) {
    res.status(500).json({code: '500', content: 'Erreur serveur', error });
  }
};

// Obtenir un Zone par statut
exports.getZoneByStatut = async (req, res) => {
  try {
    const zne_statut = req.params.statut; // Récupère le statut depuis les paramètres de la requête
    const zone = await Zone.findAll({
      where: {
        zne_statut: zne_statut
      }
    });
    if (!zone) {
      return res.status(404).json({ code: '404',content: 'Aucun Zone trouvée avec ce statut' });
    }
    res.status(200).json({code: '201',content: zone});
  } catch (error) {
    res.status(500).json({ code: '500',content: 'Erreur serveur', error });
  }
};



// Ajouter un nouveau Zone
exports.createZone = async (req, res) => {
  try {
    const { zne_reference, zne_libelle,zne_statut} = req.body;
    if (!zne_reference ||  !zne_libelle || !zne_statut ) {
      return res.status(400).json({ code: '500',content: 'Les champs obligatoires sont requis' });
    }
    const newZone = await Zone.create({
      zne_reference, 
      zne_libelle,
      zne_statut,
      date_creation: new Date(),
      date_modification: new Date(),
    });
    res.status(201).json({code: '201',content: newZone});
  } catch (error) {
    res.status(500).json({ code: '500',content: 'Erreur serveur', error });
  }
};

// Mettre à jour un Zone
exports.updateZone = async (req, res) => {
  try {
    const zone = await Zone.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({ code: '500',content: 'Zone non trouvé' });
    }
    await Zone.update(req.body);
    res.status(200).json({code: '201', content: zone});
  } catch (error) {
    res.status(400).json({code: '500', content: 'Erreur de validation', error });
  }
};

// Supprimer une localite par ID
exports.deleteZone = async (req, res) => {
  try {
    const zone = await Zone.findByPk(req.params.id);
    if (!zone) {
      return res.status(404).json({code: '404', content: 'Zone non trouvé' });
    }
    await Zone.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({code: '500', content: 'Erreur serveur', error });
  }
};



