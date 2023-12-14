const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//rotta index
async function index(req, res) {
    const categories = await prisma.category.findMany();
    res.json(categories);
}



//rotta store 
async function store(req, res) {
    try {
        const insertData = req.body;
        console.log('Dati ricevuti:', insertData);
        const newCategory = await prisma.category.create({
            data: {
                name: insertData.name,
            },
        });
        res.json(newCategory);
    } catch (error) {
        console.error('Errore durante la creazione della categoria:', error);
        res.status(500).json({ error: 'Errore durante la creazione della categoria' });
    }
}

module.exports ={
    index,
    store

}