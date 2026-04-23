import bcrypt from "bcrypt";

export async function CriarHash(senha) {
  const hash = await bcrypt.hash(senha, 10);
  return hash;
}

export async function CompararSenha(senha, hash) {
  const teste = await bcrypt.compare(senha, hash);
  return teste;
}
