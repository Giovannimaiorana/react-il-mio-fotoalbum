const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validationResult } = require('express-validator');


const { kebabCase } = require("lodash");

//se lo slug esiste
async function isSlugExists(slug) {
    const existingPhoto = await prisma.photo.findUnique({
        where: {
            slug: slug,
        },
    });

    return existingPhoto !== null;
}
//funzione per generare slug unico 
async function generateUniqueSlug(baseSlug) {
    let slug = baseSlug;
    let counter = 1;

    while (await isSlugExists(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    return slug;
}

//rotta index per tutte le foto
async function index(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { published, description } = req.query;


    const filter = {};
    if (published) {
        filter.published = published.toLowerCase() === 'true';
    }
    if (description) {
        filter.OR = [
            { title: { contains: description.toLowerCase() } },
            { description: { contains: description.toLowerCase() } },
        ];
    }
    console.log('Filter:', filter);
    const photo = await prisma.photo.findMany({
        where: filter,
        include:{
            categories:{
             select:{
                id:true,
                name:true
             }
            }
        }
    });

    res.json(photo);
}



//store
async function store(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const insertData = req.body;
    console.log('InsertData photo:', insertData);
    const baseSlug =kebabCase(insertData.title);
    const uniqueSlug = await generateUniqueSlug(baseSlug);
    const file=req.file;
      console.log(' file:', file);
    if(file){
        insertData.image=file.filename;
    }
    const newPhoto = await prisma.photo.create({
        data:{
            title:insertData.title,
            slug: uniqueSlug,
            description:insertData.description,
            image:insertData.image,
            categories: insertData.categories,
            userId: insertData.userId,
        },
        include:{
            categories:{
             select:{
                id:true,
                name:true
             }
            }
        }
    });
    res.json(newPhoto);

}

//rotta per show
async function show(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const dbSlug = req.params.slug;
    console.log(dbSlug);
    const data = await prisma.photo.findUnique({
        where: {
            slug: dbSlug,
        }
    });
    if (!data) {
        return res.status(404).json({ error: 'L\'elemento da te cercato non esiste' });
    }
    return res.json(data);
}


//rotta per modifica 
async function update(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const dbSlug = req.params.slug;
        const updateData = req.body;
        console.log('Update Data:', updateData);
        console.log(dbSlug);

        if (updateData.title) {
            const baseSlug = kebabCase(updateData.title);
            const uniqueSlug = await generateUniqueSlug(baseSlug);


            const existingPhoto = await prisma.photo.findFirst({
                where: {
                    slug: uniqueSlug,
                    NOT: {
                        slug: dbSlug,
                    },
                },
            });

            if (existingPhoto) {
                return res.status(400).json({ error: 'Lo slug specificato è già in uso.' });
            }

            updateData.slug = uniqueSlug;
        }

        const result = await prisma.photo.update({
            where: {
                slug: dbSlug,
            },
            data: updateData,
            include: {
                categories: true,
            },
        });

        res.json({ message: 'Foto modificata con successo', result });
    } catch (error) {
        next(error);
    }
}
//rotta delete
async function destroy(req, res) {
    const dbSlug = req.params.slug;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const photoToDelete = await prisma.photo.findUnique({
        where: {
            slug: dbSlug,
        },
    });
    if (!photoToDelete) {
        return res.status(404).json({ error: "Ila foto non esiste" });
    }
    await prisma.photo.delete({
        where: {
            slug: dbSlug,
        },
    });

    return res.json({ message: "Foto eliminata" });
}



module.exports ={
    index,
    store,
    show,
    update,
    destroy
}