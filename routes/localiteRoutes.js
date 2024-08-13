const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const localiteController = require('../controllers/localiteController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Localite:
 *       type: object
 *       required:
 *         - loc_reference
 *         - loc_libelle
 *         - loc_statut
 *         - pay_reference
 *         - Zne_reference
 *       properties:
 *         loc_reference:
 *           type: string
 *           description: la reference de la localite
 *         loc_libelle:
 *           type: string
 *           description: le libelle de la localite
 *         loc_statut:
 *           type: integer
 *           description: la statut de la localite actif ou non
 *         pay_reference:
 *           type: string
 *           description: le pays de la localite
 *         Zne_reference:
 *           type: string
 *           description: la zone de la localite
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle la localite  a été créé
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle la localite a été modifié
 *       example:
 *         ID_localite: 1
 *         loc_reference: LOC_001
 *         loc_libelle: ABOBO
 *         loc_stat: 1
 *         pay_reference: PAY_001
 *         Zne_reference: ZNE_001
 *         created_at: 2023-01-01T00:00:00Z
 *         updated_at: 2023-01-01T00:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Localite
 *   description: API pour gerer les localites
 */

/**
 * @swagger
 * /Localite:
 *  get:
 *    summary: obtenir la liste de toutes les localites
 *    tags: [Localite]
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *              schema:
 *                 type: array
 *                 items:
 *                    $ref: '#/components/schemas/Localite'
 *      404:
 *        sdescription: Localite non trouvé
 */ 

router.get('/localite',localiteController.getAllLocalite);

/**
 * @swagger
 * /Localite/{id}:
 *   get:
 *     summary: obtenir les informations d'une localite par ID
 *     tags: [Localite]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la localite
 *     responses:
 *       200:
 *         description: Les détails de la localite
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Localite'
 *       404:
 *         description: Localite non trouvée
 */

 router.get('/localite/:id',authMiddleware,localiteController.getLocaliteById);

 /**
 * @swagger
 * /Localite/statut/{statut}:
 *   get:
 *     summary: obtenir les informations d'une localite par statut
 *     tags: [Localite]
 *     parameters:
 *       - in: path
 *         name: statut
 *         schema:
 *           type: string
 *         required: true
 *         description: Le statut de la localite
 *     responses:
 *       200:
 *         description: Les détails de la localite
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Localite'
 *       404:
 *         description: Localite non trouvée
 */

 router.get('/localite/statut/:statut',localiteController.getLocalitesByStatut);

/**
 * @swagger
 * /Localite:
 *   post:
 *     summary: ajouter une nouvelle Localite
 *     tags: [Localite]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Localite'
 *     responses:
 *       201:
 *         description: Localite créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Localite'
 *       400:
 *         description: Erreur de validation
 */
router.post('/localite', authMiddleware, localiteController.createLocalite);

//obtenir la liste des localités par zone
/**
 * @swagger
 * /Localite/zone:
 *   get:
 *     summary: obtenir la liste des localites par zone et par statut
 *     tags: [Localite]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Localite'
 *     responses:
 *       201:
 *         description: Localite créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Localite'
 *       400:
 *         description: Erreur de validation
 */
router.get('/localite/zone', localiteController.getLocalitesByStatutAndZone);

/**
 * @swagger
 * /Localite/zone:
 *   get:
 *     summary: obtenir les informations d'une localite par statut et par zone
 *     tags: [Localite]
 *     parameters:
 *       - in: path
 *         name: statut
 *         schema:
 *           type: string
 *         required: true
 *         description: Le statut de la localite
 *       - in: path
 *         name: zone
 *         schema:
 *           type: string
 *         required: true
 *         description: La zone de la localite
 *     responses:
 *       200:
 *         description: Les détails de la localite
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Localite'
 *       404:
 *         description: Localite non trouvée
 */
 
router.put('/localite/:id', authMiddleware, localiteController.updateLocalite);

/**
 * @swagger
 * /Localite/{id}:
 *   delete:
 *     summary: Supprimer une Localite par ID
 *     tags: [Localite]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la Localite
 *     responses:
 *       204:
 *         description: La Localite a été supprimé avec succès
 *       404:
 *         description: Localite non trouvé
 */
router.delete('/localite/:id', authMiddleware, localiteController.deleteLocalite);
module.exports = router;