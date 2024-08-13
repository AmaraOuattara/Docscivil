const Juridiction = require('../models/Juridiction');

// Obtenir la liste de toutes les juridiction
exports.getAllJuridiction = async (req, res) => {
  try {
    const juridiction = await Juridiction.findAll();
    res.status(200).json({code: '201', content: juridiction});
  } catch (error) {
    res.status(500).json({code: '500', message: 'Erreur serveur', error });
  }
};

// Obtenir une juridiction par ID
exports.getJuridictionById = async (req, res) => {
  try {
    const juridiction = await Juridiction.findByPk(req.params.id);
    if (!juridiction) {
      return res.status(404).json({ message: 'juridiction non trouvé' });
    }
    res.status(200).json(juridiction);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Obtenir une juridiction par statut
exports.getJuridictionByStatut = async (req, res) => {
  try {
    const jrd_statut = req.params.statut; // Récupère le statut depuis les paramètres de la requête
    const juridiction = await Juridiction.findAll({
      where: {
        jrd_statut: jrd_statut
      }
    });
    if (!juridiction) {
      return res.status(404).json({ code: '404',message: 'Aucune juridiction trouvée avec ce statut' });
    }
    res.status(200).json({code: '201',content: juridiction});
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};



// Ajouter une nouvelle juridiction
exports.createJuridiction = async (req, res) => {
  try {
    const { jrd_reference, jrd_libelle,jrd_statut} = req.body;
    if (!jrd_reference ||  !jrd_libelle || !jrd_statut ) {
      return res.status(400).json({ message: 'Les champs obligatoires sont requis' });
    }
    const newJuridiction = await Juridiction.create({
      jrd_reference, 
      jrd_libelle,
      jrd_statut,
      date_creation: new Date(),
      date_modification: new Date(),
    });
    res.status(201).json(newJuridiction);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Mettre à jour une juridiction
exports.updateJuridiction = async (req, res) => {
  try {
    const juridiction = await Juridiction.findByPk(req.params.id);
    if (!juridiction) {
      return res.status(404).json({ message: 'juridiction non trouvé' });
    }
    await etat.update(req.body);
    res.status(200).json(juridiction);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de validation', error });
  }
};

// Supprimer une juridiction par ID
exports.deleteJuridiction = async (req, res) => {
  try {
    const juridiction = await Juridiction.findByPk(req.params.id);
    if (!juridiction) {
      return res.status(404).json({ message: 'juridiction non trouvé' });
    }
    await etat.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};



