const Localite = require('../models/Localite');

// Obtenir la liste de tous les localités
exports.getAllLocalite = async (req, res) => {
  try {
    const localite = await Localite.findAll();
    res.status(200).json({code: '201',content:localite});
  } catch (error) {
    res.status(500).json({ code: '500',content: 'Erreur serveur', error });
  }
};

// Obtenir une localite par ID
exports.getLocaliteById = async (req, res) => {
  try {
    const localite = await Localite.findByPk(req.params.id);
    if (!localite) {
      return res.status(404).json({ code: '404',content: 'Localite non trouvé' });
    }
    res.status(200).json(localite);
  } catch (error) {
    res.status(500).json({code: '404', content: 'Erreur serveur', error });
  }
};

// Obtenir une localite par statut
exports.getLocalitesByStatut = async (req, res) => {
  try {
    const loc_statut = req.params.statut; // Récupère le statut depuis les paramètres de la requête
    const localites = await Localite.findAll({
      where: {
        loc_statut: loc_statut
      }
    });
    if (!localites) {
      return res.status(404).json({ code: '404',content: 'Aucune localité trouvée avec ce statut' });
    }
    res.status(200).json({code: '201',content: localites});
  } catch (error) {
    res.status(500).json({ code: '500',content: 'Erreur serveur', error });
  }
};

// Obtenir une localite par statut et par zone
exports.getLocalitesByStatutAndZone = async (req, res) => {
  try {
    const { statut, zone } = req.params; // Récupère le statut et la zone depuis les paramètres de la requête
    const localites = await Localite.findAll({
      where: {
        loc_statut: statut,
        Zne_reference: zone
      }
    });
    if (!localites) {
      return res.status(404).json({code:'404', content: 'Aucune localité trouvée avec ce statut et cette zone' });
    }
    res.status(200).json({code:'201',content: localites});
  } catch (error) {
    res.status(500).json({code:'500', content: 'Erreur serveur', error });
  }
};

// Ajouter un nouvelle localite
exports.createLocalite = async (req, res) => {
  try {
    const { loc_reference, loc_libelle,loc_statut,pay_reference,Zne_reference } = req.body;
    if (!loc_reference ||  !loc_libelle || !loc_statut || !pay_reference || !Zne_reference) {
      return res.status(400).json({code:'500', content: 'Les champs obligatoires sont requis' });
    }
    const newLocalite = await Localite.create({
      loc_reference, 
      loc_libelle,
      loc_statut,
      pay_reference,
      Zne_reference,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json({code:'201',content:newLocalite});
  } catch (error) {
    res.status(500).json({ code:'500', content: 'Erreur serveur', error });
  }
};

// Mettre à jour une localite
exports.updateLocalite = async (req, res) => {
  try {
    const localite = await Localite.findByPk(req.params.id);
    if (!localite) {
      return res.status(404).json({ code:'404',content: 'Localité non trouvé' });
    }
    await localite.update(req.body);
    res.status(200).json(localite);
  } catch (error) {
    res.status(400).json({code:'400', content: 'Erreur de validation', error });
  }
};

// Supprimer une localite par ID
exports.deleteLocalite = async (req, res) => {
  try {
    const localite = await Localite.findByPk(req.params.id);
    if (!localite) {
      return res.status(404).json({ code:'404', content: 'Localite non trouvé' });
    }
    await localite.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ code:'500',content: 'Erreur serveur', error });
  }
};



