const ListeDiffusion = require('../models/ListeDiffusion')

// Obtenir la liste de tous les prpsêcts
exports.getAllListeDiffusion = async (req, res) => {
  try {
    const liste = await ListeDiffusion.findAll();
    res.status(200).json({code: '201',content: liste});
  } catch (error) {
    res.status(500).json({ code: '500',content: 'Erreur serveur', error });
  }
};

// Obtenir la liste de tous les utilisateurs avec pagination
exports.getAllListeDiffusionWithPagn = async (req, res) => {
  const { page = 1, size = 25 } = req.query;
  const limit = parseInt(size);
  const offset = (parseInt(page) - 1) * limit;

  try {
    const { count, rows } = await ListeDiffusion.findAndCountAll({
      limit,
      offset,
    });

    res.status(200).json({
      code: '200',
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      content: rows,
    });
  } catch (error) {
    res.status(400).json({code: '400', content: error.message });
  }
};

// Obtenir un utilisateur par ID
exports.getlisteById = async (req, res) => {
  try {
    const liste = await ListeDiffusion.findByPk(req.params.id);
    if (!liste) {
      return res.status(404).json({code: '404', content: 'Utilisateur non trouvé' });
    }
    res.status(200).json({code:'200',content: liste});
  } catch (error) {
    res.status(500).json({ code: '500',content: 'Erreur serveur', error });
  }
};

// Obtenir une  liste de diffusion par statut
exports.getlisteByStatut = async (req, res) => {
  try {
    const { Statut_liste } = req.params; // Récupère la liste de diffusion les paramètres de la requête
    const liste = await ListeDiffusion.findAll({
      where: {
        Statut_liste: Statut_liste
      }
    });
    if (!liste) {
      return res.status(404).json({code:'404', content: 'Aucun liste trouvée avec ce statut' });
    }
    res.status(200).json({code:'201',content: liste});
  } catch (error) {
    res.status(500).json({code:'500', content: 'Erreur serveur', error });
  }
};

// Obtenir une  liste de diffusion par entreprise
exports.getlisteByEntreprise = async (req, res) => {
  try {
    const { Entreprise } = req.params; // Récupère la liste de diffusion les paramètres de la requête
    const liste = await ListeDiffusion.findAll({
      where: {
        lst_reference: Entreprise
      }
    });
    if (!liste) {
      return res.status(404).json({code:'404', content: 'Aucun liste trouvée avec cette liste' });
    }
    res.status(200).json({code:'201',content: liste});
  } catch (error) {
    res.status(500).json({code:'500', content: 'Erreur serveur', error });
  }
};

// Ajouter un liste
exports.createliste = async (req, res) => {
  try {
    const { lst_reference, lst_libelle,lst_description,Usr_reference,Statut_liste } = req.body;
    if (!lst_reference ||  !lst_libelle || !Usr_reference || !Statut_liste ) {
      return res.status(400).json({code:'500', content: 'Les champs obligatoires sont requis' });
    }
    const newliste = await ListeDiffusion.create({
      lst_reference, 
      lst_libelle,
      lst_description,
      Usr_reference,
      Statut_liste,
      date_creation: new Date(),
      date_modification: new Date(),
    });
    res.status(201).json({code:'201',content:newliste});
  } catch (error) {
    res.status(500).json({ code:'500', content: 'Erreur serveur', error });
  }
};


// Mettre à jour un utilisateur
exports.updateliste = async (req, res) => {
  try {
    const liste = await ListeDiffusion.findByPk(req.params.id);
    if (liste) {
      await liste.update(req.body);
      res.status(200).json(liste);
    } else {
      res.status(404).json({  code:'404',content: 'liste not found' });
    }
  } catch (error) {
    res.status(400).json({ code:'400', content: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteliste = async (req, res) => {
  try {
    const liste = await ListeDiffusion.findByPk(req.params.id);
    if (liste) {
      await liste.destroy();
      res.status(204).json({ code:'204', content: 'liste supprimé avec succes' });
    } else {
      res.status(404).json({ code:'404', content: 'liste not found' });
    }
  } catch (error) {
    res.status(400).json({  code:'400', content: error.message });
  }
};
