import express from "express";
import bodyParser from "body-parser";
import connectDb from "./config/dbConnection.js";
import errorHandler from "./middleware/errorHandler.js";
import dotenv from "dotenv";
import {dirname} from "path";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();


connectDb();
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 2000;



const staticPath = path.join(__dirname, "public2");
app.use(express.static(staticPath));
console.log(staticPath);

// import mainRoutes from "./routes/mainRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import hostelRoutes from "./routes/hostelRoutes.js";
import wardenRoutes from "./routes/wardenRoutes.js";


app.get("/", (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json()); // bodyparser
// app.use("/api", mainRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/warden", wardenRoutes);
app.use("/api/students", hostelRoutes);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server Listening on port number ${port}.`);
});


