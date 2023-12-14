const express = require("express");
const dotenv = require("dotenv");
const photosRouter = require("./routers/photosRouter");
const CategoriesRouter= require ("./routers/categoriesRouter");
const UserRouter= require("./routers/userRouter");
const contactRouter = require ("./routers/contactRouter");


const app = express();
const port = 3000;

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


app.use("/photo", photosRouter);
app.use("/category", CategoriesRouter);
app.use("/user", UserRouter);
app.use("/contact", contactRouter);



app.listen(port, () => {
    console.log(`App attiva su http://localhost:${port}`);
});