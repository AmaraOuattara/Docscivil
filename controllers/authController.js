const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const { generateToken } = require('../config/auth');

// Inscription de l'utilisateur
exports.register = async (req, res) => {
  try {
    const { Usr_reference, Usr_Email, Usr_Password, Usr_Nom, Usr_Prenom, Loc_reference, Usr_Contact, Usr_Gain, Ref_TypeCompte } = req.body;
    if (!Usr_reference || !Usr_Password) {
      return res.status(400).json({code: '400', message: 'Les champs obligatoires sont requis' });
    }
    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { Usr_Contact } });
    if (existingUser) {
      return res.status(400).json({ code: '400', error: 'Ce numero est deja utilisé' });
    }

    // Hachez le mot de passe
    const hashedPassword = await bcrypt.hash(Usr_Password, 10);

    // Créez un nouvel utilisateur
    const user = await User.create({
      Usr_reference,
      Usr_Contact,
      Usr_Email,
      Usr_Password: hashedPassword,
      Usr_Nom,
      Usr_Prenom,
      Loc_reference,
      Usr_Gain,
      Ref_TypeCompte,
      date_creation: new Date(),
      date_modification: new Date(),
    });

    // Générez un token JWT
    const token = generateToken(user);

    res.status(201).json({code: '201', content: user, token: token });
  } catch (error) {
    res.status(400).json({code: '400', error: error.message });
  }
};

// Connexion de l'utilisateur
exports.login = async (req, res) => {
  try {
    const { Usr_Contact, Usr_Password } = req.body;

    // Recherchez l'utilisateur par numero de telephone
    const user = await User.findOne({ where: { Usr_Contact } });
    if (!user) {
      return res.status(400).json({code: '400', error: 'numéro de telephone ou mot de passe incorrect' });
    }

    // Vérifiez le mot de passe
    const isPasswordValid = await bcrypt.compare(Usr_Password, user.Usr_Password);
    if (!isPasswordValid) {
      return res.status(400).json({code: '400', error: 'numéro de telephone ou mot de passe incorrect'});
    }

    // Générez un token JWT
    const token = generateToken(user);

    res.status(200).json({code:'201', content: user, token: token });
  } catch (error) {
    res.status(400).json({code:'400', error: error.message });
  }
};
