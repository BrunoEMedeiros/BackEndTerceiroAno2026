const api = "http://192.168.1.15:3000";
const div = document.querySelector("#container");

window.onload = carregarProdutos();

document.getElementById("uploadBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("imageInput");

  const descricao = document.querySelector("#descricao").value;
  const preco = document.querySelector("#preco").value;
  const estoque = document.querySelector("#estoque").value;

  //Uma condiconal apenas para checar se o usuário selecionou um arquivo
  if (fileInput.files.length === 0) {
    alert("Selecione uma imagem");
    return;
  }

  //Como um arquivo é essencialmente um vetor, a posição 0 é onde fica o Blob
  const imageFile = fileInput.files[0];

  // Criando um multpart form
  const formData = new FormData();

  //Anexando a imagem ao fomulario
  formData.append("descricao", descricao);
  formData.append("preco", preco);
  formData.append("estoque", estoque);
  formData.append("imagem", imageFile);

  // ----------------------- MUITO IMPORTANTE ------------------------
  // REGRA: Não passe o header 'Content-Type' manualmente!

  // Quando enviar um multpart-form data pelo body da requisição
  // o navegador automaticamente ira criar as configurações necessárias para o envio
  // se passar manualmente o navegador vai "quebrar".

  console.log(formData);
  try {
    const response = await fetch(`${api}/produto`, {
      method: "POST",
      body: formData,
    });

    if (response.status == 201) {
      alert("Produto cadastrado");
      carregarProdutos();
    } else {
      console.error("Error:", response.status);
      alert("Erro ao cadastrar produto");
    }
  } catch (error) {
    console.error("Network error during upload:", error);
  }
});

async function carregarProdutos() {
  div.innerHTML = "";
  const resposta = await fetch(`${api}/produtos`);

  const produtos = await resposta.json();

  if (produtos.length == 0) {
    const text = document.createElement("p");
    text.innerText = "Nenhuma produto cadastrado";
    div.appendChild(text);
    return;
  }

  produtos.map((produto) => {
    const container = document.createElement("div");
    container.className = "produtos";

    const descricao = document.createElement("p");
    descricao.innerHTML = produto.descricao;

    const preco = document.createElement("p");
    preco.innerHTML = produto.preco;

    const estoque = document.createElement("p");
    estoque.innerHTML = produto.estoque;

    const byteArray = new Uint8Array(produto.data.data);
    const blob = new Blob([byteArray], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    const img = document.createElement("img");
    img.src = url;
    img.style.width = "50px";
    img.style.height = "50px";

    container.append(descricao, preco, estoque, img);
    div.appendChild(container);
  });

  return;
}
