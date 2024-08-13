const Prospect = require('../models/Prospect')

// Obtenir la liste de tous les prpsêcts
exports.getAllProspects = async (req, res) => {
  try {
    const prospect = await Prospect.findAll();
    res.status(200).json({code: '201',content: prospect});
  } catch (error) {
    res.status(500).json({ code: '500',content: 'Erreur serveur', error });
  }
};

// Obtenir la liste de tous les utilisateurs avec pagination
exports.getAllProspectsWithPagn = async (req, res) => {
  const { page = 1, size = 25 } = req.query;
  const limit = parseInt(size);
  const offset = (parseInt(page) - 1) * limit;

  try {
    const { count, rows } = await Prospect.findAndCountAll({
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
exports.getProspectById = async (req, res) => {
  try {
    const prospect = await Prospect.findByPk(req.params.id);
    if (!prospect) {
      return res.status(404).json({code: '404', content: 'Utilisateur non trouvé' });
    }
    res.status(200).json({code:'200',content: prospect});
  } catch (error) {
    res.status(500).json({ code: '500',content: 'Erreur serveur', error });
  }
};

// Obtenir une prospect par liste de diffusion
exports.getProspectByListe = async (req, res) => {
  try {
    const { liste } = req.params; // Récupère la liste de diffusion les paramètres de la requête
    const prospect = await Prospect.findAll({
      where: {
        lst_reference: liste
      }
    });
    if (!prospect) {
      return res.status(404).json({code:'404', content: 'Aucun prospect trouvée avec cette liste' });
    }
    res.status(200).json({code:'201',content: prospect});
  } catch (error) {
    res.status(500).json({code:'500', content: 'Erreur serveur', error });
  }
};

// Ajouter un prospect
exports.createProspect = async (req, res) => {
  try {
    const { clt_reference, clt_nom,clt_prenom,clt_civilite,clt_contact,lst_reference,Statut_client } = req.body;
    if (!clt_reference ||  !clt_nom || !clt_contact || !lst_reference || !Statut_client) {
      return res.status(400).json({code:'500', content: 'Les champs obligatoires sont requis' });
    }
    const newProspect = await Prospect.create({
      clt_reference, 
      clt_nom,
      clt_prenom,
      clt_civilite,
      clt_contact,
      lst_reference,
      Statut_client,
      date_creation: new Date(),
      date_modification: new Date(),
    });
    res.status(201).json({code:'201',content:newProspect});
  } catch (error) {
    res.status(500).json({ code:'500', content: 'Erreur serveur', error });
  }
};


// Mettre à jour un utilisateur
exports.updateProspect = async (req, res) => {
  try {
    const prospect = await Prospect.findByPk(req.params.id);
    if (prospect) {
      await Prospect.update(req.body);
      res.status(200).json(prospect);
    } else {
      res.status(404).json({ error: 'Prospect not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteProspect = async (req, res) => {
  try {
    const prospect = await Prospect.findByPk(req.params.id);
    if (prospect) {
      await Prospect.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Prospect not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
