const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const etatController = require('../controllers/etatController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Etat:
 *       type: object
 *       required:
 *         - eta_reference
 *         - eta_libelle
 *         - eta_statut
 *       properties:
 *         eta_reference:
 *           type: string
 *           description: la reference de la Etat
 *         eta_libelle:
 *           type: string
 *           description: le libelle de la Etat
 *         eta_statut:
 *           type: integer
 *           description: la statut de la Etat actif ou non
 *         date_creation:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle la Etat  a été créé
 *         date_modification:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle la Etat a été modifié
 *       example:
 *         ID_etat: 1
 *         eta_reference: ETA_001
 *         eta_libelle: EN ATTENTE
 *         eta_statut: 1
 *         date_creation: 2023-01-01T00:00:00Z
 *         date_modification: 2023-01-01T00:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Etat
 *   description: API pour gerer les Etat
 */

/**
 * @swagger
 * /Etat:
 *  get:
 *    summary: obtenir la liste de touts les Etat
 *    tags: [Etat]
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *              schema:
 *                 type: array
 *                 items:
 *                    $ref: '#/components/schemas/Etat'
 *      404:
 *        sdescription: Etat non trouvé
 */ 

router.get('/etat',etatController.getAllEtat);

/**
 * @swagger
 * /Etat/{id}:
 *   get:
 *     summary: obtenir les informations d'un etat par ID
 *     tags: [Etat]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de l'etat
 *     responses:
 *       200:
 *         description: Les détails de l'etat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Etat'
 *       404:
 *         description: Etat non trouvée
 */

 router.get('/etat/:id',authMiddleware,etatController.getEtatById);

 /**
 * @swagger
 * /Etat/statut/{statut}:
 *   get:
 *     summary: obtenir les informations d'un etat par statut
 *     tags: [Etat]
 *     parameters:
 *       - in: path
 *         name: statut
 *         schema:
 *           type: string
 *         required: true
 *         description: Le statut de l'etat
 *     responses:
 *       200:
 *         description: Les détails de l 'etat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Etat'
 *       404:
 *         description: Etat non trouvée
 */

 router.get('/etat/statut/:statut',etatController.getEtatByStatut);

/**
 * @swagger
 * /Etat:
 *   post:
 *     summary: ajouter un nouveau etat
 *     tags: [Etat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Etat'
 *     responses:
 *       201:
 *         description: Etat créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Etat'
 *       400:
 *         description: Erreur de validation
 */
router.post('/etat', authMiddleware, etatController.createEtat);



/**
 * @swagger
 * /Etat:
 *   put:
 *     summary: Mettre à jour un etat  par ID
 *     tags: [Etat]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true 
 *         description: l'ID de l'etat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Etat'
 *     responses:
 *       200:
 *         description: L'etat a été mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Etat'
 *       404:
 *         description: Etat non trouvé
 *       400:
 *         description: Erreur de validation
 */
router.put('/etat/:id', authMiddleware, etatController.updateEtat);

/**
 * @swagger
 * /Etat/{id}:
 *   delete:
 *     summary: Supprimer un etat par ID
 *     tags: [Etat]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de l'etat
 *     responses:
 *       204:
 *         description: L'etat a été supprimé avec succès
 *       404:
 *         description: Etat non trouvé
 */
router.delete('/etat/:id', authMiddleware, etatController.deleteEtat);
module.exports = router;