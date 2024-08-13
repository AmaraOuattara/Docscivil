const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const ProspectController = require('../controllers/ProspectsController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Prospect:
 *       type: object
 *       required:
 *         - clt_reference
 *         - clt_nom
 *         - clt_civilite
 *         - clt_contact
 *         - lst_reference
 *         - Statut_client
 *       properties:
 *         clt_reference:
 *           type: string
 *           description: la reference du Prospect
 *         clt_nom:
 *           type: string
 *           description: le nom du Prospect
 *         clt_prenom:
 *           type: integer
 *           description: le prenom du prospect
 *         clt_civilite:
 *           type: string
 *           description: la civilité du Prospect
 *         clt_contact:
 *           type: string
 *           description: le contact du Prospect
 *         lst_reference:
 *           type: string
 *           description: la reference de la liste de diffusion
 *         Statut_client:
 *           type: string
 *           description: le statut du prospect
 *         date_creation:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle la Prospect  a été créé
 *         date_modification:
 *           type: string
 *           format: date-time
 *           description: La date et l'heure à laquelle la Prospect a été modifié
 *       example:
 *         Id_clt: 1
 *         clt_reference: PRST_0001
 *         clt_nom: OUATTARA
 *         clt_prenom: AMARA AHMED
 *         clt_civilite: M
 *         clt_contact: 2250768070259
 *         lst_reference: LST_001
 *         Statut_client: 1
 *         date_creation: 2023-01-01T00:00:00Z
 *         date_modification: 2023-01-01T00:00:00Z
 */

/**
 * @swagger
 * tags:
 *   name: Prospect
 *   description: API pour gerer les Prospects
 */

/**
 * @swagger
 * /Prospect:
 *  get:
 *    summary: obtenir la liste de toutes les Prospects
 *    tags: [Prospect]
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *              schema:
 *                 type: array
 *                 items:
 *                    $ref: '#/components/schemas/Prospect'
 *      404:
 *        sdescription: Prospect non trouvé
 */ 

router.get('/Prospect',ProspectController.getAllProspects);

/**
 * @swagger
 * /Prospect/{id}:
 *   get:
 *     summary: obtenir les informations d'une Prospect par ID
 *     tags: [Prospect]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la Prospect
 *     responses:
 *       200:
 *         description: Les détails de la Prospect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prospect'
 *       404:
 *         description: Prospect non trouvée
 */

 router.get('/Prospect/:id',authMiddleware,ProspectController.getProspectById);

 /**
 * @swagger
 * /Prospect/Pagination:
 *   get:
 *     summary: obtenir les informations d'une Prospect par pagination
 *     tags: [Prospect]
 *     parameters:
 *       - in: path
 *         name: page
 *         schema:
 *           type: string
 *         required: true
 *         description: L'indice de la page
 *       - in: path
 *         name: size
 *         schema:
 *           type: string
 *         required: false
 *         description: Le nombre d'occurence par page
 *     responses:
 *       200:
 *         description: Les détails de la Prospect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prospect'
 *       404:
 *         description: Prospect non trouvée
 */

 router.get('/Prospect/pagination',authMiddleware,ProspectController.getAllProspectsWithPagn);


 /**
 * @swagger
 * /Prospect/listediffusion:
 *   get:
 *     summary: obtenir les informations d'un Prospect par liste de diffusion
 *     tags: [Prospect]
 *     parameters:
 *       - in: path
 *         name: listediffusion
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la Prospect
 *     responses:
 *       200:
 *         description: Les détails de la Prospect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prospect'
 *       404:
 *         description: Prospect non trouvée
 */

 router.get('/Prospect/listediffusion',authMiddleware,ProspectController.getProspectByListe);


/**
 * @swagger
 * /Prospect:
 *   post:
 *     summary: ajouter une nouvelle Prospect
 *     tags: [Prospect]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prospect'
 *     responses:
 *       201:
 *         description: Prospect créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prospect'
 *       400:
 *         description: Erreur de validation
 */
router.post('/Prospect', authMiddleware, ProspectController.createProspect);


/**
 * @swagger
 * /prospect:
 *   put:
 *     summary: Mettre à jour un prospect  par ID
 *     tags: [Prospect]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true 
 *         description: l'ID de l'prospect
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Prospect'
 *     responses:
 *       200:
 *         description: L'prospect a été mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Prospect'
 *       404:
 *         description: prospect non trouvé
 *       400:
 *         description: Erreur de validation
 */
 
router.put('/Prospect/:id', authMiddleware, ProspectController.updateProspect);

/**
 * @swagger
 * /Prospect/{id}:
 *   delete:
 *     summary: Supprimer une Prospect par ID
 *     tags: [Prospect]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: L'ID de la Prospect
 *     responses:
 *       204:
 *         description: La Prospect a été supprimé avec succès
 *       404:
 *         description: Prospect non trouvé
 */
router.delete('/Prospect/:id', authMiddleware, ProspectController.deleteProspect);
module.exports = router;