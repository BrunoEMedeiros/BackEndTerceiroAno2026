import express from "express";
import cors from "cors";
import rotas from "./routes.js";
import fileUpload from "express-fileupload";

// "Ligando" o framework
const app = express();

//Desligando a proteção CORS para essa API
app.use(cors());

//Liberando entrada e saida de JSON da API
app.use(express.json());

//Adicionando o midleware para
app.use(fileUpload());

//Redirecionando o fluxo para o arquivo de rotas
app.use(rotas);

// "Subindo" a API na porta 3000
app.listen(3000, () => {
  console.log("API no ar!");
});
