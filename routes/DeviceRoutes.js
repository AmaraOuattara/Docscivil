const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       required:
 *         - push_user
 *         - push_token
 *       properties:
 *         push_indice:
 *           type: integer
 *           description: L'id auto-généré de l'utilisateur
 *         push_user:
 *           type: string
 *           description: Référence de l'utilisateur
 *         push_token:
 *           type: string
 *           description: Le token Firebase de l'utilisateur
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle le token du device a été créé
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle le token du device a été modifié
 *       example:
 *         push_indice: 1
 *         push_user: OUAT_3015896
 *         push_token: x06jjdhttrvfobzzfdehbeffgofnsgzbfkfuggvv
 *         created_at: 2023-01-01T00:00:00Z
 *         updated_at: 2023-01-01T00:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Device
 *   description: API pour gérer les tokens des devices
 */

/**
 * @swagger
 * /Device:
 *   get:
 *     summary: Obtenir la liste de tous les tokens des devices
 *     tags: [Device]
 *     responses:
 *       200:
 *         description: La liste des tokens des devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 */
router.get('/Device', authMiddleware, deviceController.getAllDevices);

/**
 * @swagger
 * /Device/{id}:
 *   get:
 *     summary: Obtenir un device par ID
 *     tags: [Device]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du device
 *     responses:
 *       200:
 *         description: Les détails du device
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       404:
 *         description: Device non trouvé
 */
router.get('/Device/:id', authMiddleware, deviceController.getDeviceById);

/**
 * @swagger
 * /Device:
 *   post:
 *     summary: Ajouter un nouveau device
 *     tags: [Device]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       201:
 *         description: Device créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       400:
 *         description: Erreur de validation
 */
router.post('/Device', authMiddleware, deviceController.createDevice);

/**
 * @swagger
 * /Device/{id}:
 *   put:
 *     summary: Mettre à jour un device par ID
 *     tags: [Device]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du device
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       200:
 *         description: Le device a été mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Device'
 *       404:
 *         description: Device non trouvé
 *       400:
 *         description: Erreur de validation
 */
router.put('/Device/:id', authMiddleware, deviceController.updateDevice);

/**
 * @swagger
 * /Device/{id}:
 *   delete:
 *     summary: Supprimer un device par ID
 *     tags: [Device]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du device
 *     responses:
 *       204:
 *         description: Le device a été supprimé avec succès
 *       404:
 *         description: Device non trouvé
 */
router.delete('/Device/:id', authMiddleware, deviceController.deleteDevice);

module.exports = router;
