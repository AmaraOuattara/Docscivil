const Typecopie = require('../models/Typecopie');

// Obtenir la liste de tous les Typecopie
exports.getAllTypecopie = async (req, res) => {
  try {
    const typecopie = await Typecopie.findAll();
    res.status(200).json({code: '201',content: typecopie});
  } catch (error) {
    res.status(500).json({ code: '500',message: 'Erreur serveur', error });
  }
};

// Obtenir un Typecopie par ID
exports.getTypecopieById = async (req, res) => {
  try {
    const typecopie = await Typecopie.findByPk(req.params.id);
    if (!typecopie) {
      return res.status(404).json({ code: '404',message: 'Typecopie non trouvé' });
    }
    res.status(200).json({code: '201',content: typecopie});
  } catch (error) {
    res.status(500).json({code: '500', message: 'Erreur serveur', error });
  }
};

// Obtenir un Typecopie par statut
exports.getTypecopieByStatut = async (req, res) => {
  try {
    const typ_statut = req.params.statut; // Récupère le statut depuis les paramètres de la requête
    const typecopie = await Typecopie.findAll({
      where: {
        Typ_statut: typ_statut
      }
    });
    if (!typecopie) {
      return res.status(404).json({ code: '404',message: 'Aucun Typecopie trouvée avec ce statut' });
    }
    res.status(200).json({code: '201',content: typecopie});
  } catch (error) {
    res.status(500).json({ code: '500',message: 'Erreur serveur', error });
  }
};



// Ajouter un nouveau Typecopie
exports.createTypecopie = async (req, res) => {
  try {
    const { Typ_reference, Typ_libelle, Typ_statut} = req.body;
    if (!Typ_reference ||  !Typ_libelle || !Typ_statut ) {
      return res.status(400).json({ code: '500',message: 'Les champs obligatoires sont requis' });
    }
    const newTypecopie = await Typecopie.create({
      zne_reference, 
      zne_libelle,
      zne_statut,
      date_creation: new Date(),
      date_modification: new Date(),
    });
    res.status(201).json({code: '201',content: newTypecopie});
  } catch (error) {
    res.status(500).json({ code: '500',message: 'Erreur serveur', error });
  }
};

// Mettre à jour un Typecopie
exports.updateTypecopie = async (req, res) => {
  try {
    const typecopie = await Typecopie.findByPk(req.params.id);
    if (!typecopie) {
      return res.status(404).json({ code: '500',message: 'Typecopie non trouvé' });
    }
    await Typecopie.update(req.body);
    res.status(200).json({code: '201', conrent:typecopie});
  } catch (error) {
    res.status(400).json({code: '500', message: 'Erreur de validation', error });
  }
};

// Supprimer une localite par ID
exports.deleteTypecopie = async (req, res) => {
  try {
    const typecopie = await Typecopie.findByPk(req.params.id);
    if (!typecopie) {
      return res.status(404).json({code: '404', message: 'Typecopie non trouvé' });
    }
    await Typecopie.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};



