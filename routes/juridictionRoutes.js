const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const juridictionController = require('../controllers/juridictionController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Juridiction:
 *       type: object
 *       required:
 *         - jrd_reference
 *         - jrd_libelle
 *         - jrd_statut
 *       properties:
 *         jrd_reference:
 *           type: string
 *           description: la reference de la Juridiction
 *         jrd_libelle:
 *           type: string
 *           description: le libelle de la Juridiction
 *         jrd_statut:
 *           type: integer
 *           description: la statut de la Juridiction actif ou non
 *         date_creation:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle la Juridiction  a été créé
 *         date_modification:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle la Juridiction a été modifié
 *       example:
 *         ID_juridiction: 1
 *         jrd_reference: JRD_001
 *         jrd_libelle: MAIRIE
 *         jrd_statut: 1
 *         date_creation: 2023-01-01T00:00:00Z
 *         date_modification: 2023-01-01T00:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Juridiction
 *   description: API pour gerer les juridiction
 */

/**
 * @swagger
 * /Juridiction:
 *  get:
 *    summary: obtenir la liste de toutes les juridiction
 *    tags: [Juridiction]
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *              schema:
 *                 type: array
 *                 items:
 *                    $ref: '#/components/schemas/Juridiction'
 *      404:
 *        sdescription: juridiction non trouvé
 */ 

router.get('/juridiction',juridictionController.getAllJuridiction);

/**
 * @swagger
 * /Juridiction/{id}:
 *   get:
 *     summary: obtenir les informations d'une Juridiction par ID
 *     tags: [Juridiction]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la Juridiction
 *     responses:
 *       200:
 *         description: Les détails de la Juridiction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Juridiction'
 *       404:
 *         description: Juridiction non trouvée
 */

 router.get('/juridiction/:id',authMiddleware,juridictionController.getJuridictionById);

 /**
 * @swagger
 * /Juridiction/statut/{statut}:
 *   get:
 *     summary: obtenir les informations d'une Juridiction par statut
 *     tags: [Juridiction]
 *     parameters:
 *       - in: path
 *         name: statut
 *         schema:
 *           type: string
 *         required: true
 *         description: Le statut de la Juridiction
 *     responses:
 *       200:
 *         description: Les détails de la Juridiction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Juridiction'
 *       404:
 *         description: Juridiction non trouvée
 */

 router.get('/juridiction/statut/:statut',juridictionController.getJuridictionByStatut);

/**
 * @swagger
 * /Juridiction:
 *   post:
 *     summary: ajouter une nouvelle Juridiction
 *     tags: [Juridiction]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Juridiction'
 *     responses:
 *       201:
 *         description: juridiction créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Juridiction'
 *       400:
 *         description: Erreur de validation
 */
router.post('/juridiction', authMiddleware, juridictionController.createJuridiction);



/**
 * @swagger
 * /Juridiction:
 *   put:
 *     summary: Mettre à jour une juridiction  par ID
 *     tags: [Juridiction]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true 
 *         description: l'ID de la Juridiction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Juridiction'
 *     responses:
 *       200:
 *         description: La juridiction a été mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Juridiction'
 *       404:
 *         description: Juridiction non trouvé
 *       400:
 *         description: Erreur de validation
 */
router.put('/juridiction/:id', authMiddleware, juridictionController.updateJuridiction);

/**
 * @swagger
 * /Juridiction/{id}:
 *   delete:
 *     summary: Supprimer une juridiction par ID
 *     tags: [Juridiction]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la juridiction
 *     responses:
 *       204:
 *         description: La juridiction a été supprimé avec succès
 *       404:
 *         description: Juridiction non trouvé
 */
router.delete('/juridiction/:id', authMiddleware, juridictionController.deleteJuridiction);
module.exports = router;