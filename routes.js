import express from "express";
import sql from "./database.js";
import { CompararSenha, CriarHash } from "./utils.js";

const rotas = express.Router();

rotas.get("/pessoas", async (req, res) => {
  const pessoas = await sql`select * from pessoa`;
  return res.status(200).json(pessoas);
});

rotas.post("/pessoas", async (req, res) => {
  const { nome, email, senha } = req.body;

  const hash = await CriarHash(senha);

  await sql`insert into pessoa(nome, email, senha) values(${nome}, ${email}, ${hash})`;

  return res.status(201).json("Cadastrado");
});

rotas.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const usuario = await sql`select senha from pessoa where email = ${email} `;

  if (usuario[0].length != 0) {
    const teste = await CompararSenha(senha, usuario[0].senha);
    if (teste) {
      return res.status(200).json("Bem vindo");
    }
    return res.status(401).json("senha incorreta");
  }
  return res.status(401).json("email não cadastrado");
});

rotas.post("/imagem", async (req, res) => {
  //Quando criar o objeto que sera enviado no front-end, ajuste para que os nomes "batam" com esses
  if (!req.files || !req.files.imagem) {
    return res.status(400).send("No file uploaded.");
  }

  const { name, data, mimetype } = req.files.imagem;

  await sql`insert into imagens (descricao, data, mimetype) values(${name}, ${data}, ${mimetype})`;
  return res.status(201).json({ msg: "imagem cadastrada!" });
});

rotas.get("/imagens", async (req, res) => {
  const imagens = await sql`select * from imagens`;

  return res.status(200).json(imagens);
});
export default rotas;
