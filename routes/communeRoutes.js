const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const communeController = require('../controllers/communeController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Commune:
 *       type: object
 *       required:
 *         - ref_commune
 *         - commune
 *         - statut
 *       properties:
 *         ref_commune:
 *           type: string
 *           description: la reference de la commune
 *         commune:
 *           type: string
 *           description: le libelle de la commune
 *         statut:
 *           type: integer
 *           description: la statut de la commune actif ou non
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle le token du device a été créé
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle le token du device a été modifié
 *       example:
 *         ref_commune: ABJ_OKJHTR
 *         commune: ABOBO
 *         statut: 1
 *         created_at: 2023-01-01T00:00:00Z
 *         updated_at: 2023-01-01T00:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Commune
 *   description: API pour gerer les communes
 */

/**
 * @swagger
 * /Commune:
 *  get:
 *    summary: obtenir la liste de toutes les communes
 *    tags: [Commune]
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *              schema:
 *                 type: array
 *                 items:
 *                    $ref: '#/components/schemas/Commune'
 *      404:
 *        sdescription: Commune non trouvé
 */ 

router.get('/commune',communeController.getAllCommune);

/**
 * @swagger
 * /Commune/{id}:
 *   get:
 *     summary: obtenir les informations d'une commune par ID
 *     tags: [Commune]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la commune
 *     responses:
 *       200:
 *         description: Les détails de la commune
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commune'
 *       404:
 *         description: Commune non trouvée
 */

 router.get('/commune/:id',authMiddleware,communeController.getCommuneById);

/**
 * @swagger
 * /Commune:
 *   post:
 *     summary: ajouter une nouvelle commune
 *     tags: [Commune]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Commune'
 *     responses:
 *       201:
 *         description: Commune créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commune'
 *       400:
 *         description: Erreur de validation
 */
router.post('/Commune', authMiddleware, communeController.createCommune);

/**
 * @swagger
 * /Commune/{id}:
 *   put:
 *     summary: Mettre à jour une commune  par ID
 *     tags: [Commune]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true 
 *         description: l'ID de la commune
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Commune'
 *     responses:
 *       200:
 *         description: Lcommune a été mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Commune'
 *       404:
 *         description: Communece non trouvé
 *       400:
 *         description: Erreur de validation
 */
router.put('/Commune/:id', authMiddleware, communeController.updateCommune);

/**
 * @swagger
 * /Commune/{id}:
 *   delete:
 *     summary: Supprimer une commune par ID
 *     tags: [Commune]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la commune
 *     responses:
 *       204:
 *         description: La commune a été supprimé avec succès
 *       404:
 *         description: Commune non trouvé
 */
router.delete('/Commune/:id', authMiddleware, communeController.deleteCommune);
module.exports = router;