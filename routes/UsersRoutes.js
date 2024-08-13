const express = require('express');
const router = express.Router();
const userController = require('../controllers/UsersController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - Usr_reference
 *         - Usr_Password
 *         - Usr_nom
 *         - Usr_Prenom
 *         - Loc_reference
 *         - Usr_Contact
 *       properties:
 *         ID_user:
 *           type: integer
 *           description: The auto-generated id of the user
 *         Usr_reference:
 *           type: string
 *           description: The reference of the user
 *         Usr_Email:
 *           type: string
 *           description: The email of the user
 *         Usr_Password:
 *           type: string
 *           description: The password of the user
 *         Usr_nom:
 *           type: string
 *           description: The first name of the user
 *         Usr_Prenom:
 *           type: string
 *           description: The last name of the user
 *         Loc_reference:
 *           type: string
 *           description: The reference of the user location
 *         Usr_Contact:
 *           type: string
 *           description: The number phone of the user
 *         Usr_Gain:
 *           type: string
 *           description:  The gain of user when he referre somebody
 *         Ref_TypeCompte:
 *           type: string
 *           description: The Account type of the user
 *         date_creation:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was created
 *         date_modification:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was last updated
 *         Usr_statut:
 *           type: boolean
 *           description: Whether the user is active or not
 *       example:
 *         ID_user: 1
 *         Usr_reference: OUAT_02154
 *         Usr_Email: johndoe@example.com
 *         Usr_Password: secret
 *         Usr_nom: John
 *         Usr_Prenom: Doe
 *         Loc_reference: LOC_0001
 *         Usr_Gain: 0
 *         Ref_TypeCompte: TCPT_001
 *         Usr_statut: 1         
 *         Usr_Contact: 2250768070259
 *         date_creation: 2023-01-01T00:00:00Z
 *         date_modification: 2023-01-01T00:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API pour gérer les utilisateurs
 */


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtenir la liste de tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: La liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 */
router.get('/users', userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtenir un utilisateur par ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: L'ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Les détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/users/:id',authMiddleware, userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur par ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: L'ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       200:
 *         description: L'utilisateur a été mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: Utilisateur non trouvé
 *       400:
 *         description: Erreur de validation
 */
router.put('/users/:id', authMiddleware, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur par ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: L'ID de l'utilisateur
 *     responses:
 *       204:
 *         description: L'utilisateur a été supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/users/:id',authMiddleware, userController.deleteUser);

module.exports = router;
