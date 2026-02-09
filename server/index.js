import express from 'express'
import {connexion} from './postgres/main.js';

const app = express();
const PORT = 8000;

app.listen(PORT,()=>{
    console.log(`Server is running at PORT ${PORT}`)
})

connexion();