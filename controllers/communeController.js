const Commune = require('../models/commune');

// Obtenir la liste de tous les communes
exports.getAllCommune = async (req, res) => {
  try {
    const communes = await Commune.findAll();
    res.status(200).json(communes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Obtenir une commune par ID
exports.getCommuneById = async (req, res) => {
  try {
    const commune = await Commune.findByPk(req.params.id);
    if (!commune) {
      return res.status(404).json({ message: 'Commune non trouvé' });
    }
    res.status(200).json(commune);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Ajouter un nouvelle commune
exports.createCommune = async (req, res) => {
  try {
    const { ref_commune, commune,statut } = req.body;
    if (!ref_commune || !commune || !statut) {
      return res.status(400).json({ message: 'Les champs reference, commune et statut sont requis' });
    }
    const newCommune = await Commune.create({
      ref_commune,
      commune,
      statut,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json(newCommune);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Mettre à jour une commune
exports.updateCommune = async (req, res) => {
  try {
    const commune = await Commune.findByPk(req.params.id);
    if (!commune) {
      return res.status(404).json({ message: 'Commune non trouvé' });
    }
    await commune.update(req.body);
    res.status(200).json(commune);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de validation', error });
  }
};

// Supprimer une commune par ID
exports.deleteCommune = async (req, res) => {
  try {
    const commune = await Commune.findByPk(req.params.id);
    if (!commune) {
      return res.status(404).json({ message: 'Commune non trouvé' });
    }
    await commune.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
