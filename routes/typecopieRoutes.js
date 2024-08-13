const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const typecopieController = require('../controllers/typecopieController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Typecopie:
 *       type: object
 *       required:
 *         - Typ_reference
 *         - Typ_libelle
 *         - Typ_statut
 *       properties:
 *         Typ_reference:
 *           type: string
 *           description: la reference de la Typecopie
 *         Typ_libelle:
 *           type: string
 *           description: le libelle de la Typecopie
 *         Typ_statut:
 *           type: integer
 *           description: la statut de la Typecopie actif ou non
 *         date_creation:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle la Typecopie  a été créé
 *         date_modification:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle la Typecopie a été modifié
 *       example:
 *         ID_Typecopie: 1
 *         Typ_reference: TYP_001
 *         Typ_libelle: COPIE STANDARD
 *         Typ_statut: 1
 *         date_creation: 2023-01-01T00:00:00Z
 *         date_modification: 2023-01-01T00:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Type copie
 *   description: API pour gerer les Typecopies
 */

/**
 * @swagger
 * /typecopie:
 *  get:
 *    summary: obtenir la liste de touts les Typecopie
 *    tags: [Type copie]
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *              schema:
 *                 type: array
 *                 items:
 *                    $ref: '#/components/schemas/Typecopie'
 *      404:
 *        sdescription: typecopie non trouvé
 */ 

router.get('/typecopie',typecopieController.getAllTypecopie);

/**
 * @swagger
 * /typecopie/{id}:
 *   get:
 *     summary: obtenir les informations d'un Typecopie par ID
 *     tags: [Type copie]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID du typecopie
 *     responses:
 *       200:
 *         description: Les détails du typecopie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Typecopie'
 *       404:
 *         description: Typecopie non trouvée
 */

 router.get('/typecopie/:id',typecopieController.getTypecopieById);

 /**
 * @swagger
 * /typecopie/statut/{statut}:
 *   get:
 *     summary: obtenir les informations d'un Typecopie par statut
 *     tags: [Type copie]
 *     parameters:
 *       - in: path
 *         name: statut
 *         schema:
 *           type: string
 *         required: true
 *         description: Le statut de l'Typecopie
 *     responses:
 *       200:
 *         description: Les détails de l 'Typecopie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Typecopie'
 *       404:
 *         description: Typecopie non trouvée
 */

 router.get('/typecopie/statut/:statut',typecopieController.getTypecopieByStatut);

/**
 * @swagger
 * /typecopie:
 *   post:
 *     summary: ajouter un nouveau Typecopie
 *     tags: [Type copie]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Typecopie'
 *     responses:
 *       201:
 *         description: Typecopie créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Typecopie'
 *       400:
 *         description: Erreur de validation
 */
router.post('/typecopie', authMiddleware, typecopieController.createTypecopie);



/**
 * @swagger
 * /typecopie:
 *   put:
 *     summary: Mettre à jour un Typecopie  par ID
 *     tags: [Type copie]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true 
 *         description: l'ID de l'Typecopie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Typecopie'
 *     responses:
 *       200:
 *         description: L'Typecopie a été mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Typecopie'
 *       404:
 *         description: Typecopie non trouvé
 *       400:
 *         description: Erreur de validation
 */
router.put('/typecopie/:id', authMiddleware, typecopieController.updateTypecopie);

/**
 * @swagger
 * /typecopie/{id}:
 *   delete:
 *     summary: Supprimer un Typecopie par ID
 *     tags: [Type copie]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de l'Typecopie
 *     responses:
 *       204:
 *         description: L'Typecopie a été supprimé avec succès
 *       404:
 *         description: Typecopie non trouvé
 */
router.delete('/typecopie/:id', authMiddleware, typecopieController.deleteTypecopie);
module.exports = router;