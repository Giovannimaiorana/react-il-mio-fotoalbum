const express = require('express');
const router = express.Router();
const photosController = require ('../controllers/photosController');
const multer = require ('multer');
const { body, param, query } = require('express-validator');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public");
    },
    filename: function(req, file, cb){
        cb(null,Date.now()+ "_"+ file.originalname );
    },
});

router.get('/', query("published").optional().isBoolean().withMessage('Il parametro "published" deve essere un booleano'),
query('content').optional().trim().escape(), photosController.index);

router.post('/', multer({ storage: storage }).single("image"),[
    body('title').notEmpty().isString().withMessage('Il titolo non può essere vuoto'),
    body('description').isString().notEmpty().withMessage('La descrizione non può essere vuota'),
    body('image').custom((value, {req}) => {
        if(!req.file) throw new Error("devi per forza caricare un immagine")
        return true;
    })
], photosController.store);


router.get('/:slug',param("slug").isLength({ min: 2 }).withMessage("Lo slug deve essere lungo almeno 2 caratteri").isLength({ max: 50 }).withMessage("Lo slug  non deve superare i 50 caratteri"),
 photosController.show);


router.put('/:slug',param("slug").isLength({ min: 2 }).withMessage("Lo slug deve essere lungo almeno 2 caratteri").isLength({ max: 50 }).withMessage("Lo slug  non deve superare i 50 caratteri"), 
body("title").notEmpty().isString().withMessage("devi inserire il titolo"), 
body("description").notEmpty().isString().withMessage("devi inserire la descrizione") , 
photosController.update);

router.delete('/:slug',
    param("slug").isLength({ min: 2 }).withMessage("Lo slug deve essere lungo almeno 2 caratteri").isLength({ max: 50 }).withMessage("Lo slug  non deve superare i 50 caratteri"),
    photosController.destroy);
module.exports = router;