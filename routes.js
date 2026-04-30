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

rotas.post("/produto", async (req, res) => {
  const { descricao, preco, estoque } = req.body;
  const { name, data, mimetype } = req.files.imagem;

  const produto =
    await sql`insert into produtos(descricao, preco, estoque) values (${descricao},${parseFloat(
      preco
    )},${parseInt(estoque)}) RETURNING id`;

  await sql`insert into imagens(descricao, data, mimetype, produto_id) values(${name},${data},${mimetype},${produto[0].id})`;

  return res.status(201).json({ msg: "produto cadastrado" });
});

rotas.get("/produtos", async (req, res) => {
  const produtos =
    await sql`select p.id, p.descricao, p.preco, p.estoque, i.data from produtos as p join imagens as i
on p.id = i.produto_id`;

  return res.status(200).json(produtos);
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

  console.log(imagens);

  return res.status(200).json(imagens);
});
export default rotas;
