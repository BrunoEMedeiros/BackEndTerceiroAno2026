import express from "express";
import cors from "cors";
import rotas from "./routes.js";

// "Ligando" o framework
const app = express();

//Liberando entrada e saida de JSON da API
app.use(express.json());

//Desligando a proteção CORS para essa API
app.use(cors());

//Redirecionando o fluxo para o arquivo de rotas
app.use(rotas);

// "Subindo" a API na porta 3000
app.listen(3000, () => {
  console.log("API no ar!");
});
