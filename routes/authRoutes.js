const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


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
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         users:
 *           $ref: '#/components/schemas/Users'
 *         token:
 *           type: string
 *           description: JWT token
 *       example:
 *         users:
 *           ID_User: 1
 *           Usr_Contact: 2250768070259
 *           Usr_Email: johndoe@example.com
 *           Usr_nom: John
 *           Usr_Prenom: Doe
 *         token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqb2huZG9lIiwiaWF0IjoxNjE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
 */

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: API for users authentication
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: creer un nouvel utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad request
 */
router.post('/register',  authController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentification de l'utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: johndoe@example.com
 *               password: secret
 *     responses:
 *       200:
 *         description: Authentification reussi!
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid email or password
 */
router.post('/login' , authController.login);

module.exports = router;
