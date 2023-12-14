const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validationResult } = require('express-validator');

//rotta index
async function index(req, res) { 
    const messages = await prisma.contact.findMany();
    res.json(messages);
}

//rotta store
async function store(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const insertData = req.body;
        console.log('Dati ricevuti:', insertData);
        const newMessage = await prisma.contact.create({
            data: {
                email:insertData.email,
                message: insertData.message,
            },
        });
        res.json(newMessage);
    } catch (error) {
        console.error('Errore durante invio messaggio', error);
        res.status(500).json({ error: 'Errore durante invio messaggio' });
    }
}

module.exports ={
    index,
    store

}