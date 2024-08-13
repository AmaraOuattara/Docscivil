const Device = require('../models/Device');

// Obtenir la liste de tous les devices
exports.getAllDevices = async (req, res) => {
  try {
    const devices = await Device.findAll();
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Obtenir un device par ID
exports.getDeviceById = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device non trouvé' });
    }
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Ajouter un nouveau device
exports.createDevice = async (req, res) => {
  try {
    const { push_user, push_token } = req.body;
    if (!push_user || !push_token) {
      return res.status(400).json({ message: 'Les champs push_user et push_token sont requis' });
    }
    const newDevice = await Device.create({
      push_user,
      push_token,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Mettre à jour un device par ID
exports.updateDevice = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device non trouvé' });
    }
    await device.update(req.body);
    res.status(200).json(device);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de validation', error });
  }
};

// Supprimer un device par ID
exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (!device) {
      return res.status(404).json({ message: 'Device non trouvé' });
    }
    await device.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
