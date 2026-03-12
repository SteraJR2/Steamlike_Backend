let gameDisplay = document.getElementById("gameDisplay");
let fetchedData;
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const backBtn = document.getElementById("backBtn");
backBtn.innerHTML = `<a style="color:white; text-decoration:none" href="index.html">Back</a>`;

backBtn.onclick = () => {
  localStorage.setItem("wentBack", "true");
};

async function getGameFromUrl(id) {
  const res = await fetch(`http://localhost:3000/games/${id}`);
  fetchedData = await res.json();
  gameDisplay.innerHTML = `<span>Name: ${fetchedData.nome}<br><br>Tags: ${fetchedData.tags}<br><br>Developer: ${fetchedData.sviluppatore}<br><br>Price: ${fetchedData.prezzo}$</span>`;
}
getGameFromUrl(id);
