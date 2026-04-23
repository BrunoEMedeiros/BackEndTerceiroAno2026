const api = "http://192.168.1.15:3000";
const div = document.querySelector("#container");

window.onload = carregarImagem();

document.getElementById("uploadBtn").addEventListener("click", async () => {
  const fileInput = document.getElementById("imageInput");

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
  formData.append("imagem", imageFile);

  // ----------------------- MUITO IMPORTANTE ------------------------
  // REGRA: Não passe o header 'Content-Type' manualmente!

  // Quando enviar um multpart-form data pelo body da requisição
  // o navegador automaticamente ira criar as configurações necessárias para o envio
  // se passar manualmente o navegador vai "quebrar".

  try {
    const response = await fetch(`${api}/imagem`, {
      method: "POST",
      body: formData,
    });

    if (response.status == 201) {
      alert("Imagem adicionada");
    } else {
      console.error("Upload failed with status:", response.status);
      alert("Upload failed.");
    }
  } catch (error) {
    console.error("Network error during upload:", error);
  }
});

async function carregarImagem() {
  const resposta = await fetch(`${api}/imagens`);

  const imagens = await resposta.json();

  if (imagens.length == 0) {
    const text = document.createElement("p");
    text.innerText = "Nenhuma imagem cadastrada";
    div.appendChild(text);
    return;
  }

  imagens.map((imagem) => {
    const byteArray = new Uint8Array(imagem.data.data);
    const blob = new Blob([byteArray], { type: "image/png" });
    const url = URL.createObjectURL(blob);
    const img = document.createElement("img");
    img.src = url;
    img.style.width = "200px";
    img.style.height = "200px";
    div.appendChild(img);
  });

  return;
}
