const User = require('../models/Users')

// Obtenir la liste de tous les utilisateurs avec pagination
exports.getAllUsers = async (req, res) => {
  const { page = 1, size = 25 } = req.query;
  const limit = parseInt(size);
  const offset = (parseInt(page) - 1) * limit;

  try {
    const { count, rows } = await User.findAndCountAll({
      limit,
      offset,
    });

    res.status(200).json({
      code: '200',
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      users: rows,
    });
  } catch (error) {
    res.status(400).json({code: '400', error: error.message });
  }
};

// Obtenir un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const users = await User.findByPk(req.params.id);
    if (!users) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({code:'200',content: users});
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update(req.body);
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
