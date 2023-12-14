const express = require('express');
const router = express.Router();
const contactController = require ('../controllers/contactController');
const { body, param, query } = require('express-validator');


router.get('/', contactController.index);
router.post('/', body('email').notEmpty().isEmail().withMessage('Inserisci un indirizzo email valido'), 
 body('message').notEmpty().isString().withMessage('Il messaggio non può essere vuoto'),
 contactController.store);

module.exports = router;