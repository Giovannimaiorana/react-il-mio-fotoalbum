const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//rotta index
async function index(req, res) {
    const users = await prisma.user.findMany();
    res.json(users);
}



//rotta store 
async function store(req, res) {
    try {
        const insertData = req.body;
        console.log('Dati ricevuti:', insertData);
        const newUser = await prisma.user.create({
            data: {
                name: insertData.name,
                email:insertData.email,
                password: insertData.password,
            },
            include:{
                photos:true
            }
        });
        res.json(newUser);
    } catch (error) {
        console.error('Errore durante la creazione del user', error);
        res.status(500).json({ error: 'Errore durante la creazione dell user' });
    }
}

module.exports ={
    index,
    store

}