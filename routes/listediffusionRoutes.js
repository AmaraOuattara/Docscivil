const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const listediffusionController = require('../controllers/listediffusionController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Listediffusion:
 *       type: object
 *       required:
 *         - lst_reference
 *         - lst_libelle
 *         - Usr_reference
 *         - Statut_liste
 *       properties:
 *         lst_reference:
 *           type: string
 *           description: la reference de la listediffusion
 *         lst_libelle:
 *           type: string
 *           description: le libelle de la listediffusion
 *         lst_description:
 *           type: integer
 *           description: la description de la listediffusion
 *         Usr_reference:
 *           type: integer
 *           description: la reference de l'utilisateur
 *         Statut_liste:
 *           type: integer
 *           description: le statut de la demande
 *         date_creation:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle la listediffusion  a été créé
 *         date_modification:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle la listediffusion a été modifié
 *       example:
 *         ID_listediffusion: 1
 *         eta_reference: ETA_001
 *         eta_libelle: EN ATTENTE
 *         eta_statut: 1
 *         date_creation: 2023-01-01T00:00:00Z
 *         date_modification: 2023-01-01T00:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Liste diffusion
 *   description: API pour gerer les listediffusion
 */

/**
 * @swagger
 * /listediffusion:
 *  get:
 *    summary: obtenir la liste de touts les listediffusion
 *    tags: [Liste diffusion]
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *              schema:
 *                 type: array
 *                 items:
 *                    $ref: '#/components/schemas/Listediffusion'
 *      404:
 *        sdescription: listediffusion non trouvé
 */ 

router.get('/listediffusion',listediffusionController.getAllListeDiffusion);

/**
 * @swagger
 * /listediffusion/{id}:
 *   get:
 *     summary: obtenir les informations d'un listediffusion par ID
 *     tags: [Liste diffusion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de l'listediffusion
 *     responses:
 *       200:
 *         description: Les détails de l'listediffusion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listediffusion'
 *       404:
 *         description: listediffusion non trouvée
 */

 router.get('/listediffusion/:id',authMiddleware,listediffusionController.getlisteById);

 /**
 * @swagger
 * /listediffusion/statut/{statut}:
 *   get:
 *     summary: obtenir les informations d'un listediffusion par statut
 *     tags: [Liste diffusion]
 *     parameters:
 *       - in: path
 *         name: statut
 *         schema:
 *           type: string
 *         required: true
 *         description: Le statut de l'listediffusion
 *     responses:
 *       200:
 *         description: Les détails de l 'listediffusion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listediffusion'
 *       404:
 *         description: listediffusion non trouvée
 */

 router.get('/listediffusion/statut/:statut',listediffusionController.getlisteByStatut);

 /**
 * @swagger
 * /listediffusion/entreprise/{entreprise}:
 *   get:
 *     summary: obtenir les informations d'un listediffusion par entreprise
 *     tags: [Liste diffusion]
 *     parameters:
 *       - in: path
 *         name: entreprise
 *         schema:
 *           type: string
 *         required: true
 *         description: L'entreprise' de l'listediffusion
 *     responses:
 *       200:
 *         description: Les détails de l 'listediffusion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listediffusion'
 *       404:
 *         description: listediffusion non trouvée
 */

 router.get('/listediffusion/entreprise/:entreprise',listediffusionController.getlisteByEntreprise);

/**
 * @swagger
 * /listediffusion:
 *   post:
 *     summary: ajouter un nouveau listediffusion
 *     tags: [Liste diffusion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Listediffusion'
 *     responses:
 *       201:
 *         description: listediffusion créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listediffusion'
 *       400:
 *         description: Erreur de validation
 */
router.post('/listediffusion', authMiddleware, listediffusionController.createliste);



/**
 * @swagger
 * /listediffusion:
 *   put:
 *     summary: Mettre à jour un listediffusion  par ID
 *     tags: [Liste diffusion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true 
 *         description: l'ID de l'listediffusion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Listediffusion'
 *     responses:
 *       200:
 *         description: L'listediffusion a été mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Listediffusion'
 *       404:
 *         description: listediffusion non trouvé
 *       400:
 *         description: Erreur de validation
 */
router.put('/listediffusion/:id', authMiddleware, listediffusionController.updateliste);

/**
 * @swagger
 * /listediffusion/{id}:
 *   delete:
 *     summary: Supprimer un listediffusion par ID
 *     tags: [Liste diffusion]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de l'listediffusion
 *     responses:
 *       204:
 *         description: L'listediffusion a été supprimé avec succès
 *       404:
 *         description: listediffusion non trouvé
 */
router.delete('/listediffusion/:id', authMiddleware, listediffusionController.deleteliste);
module.exports = router;