const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const zoneController = require('../controllers/zoneController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Zone:
 *       type: object
 *       required:
 *         - zne_reference
 *         - zne_libelle
 *         - zne_statut
 *       properties:
 *         zne_reference:
 *           type: string
 *           description: la reference de la zone
 *         zne_libelle:
 *           type: string
 *           description: le libelle de la zone
 *         zne_statut:
 *           type: integer
 *           description: la statut de la zone actif ou non
 *         date_creation:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle la zone  a été créé
 *         date_modification:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle la zone a été modifié
 *       example:
 *         ID_zone: 1
 *         zne_reference: ETA_001
 *         zne_libelle: EN ATTENTE
 *         zne_statut: 1
 *         date_creation: 2023-01-01T00:00:00Z
 *         date_modification: 2023-01-01T00:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Zone
 *   description: API pour gerer les zones
 */

/**
 * @swagger
 * /zone:
 *  get:
 *    summary: obtenir la liste de touts les zone
 *    tags: [Zone]
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *              schema:
 *                 type: array
 *                 items:
 *                    $ref: '#/components/schemas/Zone'
 *      404:
 *        sdescription: Zone non trouvé
 */ 

router.get('/zone',zoneController.getAllZone);

/**
 * @swagger
 * /zone/{id}:
 *   get:
 *     summary: obtenir les informations d'un zone par ID
 *     tags: [Zone]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de l'zone
 *     responses:
 *       200:
 *         description: Les détails de l'zone
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Zone'
 *       404:
 *         description: zone non trouvée
 */

 router.get('/zone/:id',zoneController.getZoneById);

 /**
 * @swagger
 * /zone/statut/{statut}:
 *   get:
 *     summary: obtenir les informations d'un zone par statut
 *     tags: [Zone]
 *     parameters:
 *       - in: path
 *         name: statut
 *         schema:
 *           type: string
 *         required: true
 *         description: Le statut de l'zone
 *     responses:
 *       200:
 *         description: Les détails de l 'zone
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Zone'
 *       404:
 *         description: zone non trouvée
 */

 router.get('/zone/statut/:statut',zoneController.getZoneByStatut);

/**
 * @swagger
 * /zone:
 *   post:
 *     summary: ajouter un nouveau zone
 *     tags: [Zone]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Zone'
 *     responses:
 *       201:
 *         description: zone créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Zone'
 *       400:
 *         description: Erreur de validation
 */
router.post('/zone', authMiddleware, zoneController.createZone);



/**
 * @swagger
 * /zone:
 *   put:
 *     summary: Mettre à jour un zone  par ID
 *     tags: [Zone]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true 
 *         description: l'ID de l'zone
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Zone'
 *     responses:
 *       200:
 *         description: L'zone a été mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Zone'
 *       404:
 *         description: zone non trouvé
 *       400:
 *         description: Erreur de validation
 */
router.put('/zone/:id', authMiddleware, zoneController.updateZone);

/**
 * @swagger
 * /zone/{id}:
 *   delete:
 *     summary: Supprimer un zone par ID
 *     tags: [Zone]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de l'zone
 *     responses:
 *       204:
 *         description: L'zone a été supprimé avec succès
 *       404:
 *         description: zone non trouvé
 */
router.delete('/zone/:id', authMiddleware, zoneController.deleteZone);
module.exports = router;